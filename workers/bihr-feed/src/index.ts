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
};

/** Kolumnerna som sparas för de nattliga filerna. Väljs på namn, inte position. */
const NIGHTLY_COLUMNS = ["NewPartNumber", "BarCode", "StockValue"];

const EXTENDED_PREFIX = "feeds/extended/";
const MAX_EXTENDED_AGE_MS = 24 * 60 * 60 * 1000;
const PART_SIZE = 8 * 1024 * 1024;

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
 * Extended på begäran: en ZIP med 245 inre ZIP-filer, en per märke.
 * Varje märke får en egen CSV med samtliga fält.
 */
export async function runExtended(env: Env): Promise<RunResult> {
  const client = new BihrClient(env.BIHR_CUSTOMER_CODE, env.BIHR_API_KEY);
  const response = await client.fetchCatalog("EssentialExtended");

  const outer = unzipAll(await response.arrayBuffer());
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "");

  let files = 0;
  let bytes = 0;

  for (const [name, data] of Object.entries(outer)) {
    if (!name.toLowerCase().endsWith(".zip")) continue;

    const brand = brandFromFileName(name);
    // Varje inre arkiv är litet, så det kan packas upp i sin helhet.
    const inner = unzipAll(data.buffer as ArrayBuffer);
    const csvName = Object.keys(inner).find((key) => key.toLowerCase().endsWith(".csv"));
    if (!csvName) continue;

    const body = inner[csvName];
    await env.FEEDS.put(`${EXTENDED_PREFIX}${stamp}/${brand}.csv`, body, {
      httpMetadata: { contentType: "text/csv; charset=utf-8" },
    });

    files++;
    bytes += body.byteLength;
  }

  return { rows: 0, bytes, files };
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

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        try {
          const results = await runNightly(env);
          const removed = await cleanupExtended(env);
          console.log(`[bihr] Nattkörning klar: ${JSON.stringify(results)}, städade ${removed} filer.`);
        } catch (error) {
          console.error("[bihr] Nattkörningen misslyckades:", error);
        }
      })(),
    );
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Jobben drar tiotals MB från Bihr. Utan nyckel kan vem som helst starta dem.
    if (url.searchParams.get("key") !== env.BIHR_TRIGGER_SECRET) {
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname === "/run-nightly") {
      ctx.waitUntil(runNightly(env).then(
        (r) => console.log("[bihr] Manuell nattkörning klar:", JSON.stringify(r)),
        (e) => console.error("[bihr] Manuell nattkörning misslyckades:", e),
      ));
      return new Response("Nattkörningen startad.\n");
    }

    if (url.pathname === "/run-extended") {
      ctx.waitUntil(runExtended(env).then(
        (r) => console.log(`[bihr] Extended klar: ${r.files} märkesfiler.`),
        (e) => console.error("[bihr] Extended misslyckades:", e),
      ));
      return new Response("Extended-hämtningen startad.\n");
    }

    return new Response("Not found", { status: 404 });
  },
};
