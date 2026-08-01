"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getFirstIssueMessage,
  normalizeEmpty,
  requireAdminAction,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { INBOUND_DOMAIN } from "@/lib/tickets/addressing";
import { sendAgentReply } from "@/lib/tickets/service";
import { deleteAttachments } from "@/lib/tickets/storage";

export type TicketFormState = {
  error?: string;
  success?: string;
};

/* ── Konton ──────────────────────────────────────────────────────────────── */

const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Namn krävs."),
  slug: z
    .string()
    .min(2, "Adressnamn krävs.")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Adressnamnet får bara innehålla små bokstäver, siffror och bindestreck.",
    )
    // "+" delar av svarsnyckeln i adressen, så det får inte förekomma i slug.
    .refine((value) => !value.includes("+"), "Adressnamnet får inte innehålla +."),
  replyFromName: z.string().min(2, "Avsändarnamn krävs."),
  replyFromEmail: z.string().email("Ange en giltig avsändaradress."),
  signature: z.string().optional(),
  isActive: z.boolean(),
});

export async function saveTicketAccountAction(
  _prevState: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  await requireAdminAction();

  const parsed = accountSchema.safeParse({
    id: normalizeEmpty(formData.get("id")) || undefined,
    name: normalizeEmpty(formData.get("name")),
    slug: normalizeEmpty(formData.get("slug")).toLowerCase(),
    replyFromName: normalizeEmpty(formData.get("replyFromName")),
    replyFromEmail: normalizeEmpty(formData.get("replyFromEmail")).toLowerCase(),
    signature: normalizeEmpty(formData.get("signature")),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: getFirstIssueMessage(parsed.error, "Kunde inte spara kontot.") };
  }

  const { id, slug, signature, ...rest } = parsed.data;
  const inboundEmail = `${slug}@${INBOUND_DOMAIN}`;

  const clash = await db.ticketAccount.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });

  if (clash) {
    return { error: `Adressnamnet "${slug}" används redan av ett annat konto.` };
  }

  const data = { ...rest, slug, inboundEmail, signature: signature || null };

  if (id) {
    await db.ticketAccount.update({ where: { id }, data });
  } else {
    await db.ticketAccount.create({ data });
  }

  revalidatePath("/admin/arenden/konton");
  revalidatePath("/admin/arenden");

  return { success: `Kontot sparades. Adressen är ${inboundEmail}.` };
}

export async function deleteTicketAccountAction(formData: FormData): Promise<void> {
  await requireAdminAction();

  const id = normalizeEmpty(formData.get("id"));
  if (!id) {
    return;
  }

  // Ärendena raderas med kontot (onDelete: Cascade). Bilagorna ligger i R2 och
  // städas inte av databasen — de måste tas bort explicit, annars betalar vi
  // för lagring av filer som ingen längre kan nå.
  const keys = await db.ticketAttachment.findMany({
    where: { message: { ticket: { accountId: id } }, storageKey: { not: null } },
    select: { storageKey: true },
  });

  await deleteAttachments(keys.map((row) => row.storageKey!).filter(Boolean));
  await db.ticketAccount.delete({ where: { id } });

  revalidatePath("/admin/arenden/konton");
  revalidatePath("/admin/arenden");
}

/* ── Ärenden ─────────────────────────────────────────────────────────────── */

const replySchema = z.object({
  ticketId: z.string().min(1, "Ärende saknas."),
  bodyText: z.string().min(1, "Skriv ett svar innan du skickar."),
});

export async function replyToTicketAction(
  _prevState: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  await requireAdminAction();

  const parsed = replySchema.safeParse({
    ticketId: normalizeEmpty(formData.get("ticketId")),
    bodyText: normalizeEmpty(formData.get("bodyText")),
  });

  if (!parsed.success) {
    return { error: getFirstIssueMessage(parsed.error, "Kunde inte skicka svaret.") };
  }

  try {
    await sendAgentReply({
      ticketId: parsed.data.ticketId,
      bodyText: parsed.data.bodyText,
    });
  } catch (err) {
    console.error("[tickets] Svar misslyckades:", err);
    return {
      error: err instanceof Error ? err.message : "Kunde inte skicka svaret.",
    };
  }

  revalidatePath(`/admin/arenden/${parsed.data.ticketId}`);
  revalidatePath("/admin/arenden");

  return { success: "Svaret skickades till kunden." };
}

export async function updateTicketStatusAction(formData: FormData): Promise<void> {
  await requireAdminAction();

  const id = normalizeEmpty(formData.get("id"));
  const status = normalizeEmpty(formData.get("status"));

  if (!id || !["OPEN", "PENDING", "CLOSED"].includes(status)) {
    return;
  }

  await db.ticket.update({
    where: { id },
    data: { status: status as "OPEN" | "PENDING" | "CLOSED" },
  });

  revalidatePath(`/admin/arenden/${id}`);
  revalidatePath("/admin/arenden");
}

export async function deleteTicketAction(formData: FormData): Promise<void> {
  await requireAdminAction();

  const id = normalizeEmpty(formData.get("id"));
  if (!id) {
    return;
  }

  const keys = await db.ticketAttachment.findMany({
    where: { message: { ticketId: id }, storageKey: { not: null } },
    select: { storageKey: true },
  });

  await deleteAttachments(keys.map((row) => row.storageKey!).filter(Boolean));
  await db.ticket.delete({ where: { id } });

  revalidatePath("/admin/arenden");
  redirect("/admin/arenden");
}
