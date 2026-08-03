import { unzipSync } from "fflate";

/**
 * Klient mot Bihrs eBihr Web API v2.1.
 *
 * v2.1 och inte v3: det är v2.1 som har de tre kataloger portalen visar
 * (Extended, HardPart, RiderGear). v3 har en enda sammanslagen produktkatalog
 * med helt andra kolumnnamn, och den motsvarar ingenting Bihr själva erbjuder.
 *
 * Katalogerna returneras direkt som ZIP — ingen bestäl-och-vänta som i v3.
 * Statusgränsen är ett anrop per sekund och gäller hela API:et.
 */

const BASE = "https://api.bihr.net";
const MIN_CALL_INTERVAL_MS = 1200;

export type EssentialCatalog = "EssentialHardPart" | "EssentialRiderGear" | "EssentialExtended";

export type GenerationHistoryEntry = {
  CreationDateTime: string;
  CatalogType: string;
  CatalogCompletion: string;
  GenerationStatus: string;
  TicketId: string;
  DownloadId: string;
};

export class BihrClient {
  private token: string | null = null;
  private tokenExpiresAt = 0;
  private lastCallAt = 0;

  constructor(
    private readonly customerCode: string,
    private readonly apiKey: string,
  ) {}

  private async throttle(): Promise<void> {
    const wait = this.lastCallAt + MIN_CALL_INTERVAL_MS - Date.now();
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    this.lastCallAt = Date.now();
  }

  private async getToken(): Promise<string> {
    // 60 sekunders marginal — en token som går ut mitt i en nedladdning på
    // tiotals MB skulle spränga hela körningen.
    if (this.token && Date.now() < this.tokenExpiresAt - 60_000) {
      return this.token;
    }

    await this.throttle();

    const form = new FormData();
    form.set("UserName", this.customerCode);
    form.set("PassWord", this.apiKey);

    const response = await fetch(`${BASE}/api/v2.1/Authentication/Token`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Bihr avvisade inloggningen: HTTP ${response.status}`);
    }

    const data = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) {
      throw new Error("Bihr returnerade ingen access_token.");
    }

    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in ?? 1800) * 1000;
    return this.token;
  }

  private async call(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();
    await this.throttle();

    return fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** Hämtar katalogen som ZIP. Bihr svarar direkt med filen. */
  async fetchCatalog(catalog: EssentialCatalog): Promise<Response> {
    const response = await this.call(`/api/v2.1/Catalog/${catalog}`, {
      method: "POST",
      headers: { "Content-Length": "0" },
    });

    if (!response.ok || !response.body) {
      throw new Error(`Hämtning av ${catalog} misslyckades: HTTP ${response.status}`);
    }

    return response;
  }

  /** Dagens genereringar hos Bihr, med nedladdnings-id för att hämta om en fil. */
  async generationHistory(): Promise<GenerationHistoryEntry[]> {
    const response = await this.call("/api/v2.1/Catalog/CatalogGenerationHistory");

    if (!response.ok) {
      throw new Error(`Kunde inte hämta genereringshistoriken: HTTP ${response.status}`);
    }

    return (await response.json()) as GenerationHistoryEntry[];
  }
}

/** Packar upp ett arkiv i minnet. Bara för filer vi vet är små nog. */
export function unzipAll(zip: ArrayBuffer | Uint8Array): Record<string, Uint8Array> {
  return unzipSync(zip instanceof Uint8Array ? zip : new Uint8Array(zip));
}

/**
 * Plockar märkesnamnet ur ett Extended-filnamn.
 * "cat-extended-full-FR00-SE001-en-2026_08_02_00_15_01_ACOUSTA-FIL.zip"
 * blir "acousta-fil". Tidsstämpeln följer ett fast mönster, så allt efter den
 * är märket — inklusive bindestreck, som är en del av namnet.
 */
export function brandFromFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[a-z0-9]+$/i, "");
  const afterTimestamp = withoutExtension.match(/\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}_(.+)$/);
  const brand = afterTimestamp?.[1] ?? withoutExtension;

  return brand.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "okant";
}
