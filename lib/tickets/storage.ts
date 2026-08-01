import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Lagring av bilagor i R2 (bucket "vibedev-ticket-attachments").
 *
 * Resends nedladdningslänkar för inkommande bilagor lever bara en timme, så
 * filerna måste kopieras till egen lagring om de ska gå att öppna senare i
 * adminpanelen eller kundportalen.
 *
 * Lokalt (`next dev`) finns ingen R2-binding. Då sparas ingen fil — bilagans
 * metadata skrivs ändå till databasen, och saknad storageKey visas som en
 * bilaga utan nedladdningslänk i stället för att spränga hela mejlhanteringen.
 */

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

function getBucket(): R2Bucket | null {
  try {
    const { env } = getCloudflareContext();
    return env?.TICKET_ATTACHMENTS ?? null;
  } catch {
    return null;
  }
}

export function hasAttachmentStorage(): boolean {
  return getBucket() !== null;
}

/** Nyckeln innehåller ärendets id så att en läckt nyckel inte avslöjar något om andra ärenden. */
export function buildStorageKey(ticketId: string, messageId: string, filename: string): string {
  const safeName = filename.replace(/[^\w.\-]+/g, "_").slice(-120) || "bilaga";
  return `tickets/${ticketId}/${messageId}/${safeName}`;
}

export type StoredAttachment = {
  storageKey: string;
  sizeBytes: number;
};

export async function storeAttachment(
  key: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<StoredAttachment | null> {
  if (data.byteLength > MAX_ATTACHMENT_BYTES) {
    console.warn(`[tickets] Hoppar över bilaga större än 25 MB: ${key} (${data.byteLength} byte)`);
    return null;
  }

  const bucket = getBucket();
  if (!bucket) {
    return null;
  }

  await bucket.put(key, data, {
    httpMetadata: { contentType: contentType || "application/octet-stream" },
  });

  return { storageKey: key, sizeBytes: data.byteLength };
}

export type FetchedAttachment = {
  body: ReadableStream;
  contentType: string;
  sizeBytes: number;
};

export async function fetchAttachment(key: string): Promise<FetchedAttachment | null> {
  const bucket = getBucket();
  if (!bucket) {
    return null;
  }

  const object = await bucket.get(key);
  if (!object) {
    return null;
  }

  return {
    body: object.body,
    contentType: object.httpMetadata?.contentType ?? "application/octet-stream",
    sizeBytes: object.size,
  };
}

export async function deleteAttachments(keys: string[]): Promise<void> {
  const bucket = getBucket();
  if (!bucket || keys.length === 0) {
    return;
  }

  await bucket.delete(keys);
}
