import { Unzip, UnzipInflate } from "fflate";
import { BihrClient, unzipSingleCsv } from "./bihr";
import { RecordSplitter, parseFields, quoteField, toLookup } from "./csv";

/**
 * Nattligt jobb som hämtar Bihrs katalog och lägger en sammanslagen CSV i R2.
 *
 * Produktkatalogen är 273 MB uppackad — den ryms varken i Workerns minne
 * (128 MB) eller i en vanlig R2-put. Därför strömmas den hela vägen: ZIP:en
 * packas upp i bitar, varje post får sina lager- och priskolumner påklistrade,
 * och resultatet skickas vidare som delar i en R2-multipartuppladdning.
 *
 * Lager och priser är små nog att hållas i minnet som uppslagstabeller.
 */

export type Env = {
  FEEDS: R2Bucket;
  BIHR_CUSTOMER_CODE: string;
  BIHR_API_KEY: string;
  /** Skyddar den manuella körningen. Utan den kan vem som helst trigga jobbet. */
  BIHR_TRIGGER_SECRET: string;
};

const FEED_KEY = "feeds/bihr.csv";
const PART_SIZE = 8 * 1024 * 1024;

/** Kolumnen med artikelnummer i produktkatalogen (nionde fältet). */
const PART_NUMBER_INDEX = 8;

type Lookup = { header: string[]; rows: Map<string, string[]> };

/** Bygger de extra kolumnerna för en artikel, i samma ordning som rubrikraden. */
function extraFields(lookup: Lookup, partNumber: string): string[] {
  const row = lookup.rows.get(partNumber);
  // Hoppa över nyckelkolumnen — artikelnumret står redan i produktposten.
  return lookup.header.slice(1).map((_, index) => quoteField(row?.[index + 1] ?? ""));
}

export async function buildFeed(env: Env): Promise<{ rows: number; bytes: number }> {
  const client = new BihrClient(env.BIHR_CUSTOMER_CODE, env.BIHR_API_KEY);

  // Små kataloger först: de behövs som uppslagstabeller innan produkterna
  // kan strömmas, och de är klara på sekunder.
  const stocksId = await client.requestCatalog("Stocks");
  const stocks = toLookup(unzipSingleCsv(await client.downloadCatalog(stocksId)).text);

  const pricesId = await client.requestCatalog("Prices");
  const prices = toLookup(unzipSingleCsv(await client.downloadCatalog(pricesId)).text);

  const productsId = await client.requestCatalog("Products");

  const response = await client.openCatalog(productsId);
  const body = response.body!; // openCatalog kastar redan om strömmen saknas

  const upload = await env.FEEDS.createMultipartUpload(FEED_KEY, {
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
  let wroteHeader = false;

  const queue = (text: string) => {
    const bytes = encoder.encode(text);
    pending.push(bytes);
    pendingBytes += bytes.byteLength;
    totalBytes += bytes.byteLength;
  };

  const flush = async (final: boolean) => {
    if (pendingBytes === 0 || (!final && pendingBytes < PART_SIZE)) {
      return;
    }
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

  const handleRecords = (records: string[]) => {
    for (const record of records) {
      if (!wroteHeader) {
        const header = parseFields(record);
        queue(
          [...header, ...stocks.header.slice(1), ...prices.header.slice(1)].join(",") + "\n",
        );
        wroteHeader = true;
        continue;
      }

      const partNumber = parseFields(record, PART_NUMBER_INDEX + 1)[PART_NUMBER_INDEX] ?? "";
      // Posten skrivs oförändrad och får de nya kolumnerna påklistrade. Att
      // inte serialisera om fälten bevarar Bihrs egen citering exakt.
      queue(
        record +
          "," +
          extraFields(stocks, partNumber).join(",") +
          "," +
          extraFields(prices, partNumber).join(",") +
          "\n",
      );
      rows++;
    }
  };

  try {
    const unzip = new Unzip();
    unzip.register(UnzipInflate);

    let inflateError: Error | null = null;

    unzip.onfile = (file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return;
      }
      file.ondata = (err, chunk, final) => {
        if (err) {
          inflateError = err as Error;
          return;
        }
        if (chunk?.length) {
          handleRecords(splitter.push(decoder.decode(chunk, { stream: true })));
        }
        if (final) {
          handleRecords(splitter.end());
        }
      };
      file.start();
    };

    const reader = body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      unzip.push(value, false);
      if (inflateError) {
        throw inflateError;
      }
      // Uppackningen sker synkront ovan; här släpper vi ifrån oss det som
      // hunnit bli en full uppladdningsdel innan nästa bit läses.
      await flush(false);
    }
    unzip.push(new Uint8Array(0), true);
    if (inflateError) {
      throw inflateError;
    }

    await flush(true);
    await upload.complete(parts);
  } catch (error) {
    // En halvskriven fil är värre än en gammal: utan abort ligger delarna kvar
    // och kostar lagring, och nästa körning kan inte återanvända nyckeln.
    await upload.abort().catch(() => undefined);
    throw error;
  }

  return { rows, bytes: totalBytes };
}

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      buildFeed(env).then(
        (result) =>
          console.log(`[bihr] Klar: ${result.rows} artiklar, ${result.bytes} byte skrivna.`),
        (error) => console.error("[bihr] Nattjobbet misslyckades:", error),
      ),
    );
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname !== "/run") {
      return new Response("Not found", { status: 404 });
    }
    // Jobbet drar hundratals MB från Bihr. Utan nyckel kan vem som helst
    // starta det hur ofta som helst.
    if (url.searchParams.get("key") !== env.BIHR_TRIGGER_SECRET) {
      return new Response("Not found", { status: 404 });
    }

    ctx.waitUntil(
      buildFeed(env).then(
        (result) => console.log(`[bihr] Manuell körning klar: ${result.rows} artiklar.`),
        (error) => console.error("[bihr] Manuell körning misslyckades:", error),
      ),
    );

    return new Response("Bygget startat. Följ loggen med wrangler tail.\n");
  },
};
