"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/resend-client";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { INBOUND_DOMAIN } from "@/lib/tickets/addressing";
import { getTicketCopy } from "@/lib/tickets/copy";
import { buildStorageKey, storeAttachment } from "@/lib/tickets/storage";

export type PortalReplyState = {
  error?: string;
  success?: string;
};

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

export async function replyFromPortalAction(
  _prevState: PortalReplyState,
  formData: FormData,
): Promise<PortalReplyState> {
  const token = String(formData.get("token") ?? "").trim();
  const bodyText = String(formData.get("bodyText") ?? "").trim();

  // Token är hela behörigheten här — ingen inloggning finns. Vi slår därför upp
  // ärendet på token och litar aldrig på ett id från formuläret.
  const ticket = token
    ? await db.ticket.findUnique({ where: { publicToken: token }, include: { account: true } })
    : null;

  if (!ticket) {
    return { error: "Länken är ogiltig eller har upphört." };
  }

  const copy = getTicketCopy(ticket.language);

  if (!bodyText) {
    return { error: copy.portalEmptyReply };
  }

  const files = formData
    .getAll("attachments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, MAX_FILES);

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return { error: "Bilagorna får tillsammans vara högst 10 MB." };
  }

  const message = await db.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      direction: "INBOUND",
      fromEmail: ticket.customerEmail,
      fromName: ticket.customerName,
      bodyText,
    },
  });

  for (const file of files) {
    try {
      const key = buildStorageKey(ticket.id, message.id, file.name);
      const stored = await storeAttachment(key, await file.arrayBuffer(), file.type);

      await db.ticketAttachment.create({
        data: {
          messageId: message.id,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: stored?.sizeBytes ?? file.size,
          storageKey: stored?.storageKey ?? null,
        },
      });
    } catch (err) {
      console.error(`[tickets] Kunde inte spara bilagan "${file.name}" från kundportalen:`, err);
    }
  }

  await db.ticket.update({
    where: { id: ticket.id },
    data: { status: "OPEN", lastMessageAt: new Date() },
  });

  await notifyAgents(ticket.number, ticket.subject, ticket.customerEmail, ticket.id);

  revalidatePath(`/arende/${token}`);
  revalidatePath("/admin/arenden");

  return { success: copy.portalSent };
}

/**
 * Aviserar oss om att kunden svarat i portalen.
 *
 * Adressen får aldrig ligga på inbound-domänen: då skulle vår egen avisering
 * plockas upp av webhooken och bli ett nytt ärende, som i sin tur aviserar.
 */
async function notifyAgents(
  ticketNumber: number,
  subject: string,
  customerEmail: string,
  ticketId: string,
): Promise<void> {
  const settings = await getResolvedSiteSettings();
  const to = settings.contactEmail?.trim();

  if (!to || to.toLowerCase().endsWith(`@${INBOUND_DOMAIN.toLowerCase()}`)) {
    return;
  }

  const adminUrl = `${settings.siteUrl.replace(/\/$/, "")}/admin/arenden/${ticketId}`;

  try {
    await sendEmail({
      from: `VibeDev Ärenden <arenden@sending.vibedev.se>`,
      to: [to],
      subject: `[#${ticketNumber}] Nytt svar från kunden – ${subject}`,
      text: [
        `${customerEmail} har svarat i kundportalen.`,
        "",
        `Öppna ärendet: ${adminUrl}`,
      ].join("\n"),
    });
  } catch (err) {
    // Aviseringen är en bekvämlighet — kundens svar är redan sparat.
    console.error(`[tickets] Avisering för ärende #${ticketNumber} misslyckades:`, err);
  }
}
