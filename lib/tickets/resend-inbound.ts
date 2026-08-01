import { Resend } from "resend";

/**
 * Hämtning av inkommande mejl från Resend.
 *
 * Webhooken `email.received` bär bara metadata — brödtext, headers och bilagor
 * måste hämtas separat. Resend gör så medvetet, för att stora mejl annars inte
 * ryms i request-gränserna hos serverlösa mottagare.
 *
 * Klienten skapas per anrop: på Workers är process.env tom när modulen laddas,
 * så en klient byggd i modulscope skulle få en tom API-nyckel.
 */

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY saknas i miljön — inkommande mejl kan inte hämtas.");
  }
  return new Resend(apiKey);
}

/** Fälten vi använder ur webhookens payload. Resend skickar fler. */
export type InboundWebhookEvent = {
  type: string;
  created_at?: string;
  data: {
    email_id: string;
    message_id?: string;
    from: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    received_for?: string[];
    subject?: string;
    attachments?: {
      id: string;
      filename?: string;
      content_type?: string;
      content_disposition?: string;
      content_id?: string;
    }[];
  };
};

export type ReceivedEmail = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string | null;
  headers: Record<string, string>;
  messageId: string | null;
  receivedFor: string[];
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return typeof value === "string" ? [value] : [];
}

function normalizeHeaders(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string") {
      // Headers är skiftlägesokänsliga; vi normaliserar för att slippa gissa.
      out[key.toLowerCase()] = raw;
    }
  }
  return out;
}

export async function fetchReceivedEmail(emailId: string): Promise<ReceivedEmail> {
  const { data, error } = await getResend().emails.receiving.get(emailId);

  if (error) {
    throw new Error(`Kunde inte hämta inkommande mejl ${emailId}: ${error.name} — ${error.message}`);
  }
  if (!data) {
    throw new Error(`Resend returnerade inget innehåll för inkommande mejl ${emailId}.`);
  }

  const record = data as unknown as Record<string, unknown>;

  return {
    id: emailId,
    from: typeof record.from === "string" ? record.from : "",
    to: toStringArray(record.to),
    subject: typeof record.subject === "string" ? record.subject : "",
    text: typeof record.text === "string" ? record.text : "",
    html: typeof record.html === "string" ? record.html : null,
    headers: normalizeHeaders(record.headers),
    messageId: typeof record.message_id === "string" ? record.message_id : null,
    receivedFor: toStringArray(record.received_for),
  };
}

export type InboundAttachment = {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string | null;
};

export async function listInboundAttachments(emailId: string): Promise<InboundAttachment[]> {
  const { data, error } = await getResend().emails.receiving.attachments.list({ emailId });

  if (error) {
    // En bilaga som inte går att hämta får inte hindra att ärendet skapas.
    console.error(`[tickets] Kunde inte lista bilagor för ${emailId}:`, error);
    return [];
  }

  const items = Array.isArray(data) ? data : ((data as { data?: unknown[] } | null)?.data ?? []);

  return (items as Record<string, unknown>[]).map((item) => ({
    id: String(item.id ?? ""),
    filename: typeof item.filename === "string" ? item.filename : "bilaga",
    contentType: typeof item.content_type === "string" ? item.content_type : "application/octet-stream",
    sizeBytes: typeof item.size === "number" ? item.size : 0,
    downloadUrl: typeof item.download_url === "string" ? item.download_url : null,
  }));
}
