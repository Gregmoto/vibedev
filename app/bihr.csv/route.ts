import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Serverar den nattligt genererade Bihr-katalogen.
 *
 * Filen byggs av en separat worker (workers/bihr-feed) och ligger i R2. Här
 * strömmas den bara vidare — den är runt 270 MB och får aldrig läsas in i
 * minnet.
 */

export const dynamic = "force-dynamic";

const FEED_KEY = "feeds/bihr.csv";

export async function GET() {
  let bucket: R2Bucket | undefined;

  try {
    bucket = getCloudflareContext().env?.TICKET_ATTACHMENTS;
  } catch {
    bucket = undefined;
  }

  if (!bucket) {
    return new Response("Filen är inte tillgänglig.\n", { status: 503 });
  }

  const object = await bucket.get(FEED_KEY);

  if (!object) {
    return new Response("Katalogen har inte genererats än.\n", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Length": String(object.size),
      "Content-Disposition": 'attachment; filename="bihr.csv"',
      "Last-Modified": object.uploaded.toUTCString(),
      // Filen byts en gång per dygn; en timmes cache räcker för att avlasta
      // utan att någon riskerar att få gårdagens data hela dagen.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
