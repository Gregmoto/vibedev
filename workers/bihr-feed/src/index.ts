import { Unzip, UnzipInflate } from "fflate";
import { BihrClient, brandFromFileName, unzipAll, type EssentialCatalog } from "./bihr";
import { RecordSplitter, parseFields, quoteField } from "./csv";

/**
 * Hämtar Bihrs kataloger och lägger dem i R2.
 *
 * Nattligt: HardPart och RiderGear, nedbantade till tre kolumner. Hela
 * HardPart-filen är 52 MB uppackad — med bara artikelnummer, streckkod och
 * lagervärde blir den några MB, och den strömmas ändå igenom eftersom 52 MB
 * som avkodad sträng inte ryms i Workerns 128 MB.
 *
 * På begäran: Extended, som är en ZIP med 245 ZIP-filer inuti — en per märke.
 * Varje inre arkiv packas upp till en egen CSV med samtliga fält.
 */

export type Env = {
  FEEDS: R2Bucket;
  BIHR_CUSTOMER_CODE: string;
  BIHR_API_KEY: string;
  BIHR_TRIGGER_SECRET: string;
  /** Dit körningsresultatet rapporteras. Workern har ingen databasanslutning. */
  SITE_URL: string;
};

/** Rapporterar resultatet till sajten, som skriver det till loggen i admin. */
async function report(
  env: Env,
  entry: { kind: "nightly" | "extended"; success: boolean; rows?: number; files?: number; bytes?: number; durationMs: number; error?: string; manual?: boolean },
): Promise<void> {
  try {
    await fetch(`${env.SITE_URL.replace(/\/$/, "")}/api/bihr/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-bihr-secret": env.BIHR_TRIGGER_SECRET },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    // Loggen är sekundär — en misslyckad rapport får inte fälla en lyckad körning.
    console.error("[bihr] Kunde inte rapportera körningen:", error);
  }
}

/** Kör ett jobb, mät tiden och logga utfallet oavsett hur det går. */
async function withLog(
  env: Env,
  kind: "nightly" | "extended",
  manual: boolean,
  job: () => Promise<{ rows: number; files: number; bytes: number }>,
): Promise<void> {
  const started = Date.now();
  try {
    const result = await job();
    await report(env, { kind, success: true, ...result, durationMs: Date.now() - started, manual });
    console.log(`[bihr] ${kind} klar:`, JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await report(env, { kind, success: false, durationMs: Date.now() - started, error: message, manual });
    console.error(`[bihr] ${kind} misslyckades:`, error);
  }
}

/** Kolumnerna som sparas för de nattliga filerna. Väljs på namn, inte position. */
const NIGHTLY_COLUMNS = ["NewPartNumber", "BarCode", "StockValue"];

const EXTENDED_PREFIX = "feeds/extended/";
const MAX_EXTENDED_AGE_MS = 24 * 60 * 60 * 1000;
const PART_SIZE = 8 * 1024 * 1024;

/* Beställningsflagga i R2. Workern har varken databas eller KV, och en
   markörfil är tillräckligt — det finns bara ett tillstånd att hålla reda på. */
const EXTENDED_REQUEST_KEY = "feeds/extended-requested";

/* Nattkörningen. Övriga scheman är avsökningen efter beställningar. */
const NIGHTLY_CRON = "15 2 * * *";

export type RunResult = { rows: number; bytes: number; files: number };

/**
 * Strömmar en katalog-ZIP och skriver en nedbantad CSV till R2.
 * Bara de namngivna kolumnerna följer med.
 */
async function streamProjected(
  response: Response,
  bucket: R2Bucket,
  key: string,
  columns: string[],
): Promise<RunResult> {
  const upload = await bucket.createMultipartUpload(key, {
    httpMetadata: { contentType: "text/csv; charset=utf-8" },
  });

  const parts: R2UploadedPart[] = [];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8");
  const splitter = new RecordSplitter();

  let pending: Uint8Array[] = [];
  let pendingBytes = 0;
  let totalBytes = 0;
  let rows = 0;
  let indexes: number[] | null = null;

  const queue = (text: string) => {
    const bytes = encoder.encode(text);
    pending.push(bytes);
    pendingBytes += bytes.byteLength;
    totalBytes += bytes.byteLength;
  };

  const flush = async (final: boolean) => {
    if (pendingBytes === 0 || (!final && pendingBytes < PART_SIZE)) return;

    const blob = new Uint8Array(pendingBytes);
    let offset = 0;
    for (const chunk of pending) {
      blob.set(chunk, offset);
      offset += chunk.byteLength;
    }
    pending = [];
    pendingBytes = 0;
    parts.push(await upload.uploadPart(parts.length + 1, blob));
  };

  const handle = (records: string[]) => {
    for (const record of records) {
      const fields = parseFields(record);

      if (indexes === null) {
        // Kolumnerna väljs på namn. Byter Bihr ordning eller lägger till fält
        // fortsätter filen att innehålla rätt data.
        indexes = columns.map((name) => fields.indexOf(name));
        const missing = columns.filter((_, i) => indexes![i] === -1);
        if (missing.length > 0) {
          throw new Error(`Katalogen saknar kolumnerna: ${missing.join(", ")}`);
        }
        queue(columns.join(",") + "\n");
        continue;
      }

      queue(indexes.map((i) => quoteField(fields[i] ?? "")).join(",") + "\n");
      rows++;
    }
  };

  try {
    const unzip = new Unzip();
    unzip.register(UnzipInflate);
    let failure: Error | null = null;

    unzip.onfile = (file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) return;
      file.ondata = (err, chunk, final) => {
        if (err) {
          failure = err as Error;
          return;
        }
        try {
          if (chunk?.length) handle(splitter.push(decoder.decode(chunk, { stream: true })));
          if (final) handle(splitter.end());
        } catch (error) {
          failure = error as Error;
        }
      };
      file.start();
    };

    const reader = response.body!.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      unzip.push(value, false);
      if (failure) throw failure;
      await flush(false);
    }
    unzip.push(new Uint8Array(0), true);
    if (failure) throw failure;

    await flush(true);
    await upload.complete(parts);
  } catch (error) {
    // Utan abort ligger de uppladdade delarna kvar och kostar lagring, och
    // nyckeln går inte att återanvända vid nästa körning.
    await upload.abort().catch(() => undefined);
    throw error;
  }

  return { rows, bytes: totalBytes, files: 1 };
}

/** Nattjobbet: de två små katalogerna med utvalda fält. */
export async function runNightly(env: Env): Promise<Record<string, RunResult>> {
  const client = new BihrClient(env.BIHR_CUSTOMER_CODE, env.BIHR_API_KEY);
  const targets: [EssentialCatalog, string][] = [
    ["EssentialHardPart", "feeds/bihr-hardparts.csv"],
    ["EssentialRiderGear", "feeds/bihr-ridergear.csv"],
  ];

  const results: Record<string, RunResult> = {};

  for (const [catalog, key] of targets) {
    const response = await client.fetchCatalog(catalog);
    results[catalog] = await streamProjected(response, env.FEEDS, key, NIGHTLY_COLUMNS);
  }

  return results;
}

/**
 * Extended på begäran: en ZIP med 245 CSV-filer inuti, en per märke.
 *
 * Arkivet är 36 MB men innehåller 261 MB data, och enskilda märken är upp till
 * 74 MB. Ingenting av det ryms i Workerns 128 MB, så varje fil strömmas rakt
 * igenom till R2 utan att någonsin ligga hel i minnet.
 */
export async function runExtended(env: Env): Promise<RunResult> {
  const client = new BihrClient(env.BIHR_CUSTOMER_CODE, env.BIHR_API_KEY);
  const response = await client.fetchCatalog("EssentialExtended");

  // Rensa först. Varje körning ska ersätta föregående, inte lägga sig bredvid —
  // och ett märke som utgått ur sortimentet ska inte bli kvar som en gammal fil.
  await clearExtended(env);

  let files = 0;
  let bytes = 0;
  let failure: Error | null = null;

  /* En fil i taget: fflate levererar arkivet sekventiellt, så det räcker med
     ett öppet upload-tillstånd. Små märken skrivs som en vanlig put — R2:s
     multipart kräver minst 5 MB per del utom den sista. */
  let current: {
    key: string;
    chunks: Uint8Array[];
    buffered: number;
    upload: R2MultipartUpload | null;
    parts: R2UploadedPart[];
  } | null = null;

  /**
   * Plockar ut `size` byte ur bufferten, eller allt om size utelämnas.
   *
   * R2 kräver att alla delar utom den sista är exakt lika stora. Att bara
   * tömma bufferten när den passerat gränsen ger delar av olika längd, och
   * completeMultipartUpload avvisar hela uppladdningen.
   */
  const takeBuffered = (state: NonNullable<typeof current>, size?: number) => {
    const total = size ?? state.buffered;
    const blob = new Uint8Array(total);
    let offset = 0;

    while (offset < total && state.chunks.length > 0) {
      const chunk = state.chunks[0];
      const remaining = total - offset;

      if (chunk.byteLength <= remaining) {
        blob.set(chunk, offset);
        offset += chunk.byteLength;
        state.chunks.shift();
      } else {
        blob.set(chunk.subarray(0, remaining), offset);
        state.chunks[0] = chunk.subarray(remaining);
        offset += remaining;
      }
    }

    state.buffered -= total;
    return blob;
  };

  const drain = async () => {
    while (current && current.buffered >= PART_SIZE) {
      await uploadOnePart(current);
    }
  };

  const uploadOnePart = async (state: NonNullable<typeof current>) => {
    if (!state.upload) {
      state.upload = await env.FEEDS.createMultipartUpload(state.key, {
        httpMetadata: { contentType: "text/csv; charset=utf-8" },
      });
    }
    // Exakt PART_SIZE per del — resten ligger kvar till nästa varv.
    const blob = takeBuffered(state, PART_SIZE);
    state.parts.push(await state.upload.uploadPart(state.parts.length + 1, blob));
  };

  /* Tillståndet skickas in i stället för att läsas från `current`. fflate kan
     hinna börja på nästa fil innan den föregående skrivits klart, och då pekar
     `current` redan på fel fil — vilket tappade 32 av 245 filer. */
  const finish = async (state: NonNullable<typeof current> | null) => {
    if (!state) return;
    if (current === state) current = null;

    if (!state.upload) {
      await env.FEEDS.put(state.key, takeBuffered(state), {
        httpMetadata: { contentType: "text/csv; charset=utf-8" },
      });
    } else {
      if (state.buffered > 0) {
        state.parts.push(await state.upload.uploadPart(state.parts.length + 1, takeBuffered(state)));
      }
      await state.upload.complete(state.parts);
    }
    files++;
  };

  const unzip = new Unzip();
  unzip.register(UnzipInflate);

  const pendingFinishes: (() => Promise<void>)[] = [];

  unzip.onfile = (file) => {
    if (!file.name.toLowerCase().endsWith(".csv")) return;

    const brand = brandFromFileName(file.name);
    current = {
      key: `${EXTENDED_PREFIX}${brand}.csv`,
      chunks: [],
      buffered: 0,
      upload: null,
      parts: [],
    };

    const state = current;
    file.ondata = (err, chunk, final) => {
      if (err) {
        failure = err as Error;
        return;
      }
      if (chunk?.length) {
        state.chunks.push(chunk.slice());
        state.buffered += chunk.byteLength;
        bytes += chunk.byteLength;
      }
      if (final) {
        pendingFinishes.push(() => finish(state));
      }
    };
    file.start();
  };

  const reader = response.body!.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    unzip.push(value, false);
    if (failure) throw failure;
    await drain();
    while (pendingFinishes.length > 0) {
      await pendingFinishes.shift()!();
    }
  }
  unzip.push(new Uint8Array(0), true);
  if (failure) throw failure;
  while (pendingFinishes.length > 0) {
    await pendingFinishes.shift()!();
  }
  await finish(current);

  return { rows: 0, bytes, files };
}

/** Tar bort samtliga Extended-filer. */
export async function clearExtended(env: Env): Promise<number> {
  let removed = 0;
  let cursor: string | undefined;

  do {
    const listing = await env.FEEDS.list({ prefix: EXTENDED_PREFIX, cursor, limit: 500 });
    const keys = listing.objects.map((object) => object.key);
    if (keys.length > 0) {
      await env.FEEDS.delete(keys);
      removed += keys.length;
    }
    cursor = listing.truncated ? listing.cursor : undefined;
  } while (cursor);

  return removed;
}

/**
 * Extended-filer är bara intressanta i stunden och tar annars plats i onödan.
 * Allt äldre än ett dygn städas bort vid varje nattkörning.
 */
export async function cleanupExtended(env: Env): Promise<number> {
  const cutoff = Date.now() - MAX_EXTENDED_AGE_MS;
  let removed = 0;
  let cursor: string | undefined;

  do {
    const listing = await env.FEEDS.list({ prefix: EXTENDED_PREFIX, cursor, limit: 500 });
    const stale = listing.objects
      .filter((object) => object.uploaded.getTime() < cutoff)
      .map((object) => object.key);

    if (stale.length > 0) {
      await env.FEEDS.delete(stale);
      removed += stale.length;
    }

    cursor = listing.truncated ? listing.cursor : undefined;
  } while (cursor);

  return removed;
}

/** Lägger en beställning som nästa avsökning plockar upp. */
export async function requestExtended(env: Env): Promise<void> {
  await env.FEEDS.put(EXTENDED_REQUEST_KEY, new Date().toISOString());
}

/**
 * Kör Extended om någon beställt den.
 *
 * Beställningen tas bort innan jobbet startar, inte efter. Annars skulle nästa
 * avsökning starta en andra körning medan den första fortfarande skriver.
 */
async function runIfRequested(env: Env): Promise<void> {
  const marker = await env.FEEDS.head(EXTENDED_REQUEST_KEY);
  if (!marker) return;

  await env.FEEDS.delete(EXTENDED_REQUEST_KEY);
  await withLog(env, "extended", true, () => runExtended(env));
}

export default {
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    // Cron-triggade körningar har 15 minuter på sig. En som startas av en
    // HTTP-förfrågan kapas vid 30 sekunder väggklocka oavsett hur lite
    // processortid den använder — och Extended behöver flera minuter.
    if (event.cron !== NIGHTLY_CRON) {
      ctx.waitUntil(runIfRequested(env));
      return;
    }

    ctx.waitUntil(
      withLog(env, "nightly", false, async () => {
        const results = await runNightly(env);
        const removed = await cleanupExtended(env);
        console.log(`[bihr] Städade ${removed} gamla Extended-filer.`);
        return Object.values(results).reduce(
          (sum, r) => ({ rows: sum.rows + r.rows, files: sum.files + r.files, bytes: sum.bytes + r.bytes }),
          { rows: 0, files: 0, bytes: 0 },
        );
      }),
    );
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Jobben drar tiotals MB från Bihr. Utan nyckel kan vem som helst starta dem.
    if (url.searchParams.get("key") !== env.BIHR_TRIGGER_SECRET) {
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname === "/run-nightly") {
      ctx.waitUntil(
        withLog(env, "nightly", true, async () => {
          const results = await runNightly(env);
          await cleanupExtended(env);
          return Object.values(results).reduce(
            (sum, r) => ({ rows: sum.rows + r.rows, files: sum.files + r.files, bytes: sum.bytes + r.bytes }),
            { rows: 0, files: 0, bytes: 0 },
          );
        }),
      );
      return new Response("Nattkörningen startad.\n");
    }

    if (url.pathname === "/clear-extended") {
      const removed = await clearExtended(env);
      return new Response(`Rensade ${removed} Extended-filer.\n`);
    }

    if (url.pathname === "/run-extended") {
      await requestExtended(env);
      return new Response("Extended är beställd och startar inom fem minuter.\n");
    }

    return new Response("Not found", { status: 404 });
  },
};
