"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { ContactConfirmation } from "@/lib/email/templates/contact-confirmation";
import { ContactNotification } from "@/lib/email/templates/contact-notification";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { CONTACT } from "@/lib/config/contact";

// ── Schema ────────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Namnet måste vara minst 2 tecken.")
    .max(100, "Namnet är för långt."),
  email: z.string().email("Ange en giltig e-postadress."),
  phone: z
    .string()
    .max(30, "Telefonnumret är för långt.")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Företagsnamnet är för långt.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Meddelandet måste vara minst 10 tecken.")
    .max(5000, "Meddelandet är för långt (max 5 000 tecken)."),
});

// ── State types ───────────────────────────────────────────────────────────────
export type ContactFormState = {
  success: boolean;
  errors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
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
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Rate limiting per IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rateLimitResult = checkRateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rateLimitResult.allowed) {
    const waitMin = Math.ceil(rateLimitResult.retryAfterMs / 60_000);
    return {
      success: false,
      message: `För många förfrågningar. Försök igen om ${waitMin} minut${waitMin === 1 ? "" : "er"}.`,
    };
  }

  // Sanitize & validate
  const raw = {
    name: sanitizeField(formData.get("name")),
    email: sanitizeField(formData.get("email")),
    phone: sanitizeField(formData.get("phone")) || undefined,
    company: sanitizeField(formData.get("company")) || undefined,
    message: sanitizeField(formData.get("message")),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof contactSchema>;
      errors[field] = issue.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;
  const to = process.env.CONTACT_EMAIL_TO ?? CONTACT.email;
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  // Spara i databasen (primary — spara alltid om DB finns)
  if (hasDatabaseUrl()) {
    try {
      await db.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          company: data.company ?? null,
          message: data.message,
          type: "contact",
        },
      });
    } catch (err) {
      console.error("[contact-action] DB-fel:", err);
      // Fortsätt — skicka mail ändå
    }
  }

  // Skicka notifikation till teamet
  try {
    const notificationHtml = await render(
      ContactNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
      }),
    );

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Ny kontaktförfrågan från ${data.name}`,
      html: notificationHtml,
    });
  } catch (err) {
    console.error("[contact-action] Resend-fel (notifikation):", err);
    // Returnera success ändå — DB-sparningen lyckades
  }

  // Skicka bekräftelse till avsändaren
  try {
    const confirmationHtml = await render(
      ContactConfirmation({ name: data.name }),
    );

    await resend.emails.send({
      from,
      to: data.email,
      subject: "Vi har tagit emot din förfrågan — vibedev",
      html: confirmationHtml,
    });
  } catch (err) {
    console.error("[contact-action] Resend-fel (bekräftelse):", err);
  }

  return {
    success: true,
    message: "Tack! Vi återkommer inom 24 timmar.",
  };
}
