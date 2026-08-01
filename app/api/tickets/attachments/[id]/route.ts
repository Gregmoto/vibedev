import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { fetchAttachment } from "@/lib/tickets/storage";

/**
 * Lämnar ut en bilaga till den som har rätt att se den:
 *   • inloggad admin, eller
 *   • kunden själv, via ?token=<ärendets publicToken>
 *
 * Åtkomsten prövas mot ärendet bilagan hör till — inte mot bilagans id. Ett
 * gissat bilage-id räcker alltså inte, och en token ger bara det egna ärendet.
 */

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token");

  const attachment = await db.ticketAttachment.findUnique({
    where: { id },
    include: {
      message: {
        select: { ticket: { select: { publicToken: true } } },
      },
    },
  });

  if (!attachment?.storageKey) {
    return new Response("Bilagan finns inte.", { status: 404 });
  }

  const session = await auth();
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const hasValidToken = Boolean(token) && token === attachment.message.ticket.publicToken;

  if (!isAdmin && !hasValidToken) {
    // 404 i stället för 403: ett 403 skulle bekräfta att bilagan finns.
    return new Response("Bilagan finns inte.", { status: 404 });
  }

  const file = await fetchAttachment(attachment.storageKey);

  if (!file) {
    return new Response("Filen kunde inte hämtas ur lagringen.", { status: 404 });
  }

  return new Response(file.body, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.sizeBytes),
      // attachment, inte inline: en uppladdad HTML- eller SVG-fil får inte
      // kunna köra script på vår egen domän.
      "Content-Disposition": `attachment; filename="${attachment.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
