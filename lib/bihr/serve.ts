import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Delad hjälpare för att strömma en feed-fil ur R2. */
export async function serveFeed(key: string, filename: string): Promise<Response> {
  let bucket: R2Bucket | undefined;

  try {
    bucket = getCloudflareContext().env?.TICKET_ATTACHMENTS;
  } catch {
    bucket = undefined;
  }

  if (!bucket) {
    return new Response("Filen är inte tillgänglig.\n", { status: 503 });
  }

  const object = await bucket.get(key);

  if (!object) {
    return new Response("Katalogen har inte hämtats än.\n", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Last-Modified": object.uploaded.toUTCString(),
      // Internt bruk: ska varken indexeras eller mellanlagras av ombud.
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "private, max-age=900",
    },
  });
}
