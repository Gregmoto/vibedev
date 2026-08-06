import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "@/lib/db";

/**
 * Serverar en uppladdad fil. Adressen bygger på slug, som aldrig ändras — så
 * den fortsätter fungera hos mottagaren även efter att filen bytts ut.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const record = await db.csvFile.findUnique({ where: { slug: slug.replace(/\.csv$/i, "") } });
  if (!record) {
    return new Response("Filen finns inte.\n", { status: 404 });
  }

  let bucket: R2Bucket | undefined;
  try {
    bucket = getCloudflareContext().env?.TICKET_ATTACHMENTS;
  } catch {
    bucket = undefined;
  }

  const object = await bucket?.get(record.storageKey);
  if (!object) {
    return new Response("Filen är inte tillgänglig.\n", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": record.contentType,
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${record.name.replace(/"/g, "")}"`,
      "Last-Modified": object.uploaded.toUTCString(),
      "X-Robots-Tag": "noindex, nofollow",
      // Kort cache: filen kan bytas ut när som helst, och då ska mottagaren
      // få den nya versionen utan att behöva rensa något.
      "Cache-Control": "public, max-age=300",
    },
  });
}
