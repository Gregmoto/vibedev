"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { RentalNotification } from "@/lib/email/templates/rental-notification";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { CONTACT } from "@/lib/config/contact";

// ── Schema ────────────────────────────────────────────────────────────────────
const PROJECT_TYPES = ["Hemsida", "Webbshop", "System", "Vet ej"] as const;

const rentalSchema = z.object({
  name: z
    .string()
    .min(2, "Namnet måste vara minst 2 tecken.")
    .max(100, "Namnet är för långt."),
  company: z
    .string()
    .max(100, "Företagsnamnet är för långt.")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Ange en giltig e-postadress."),
  phone: z
    .string()
    .max(30, "Telefonnumret är för långt.")
    .optional()
    .or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES, {
    errorMap: () => ({ message: "Välj typ av projekt." }),
  }),
  project: z
    .string()
    .min(10, "Beskriv gärna projektet med några fler ord.")
    .max(5000, "Beskrivningen är för lång (max 5 000 tecken)."),
  startDate: z
    .string()
    .max(100, "Texten är för lång.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .max(200, "Texten är för lång.")
    .optional()
    .or(z.literal("")),
});

// ── State ─────────────────────────────────────────────────────────────────────
export type RentalFormState = {
  success: boolean;
  errors?: Partial<Record<keyof z.infer<typeof rentalSchema>, string>>;
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
export async function submitRentalForm(
  _prevState: RentalFormState,
  formData: FormData,
): Promise<RentalFormState> {
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

  const rateLimitResult = checkRateLimit(`hyr:${ip}`, 3, 10 * 60 * 1000);
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
    company: sanitizeField(formData.get("company")) || undefined,
    email: sanitizeField(formData.get("email")),
    phone: sanitizeField(formData.get("phone")) || undefined,
    projectType: sanitizeField(formData.get("projectType")),
    project: sanitizeField(formData.get("project")),
    startDate: sanitizeField(formData.get("startDate")) || undefined,
    budget: sanitizeField(formData.get("budget")) || undefined,
  };

  const parsed = rentalSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: RentalFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof rentalSchema>;
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
          phone: data.phone ?? null,
          company: data.company ?? null,
          message: data.project,
          type: "hyr",
          metadata: {
            projectType: data.projectType,
            startDate: data.startDate ?? null,
            budget: data.budget ?? null,
            source: "/hyr",
          },
        },
      });
      savedToDb = true;
    } catch (err) {
      console.error("[rental-action] DB-fel:", err);
      // Fortsätt — notifikationsmailet kan fortfarande rädda leadet
    }
  }

  // Notifikation till teamet
  let notificationSent = false;
  try {
    const html = await render(
      RentalNotification({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType,
        project: data.project,
        startDate: data.startDate,
        budget: data.budget,
      }),
    );

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Ny offertförfrågan — hyr hemsida – ${data.name}`,
      html,
    });
    notificationSent = true;
  } catch (err) {
    console.error("[rental-action] Resend-fel:", err);
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
