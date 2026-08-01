import type { Ticket, TicketAccount } from "@prisma/client";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/resend-client";
import { TicketAutoReplyEmail } from "@/lib/email/templates/ticket-auto-reply";
import { TicketReplyEmail } from "@/lib/email/templates/ticket-reply";
import {
  buildReplyAddress,
  extractDisplayName,
  extractEmailAddress,
  generatePublicToken,
  generateReplyKey,
  pickOwnRecipient,
} from "@/lib/tickets/addressing";
import { getTicketCopy } from "@/lib/tickets/copy";
import { detectLanguage } from "@/lib/tickets/language";
import {
  fetchReceivedEmail,
  listInboundAttachments,
  type InboundWebhookEvent,
} from "@/lib/tickets/resend-inbound";
import { isKnownSpamSender } from "@/lib/tickets/queries";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { buildStorageKey, storeAttachment } from "@/lib/tickets/storage";
import { normalizeSubject } from "@/lib/tickets/text";

export type IngestResult =
  | { status: "ignored"; reason: string }
  | { status: "created"; ticketId: string; ticketNumber: number }
  | { status: "appended"; ticketId: string; ticketNumber: number };

async function getPortalBaseUrl(): Promise<string> {
  const { siteUrl } = await getResolvedSiteSettings();
  return siteUrl.replace(/\/$/, "");
}

export function buildPortalUrl(baseUrl: string, publicToken: string): string {
  return `${baseUrl}/arende/${publicToken}`;
}

/**
 * Känner igen mejl som skickats av en maskin: frånvaromeddelanden, studsar och
 * andra autosvar. Svarar vi på dem kan två autosvarare mejla varandra i
 * oändlighet, och varje varv skapar dessutom brus i ärendelistan.
 */
function isAutomatedMessage(headers: Record<string, string>, fromEmail: string): boolean {
  const autoSubmitted = headers["auto-submitted"]?.toLowerCase();
  if (autoSubmitted && autoSubmitted !== "no") {
    return true;
  }

  const precedence = headers["precedence"]?.toLowerCase();
  if (precedence && ["bulk", "auto_reply", "junk", "list"].includes(precedence)) {
    return true;
  }

  if (headers["x-autoreply"] || headers["x-autorespond"] || headers["x-auto-response-suppress"]) {
    return true;
  }

  // Studsar kommer från en tom eller teknisk avsändare.
  const localPart = fromEmail.split("@")[0];
  return ["mailer-daemon", "postmaster", "no-reply", "noreply", "bounce", "bounces"].includes(localPart);
}

/**
 * Tar emot ett `email.received`-event och skapar eller uppdaterar ett ärende.
 * Returnerar alltid ett resultat i stället för att kasta vid okända mottagare —
 * webhooken ska svara 200 så att Resend inte köar om post som ändå inte är vår.
 */
export async function ingestInboundEmail(event: InboundWebhookEvent): Promise<IngestResult> {
  const data = event.data;

  // received_for kommer från Received-headern och pekar på adressen posten
  // faktiskt levererades till — mer tillförlitligt än To vid vidarebefordran.
  const recipientCandidates = [...(data.received_for ?? []), ...(data.to ?? [])];
  const recipient = pickOwnRecipient(recipientCandidates);

  if (!recipient) {
    return { status: "ignored", reason: "Ingen mottagare på vår inbound-domän." };
  }

  const account = await db.ticketAccount.findFirst({
    where: { slug: recipient.slug, isActive: true },
  });

  if (!account) {
    return { status: "ignored", reason: `Inget aktivt konto för "${recipient.slug}".` };
  }

  const email = await fetchReceivedEmail(data.email_id);

  const fromEmail = extractEmailAddress(email.from || data.from) ?? "";
  if (!fromEmail) {
    return { status: "ignored", reason: "Kunde inte tolka avsändaradressen." };
  }

  // Vår egen utgående adress som avsändare betyder att vi läser vår egen post.
  if (fromEmail === account.replyFromEmail.toLowerCase() || fromEmail === account.inboundEmail.toLowerCase()) {
    return { status: "ignored", reason: "Mejlet kommer från kontot självt." };
  }

  const automated = isAutomatedMessage(email.headers, fromEmail);
  // Resend normaliserar `from` till enbart adressen. Visningsnamnet finns bara
  // kvar i den råa From-headern, så den måste läsas först — annars står varje
  // ärende som anonymt även när kunden signerat med namn.
  const fromName = extractDisplayName(email.headers["from"] || email.from || data.from);
  const bodyText = email.text?.trim() || "(tomt meddelande)";
  const subject = normalizeSubject(email.subject || data.subject || "");

  const existing = recipient.replyKey
    ? await db.ticket.findUnique({ where: { replyKey: recipient.replyKey } })
    : null;

  if (existing) {
    const message = await db.ticketMessage.create({
      data: {
        ticketId: existing.id,
        direction: "INBOUND",
        fromEmail,
        fromName,
        bodyText,
        bodyHtml: email.html,
        resendEmailId: email.id,
        messageIdHeader: email.messageId,
      },
    });

    await db.ticket.update({
      where: { id: existing.id },
      data: {
        // Ett skräpmarkerat ärende ska inte kunna ta sig tillbaka in i flödet
        // bara för att avsändaren skickar mer. Meddelandet sparas, men ärendet
        // förblir läst och orört.
        ...(existing.spamAt
          ? {}
          : {
              // Kundens svar öppnar ett avslutat ärende igen — annars
              // försvinner uppföljningen tyst.
              status: "OPEN",
              // Ett nytt kundmeddelande gör ärendet oläst igen, även om det
              // lästs tidigare. Annars syns aldrig följdfrågor i räknaren.
              readAt: null,
            }),
        lastMessageAt: new Date(),
      },
    });

    await saveAttachments(email.id, existing.id, message.id);

    return { status: "appended", ticketId: existing.id, ticketNumber: existing.number };
  }

  // Svarsnyckel som inte matchar något ärende: ärendet kan vara raderat. Vi
  // skapar hellre ett nytt ärende än tappar kundens meddelande.
  const { language } = detectLanguage(bodyText);

  // Har adressen redan markerats som skräp av en handläggare litar vi på den
  // bedömningen: ärendet hamnar direkt i skräpfliken och får inget autosvar.
  // Utan det svarar systemet artigt på varje nytt skräpmejl från samma
  // avsändare, vilket både är brus och skickar post till en spammare.
  const knownSpam = await isKnownSpamSender(fromEmail);

  const ticket = await db.ticket.create({
    data: {
      accountId: account.id,
      subject,
      customerEmail: fromEmail,
      customerName: fromName,
      language,
      spamAt: knownSpam ? new Date() : null,
      readAt: knownSpam ? new Date() : null,
      publicToken: generatePublicToken(),
      replyKey: generateReplyKey(),
      lastMessageAt: new Date(),
      messages: {
        create: {
          direction: "INBOUND",
          fromEmail,
          fromName,
          bodyText,
          bodyHtml: email.html,
          resendEmailId: email.id,
          messageIdHeader: email.messageId,
        },
      },
    },
    include: { messages: true },
  });

  await saveAttachments(email.id, ticket.id, ticket.messages[0].id);

  if (!automated && !knownSpam) {
    await sendAutoReply(ticket, account, email.messageId);
  }

  return { status: "created", ticketId: ticket.id, ticketNumber: ticket.number };
}

/**
 * Hämtar bilagorna från Resend och lägger dem i R2. Ett fel här får inte rulla
 * tillbaka mejlet: hellre ett ärende utan bilagor än inget ärende alls.
 */
async function saveAttachments(emailId: string, ticketId: string, messageId: string): Promise<void> {
  let attachments;
  try {
    attachments = await listInboundAttachments(emailId);
  } catch (err) {
    console.error(`[tickets] Kunde inte lista bilagor för ${emailId}:`, err);
    return;
  }

  for (const attachment of attachments) {
    try {
      let storageKey: string | null = null;
      let sizeBytes = attachment.sizeBytes;

      if (attachment.downloadUrl) {
        const response = await fetch(attachment.downloadUrl);

        if (response.ok) {
          const buffer = await response.arrayBuffer();
          const key = buildStorageKey(ticketId, messageId, attachment.filename);
          const stored = await storeAttachment(key, buffer, attachment.contentType);

          storageKey = stored?.storageKey ?? null;
          sizeBytes = stored?.sizeBytes ?? buffer.byteLength;
        } else {
          console.error(
            `[tickets] Nedladdning av "${attachment.filename}" misslyckades: HTTP ${response.status}`,
          );
        }
      }

      await db.ticketAttachment.create({
        data: {
          messageId,
          filename: attachment.filename,
          contentType: attachment.contentType,
          sizeBytes,
          storageKey,
          resendAttachmentId: attachment.id,
        },
      });
    } catch (err) {
      console.error(`[tickets] Kunde inte spara bilagan "${attachment.filename}":`, err);
    }
  }
}

async function sendAutoReply(
  ticket: Ticket,
  account: TicketAccount,
  inReplyTo: string | null,
): Promise<void> {
  const copy = getTicketCopy(ticket.language);
  const baseUrl = await getPortalBaseUrl();
  const portalUrl = buildPortalUrl(baseUrl, ticket.publicToken);

  // Samma innehåll som mejlet, i klartext. Används både som textalternativ i
  // utskicket och som det vi sparar i tråden — annars visar adminpanelen och
  // kundportalen en kvittens utan länk, fast kunden fick en med.
  const plainBody = [
    copy.greeting(ticket.customerName),
    "",
    copy.received,
    "",
    `${copy.ticketNumberLabel}: #${ticket.number}`,
    "",
    copy.followLinkIntro,
    portalUrl,
    "",
    copy.replyHint,
    "",
    copy.closing,
    account.signature?.trim() || account.name,
  ].join("\n");

  try {
    const { id } = await sendEmail({
      text: plainBody,
      from: `${account.replyFromName} <${account.replyFromEmail}>`,
      to: [ticket.customerEmail],
      replyTo: buildReplyAddress(account.slug, ticket.replyKey),
      subject: copy.autoReplySubject(ticket.number, ticket.subject),
      react: TicketAutoReplyEmail({
        language: ticket.language,
        ticketNumber: ticket.number,
        customerName: ticket.customerName,
        portalUrl,
        signature: account.signature,
        accountName: account.name,
      }),
      headers: {
        ...(inReplyTo ? { "In-Reply-To": inReplyTo, References: inReplyTo } : {}),
        // Märker vårt eget autosvar så att mottagarens autosvarare inte
        // svarar tillbaka och startar en slinga.
        "Auto-Submitted": "auto-replied",
        "X-Auto-Response-Suppress": "All",
      },
    });

    await db.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        direction: "OUTBOUND",
        fromEmail: account.replyFromEmail,
        fromName: account.replyFromName,
        bodyText: plainBody,
        resendEmailId: id,
      },
    });

    await db.ticket.update({ where: { id: ticket.id }, data: { autoReplyError: null } });
  } catch (err) {
    // Ärendet är redan sparat — det får inte gå förlorat bara för att mejlet
    // studsade. Men felet måste synas i adminpanelen: tyst i loggen betyder
    // att kunden aldrig får sin kvittens och att ingen upptäcker det.
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[tickets] Autosvar för ärende #${ticket.number} misslyckades:`, err);

    await db.ticket.update({
      where: { id: ticket.id },
      data: { autoReplyError: message.slice(0, 500) },
    });
  }
}

/**
 * Skickar autosvaret på nytt, t.ex. efter att en avsändardomän verifierats.
 * Kastar vid fel så att adminpanelen kan visa orsaken direkt.
 */
export async function retryAutoReply(ticketId: string): Promise<void> {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      account: true,
      messages: {
        where: { direction: "INBOUND" },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!ticket) {
    throw new Error("Ärendet finns inte.");
  }

  await sendAutoReply(ticket, ticket.account, ticket.messages[0]?.messageIdHeader ?? null);

  const updated = await db.ticket.findUnique({
    where: { id: ticketId },
    select: { autoReplyError: true },
  });

  if (updated?.autoReplyError) {
    throw new Error(updated.autoReplyError);
  }
}

export type SendReplyInput = {
  ticketId: string;
  bodyText: string;
  /** Sätter ärendet till väntande efter svaret. */
  markPending?: boolean;
};

/** Skickar handläggarens svar till kunden och trådar det i samma mejlkonversation. */
export async function sendAgentReply({
  ticketId,
  bodyText,
  markPending = true,
}: SendReplyInput): Promise<void> {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      account: true,
      // Sista inkommande meddelandet bär det Message-ID vi ska svara på.
      messages: {
        where: { direction: "INBOUND" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!ticket) {
    throw new Error("Ärendet finns inte.");
  }

  const inReplyTo = ticket.messages[0]?.messageIdHeader ?? null;
  const baseUrl = await getPortalBaseUrl();

  const { id } = await sendEmail({
    from: `${ticket.account.replyFromName} <${ticket.account.replyFromEmail}>`,
    to: [ticket.customerEmail],
    replyTo: buildReplyAddress(ticket.account.slug, ticket.replyKey),
    subject: `Re: [#${ticket.number}] ${ticket.subject}`,
    react: TicketReplyEmail({
      language: ticket.language,
      ticketNumber: ticket.number,
      bodyText,
      portalUrl: buildPortalUrl(baseUrl, ticket.publicToken),
      signature: ticket.account.signature,
      accountName: ticket.account.name,
    }),
    headers: inReplyTo ? { "In-Reply-To": inReplyTo, References: inReplyTo } : undefined,
  });

  await db.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      direction: "OUTBOUND",
      fromEmail: ticket.account.replyFromEmail,
      fromName: ticket.account.replyFromName,
      bodyText,
      resendEmailId: id,
    },
  });

  await db.ticket.update({
    where: { id: ticket.id },
    data: {
      status: markPending ? "PENDING" : "OPEN",
      lastMessageAt: new Date(),
    },
  });
}
