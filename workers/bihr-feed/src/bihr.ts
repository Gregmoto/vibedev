import { unzipSync } from "fflate";

/**
 * Klient mot Bihrs eBihr Web API v3.
 *
 * Två saker styr utformningen:
 *  • API:et tillåter ett anrop per sekund. Överskrids det svarar det 429 utan
 *    att köa, så varje anrop går genom samma strypning.
 *  • Katalogerna genereras asynkront. Lager och produkter brukar vara färdiga
 *    direkt (Bihr bygger dem nattetid), men priser tar flera minuter.
 */

const BASE = "https://api.bihr.net";

/* En sekund plus marginal — nätverksjitter ska inte kunna trigga 429. */
const MIN_CALL_INTERVAL_MS = 1200;

export type CatalogType = "Products" | "Prices" | "Stocks" | "SalesCategories";

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
    // 60 sekunders marginal: en token som går ut mitt i en nedladdning på
    // hundratals MB skulle spränga hela körningen.
    if (this.token && Date.now() < this.tokenExpiresAt - 60_000) {
      return this.token;
    }

    await this.throttle();

    const form = new FormData();
    form.set("UserName", this.customerCode);
    form.set("PassWord", this.apiKey);

    const response = await fetch(`${BASE}/api/v3/Authentication/Token`, {
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

  private async authed(path: string, init: RequestInit = {}): Promise<Response> {
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

  /** Beställer en katalog och väntar tills Bihr byggt klart den. */
  async requestCatalog(
    catalogType: CatalogType,
    { language = "en", timeoutMs = 10 * 60_000 } = {},
  ): Promise<string> {
    const response = await this.authed("/api/v3/Catalogs/Request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catalogType,
        compressionType: "ZIP",
        language,
        serializationType: "CSV",
      }),
    });

    if (!response.ok) {
      throw new Error(`Katalogbeställning ${catalogType} misslyckades: HTTP ${response.status}`);
    }

    const created = (await response.json()) as {
      id?: string;
      status?: string;
      catalogFileId?: string;
      errorMessage?: string;
    };

    if (created.status === "Finished" && created.catalogFileId) {
      return created.catalogFileId;
    }
    if (!created.id) {
      throw new Error(`Bihr gav inget request-id för ${catalogType}.`);
    }

    return this.waitForCatalog(created.id, catalogType, timeoutMs);
  }

  private async waitForCatalog(
    requestId: string,
    catalogType: CatalogType,
    timeoutMs: number,
  ): Promise<string> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 10_000));

      const response = await this.authed(`/api/v3/Catalogs/Request/${requestId}`);
      if (!response.ok) {
        continue;
      }

      const status = (await response.json()) as {
        status?: string;
        catalogFileId?: string;
        errorMessage?: string;
      };

      if (status.status === "Finished" && status.catalogFileId) {
        return status.catalogFileId;
      }
      if (status.status === "Failed") {
        throw new Error(`Bihr misslyckades med ${catalogType}: ${status.errorMessage ?? "okänt fel"}`);
      }
    }

    throw new Error(`Bihr blev inte klar med ${catalogType} inom tidsgränsen.`);
  }

  /**
   * Öppnar katalogfilen som en ström. Enda vägen för produktkatalogen, som är
   * 273 MB uppackad och alltså aldrig får buffras i sin helhet.
   */
  async openCatalog(fileId: string): Promise<Response> {
    const response = await this.authed(`/api/v3/Catalogs/File/${fileId}`);

    if (!response.ok || !response.body) {
      throw new Error(`Kunde inte öppna katalogfilen: HTTP ${response.status}`);
    }

    return response;
  }

  /** Hämtar katalogfilen som ZIP. Bara för de små katalogerna. */
  async downloadCatalog(fileId: string): Promise<ArrayBuffer> {
    const response = await this.authed(`/api/v3/Catalogs/File/${fileId}`);

    if (!response.ok) {
      throw new Error(`Nedladdning av katalogfil misslyckades: HTTP ${response.status}`);
    }

    return response.arrayBuffer();
  }
}

/**
 * Packar upp en ZIP och returnerar den enda CSV-filen i den.
 *
 * Används bara för lager och priser, som är några MB. Produktkatalogen är
 * 273 MB uppackad och måste strömmas — den får aldrig gå genom den här.
 */
export function unzipSingleCsv(zip: ArrayBuffer): { name: string; text: string } {
  const files = unzipSync(new Uint8Array(zip));
  const name = Object.keys(files).find((key) => key.toLowerCase().endsWith(".csv"));

  if (!name) {
    throw new Error("Ingen CSV hittades i katalogarkivet.");
  }

  return { name, text: new TextDecoder("utf-8").decode(files[name]) };
}
