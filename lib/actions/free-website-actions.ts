"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { FreeWebsiteNotification } from "@/lib/email/templates/free-website-notification";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { CONTACT } from "@/lib/config/contact";

// ── Schema ────────────────────────────────────────────────────────────────────
const freeWebsiteSchema = z.object({
  name: z
    .string()
    .min(2, "Namnet måste vara minst 2 tecken.")
    .max(100, "Namnet är för långt."),
  phone: z
    .string()
    .min(5, "Ange ett telefonnummer.")
    .max(30, "Telefonnumret är för långt."),
  email: z.string().email("Ange en giltig e-postadress."),
  website: z
    .string()
    .url("Länken ser inte giltig ut — börja med https://")
    .max(300, "Länken är för lång.")
    .optional()
    .or(z.literal("")),
  project: z
    .string()
    .min(10, "Beskriv gärna projektet med några fler ord.")
    .max(5000, "Beskrivningen är för lång (max 5 000 tecken)."),
});

// ── State ─────────────────────────────────────────────────────────────────────
export type FreeWebsiteFormState = {
  success: boolean;
  errors?: Partial<Record<keyof z.infer<typeof freeWebsiteSchema>, string>>;
  message?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function sanitizeField(value: FormDataEntryValue | null): string {
  return stripHtml(typeof value === "string" ? value.trim() : "");
}

// ── Server action ─────────────────────────────────────────────────────────────
export async function submitFreeWebsiteForm(
  _prevState: FreeWebsiteFormState,
  formData: FormData,
): Promise<FreeWebsiteFormState> {
  // Honeypot — dolt fält som bara botar fyller i. Svara "success" utan att göra något.
  if (sanitizeField(formData.get("companyWebsite"))) {
    return { success: true };
  }

  // Rate limiting per IP
  const headersList = await headers();
  const ip =
    headersList.get("cf-connecting-ip") ??
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rateLimitResult = checkRateLimit(`free-website:${ip}`, 3, 10 * 60 * 1000);
  if (!rateLimitResult.allowed) {
    const waitMin = Math.ceil(rateLimitResult.retryAfterMs / 60_000);
    return {
      success: false,
      message: `För många förfrågningar. Försök igen om ${waitMin} minut${waitMin === 1 ? "" : "er"}.`,
    };
  }

  // Sanitera & validera
  const raw = {
    name: sanitizeField(formData.get("name")),
    phone: sanitizeField(formData.get("phone")),
    email: sanitizeField(formData.get("email")),
    website: sanitizeField(formData.get("website")) || undefined,
    project: sanitizeField(formData.get("project")),
  };

  const parsed = freeWebsiteSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: FreeWebsiteFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof freeWebsiteSchema>;
      errors[field] = issue.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;
  const to = process.env.CONTACT_EMAIL_TO ?? CONTACT.email;
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  // Spara i databasen så leadet syns i admin
  let savedToDb = false;
  if (hasDatabaseUrl()) {
    try {
      await db.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: null,
          message: data.project,
          type: "gratis-hemsida",
          metadata: {
            website: data.website ?? null,
            source: "/gratis-hemsida",
          },
        },
      });
      savedToDb = true;
    } catch (err) {
      console.error("[free-website-action] DB-fel:", err);
      // Fortsätt — notifikationsmailet kan fortfarande rädda leadet
    }
  }

  // Notifikation till teamet
  let notificationSent = false;
  try {
    const html = await render(
      FreeWebsiteNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        project: data.project,
      }),
    );

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Ny förfrågan om gratis hemsida – ${data.name}`,
      html,
    });
    notificationSent = true;
  } catch (err) {
    console.error("[free-website-action] Resend-fel:", err);
  }

  // Leadet nådde varken databasen eller teamet — säg det ärligt
  if (!savedToDb && !notificationSent) {
    return {
      success: false,
      message: `Något gick fel när din förfrågan skulle skickas. Försök igen, eller mejla oss direkt på ${to}.`,
    };
  }

  return { success: true };
}
