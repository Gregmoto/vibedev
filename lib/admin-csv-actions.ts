"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

export type CsvUploadState = { error?: string; success?: string };

/* Workers tar emot upp till 100 MB per förfrågan. Vi stannar under det med
   marginal — större filer bör hämtas från källan i stället för laddas upp. */
const MAX_BYTES = 60 * 1024 * 1024;

const PREFIX = "uploads/csv/";

function getBucket(): R2Bucket | null {
  try {
    return getCloudflareContext().env?.TICKET_ATTACHMENTS ?? null;
  } catch {
    return null;
  }
}

/** Gör om ett filnamn till en adressdel: "Prislista Höst 2026.csv" → "prislista-host-2026". */
function toSlug(fileName: string): string {
  return (
    fileName
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "fil"
  );
}

export async function uploadCsvAction(
  _prev: CsvUploadState,
  formData: FormData,
): Promise<CsvUploadState> {
  await requireAdminAction();

  const file = formData.get("file");
  const replaceId = String(formData.get("replaceId") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Välj en fil att ladda upp." };
  }
  if (file.size > MAX_BYTES) {
    return { error: `Filen är ${Math.round(file.size / 1024 / 1024)} MB. Gränsen är 60 MB.` };
  }

  const bucket = getBucket();
  if (!bucket) {
    return { error: "Lagringen är inte tillgänglig." };
  }

  const data = await file.arrayBuffer();
  const contentType = file.type || "text/csv";

  // Ersätta: samma lagringsnyckel och samma slug, så länken fortsätter fungera
  // hos alla som redan använder den. Det är hela poängen med funktionen.
  if (replaceId) {
    const existing = await db.csvFile.findUnique({ where: { id: replaceId } });
    if (!existing) {
      return { error: "Filen finns inte längre." };
    }

    await bucket.put(existing.storageKey, data, { httpMetadata: { contentType } });
    await db.csvFile.update({
      where: { id: existing.id },
      data: {
        name: file.name,
        sizeBytes: data.byteLength,
        contentType,
        versions: { increment: 1 },
      },
    });

    revalidatePath("/admin/csv");
    return { success: `${file.name} ersattes. Länken är oförändrad.` };
  }

  // Ny fil: hitta en ledig adressdel.
  const base = toSlug(file.name);
  let slug = base;
  for (let i = 2; await db.csvFile.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }

  const storageKey = `${PREFIX}${slug}.csv`;
  await bucket.put(storageKey, data, { httpMetadata: { contentType } });

  await db.csvFile.create({
    data: { slug, name: file.name, storageKey, sizeBytes: data.byteLength, contentType },
  });

  revalidatePath("/admin/csv");
  return { success: `${file.name} laddades upp.` };
}

export async function deleteCsvAction(formData: FormData): Promise<void> {
  await requireAdminAction();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const file = await db.csvFile.findUnique({ where: { id } });
  if (!file) return;

  await getBucket()?.delete(file.storageKey);
  await db.csvFile.delete({ where: { id } });

  revalidatePath("/admin/csv");
}
