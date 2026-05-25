"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { BookingConfirmation } from "@/lib/email/templates/booking-confirmation";
import { BookingNotification } from "@/lib/email/templates/booking-notification";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";

// ── Schema ────────────────────────────────────────────────────────────────────
const bookingSchema = z.object({
  name: z
    .string()
    .min(2, "Namnet måste vara minst 2 tecken.")
    .max(100, "Namnet är för långt."),
  email: z.string().email("Ange en giltig e-postadress."),
  company: z
    .string()
    .max(100, "Företagsnamnet är för långt.")
    .optional()
    .or(z.literal("")),
  role: z
    .string()
    .max(100, "Rolltiteln är för lång.")
    .optional()
    .or(z.literal("")),
  projectType: z.string().min(1, "Välj typ av projekt."),
  budget: z.string().min(1, "Välj budgetnivå."),
  timeline: z.string().min(1, "Välj en tidslinje."),
  goal: z
    .string()
    .max(300, "Målet är för långt.")
    .optional()
    .or(z.literal("")),
  project: z
    .string()
    .min(10, "Projektbeskrivningen måste vara minst 10 tecken.")
    .max(5000, "Projektbeskrivningen är för lång (max 5 000 tecken)."),
});

// ── State types ───────────────────────────────────────────────────────────────
export type BookingFormState = {
  success: boolean;
  errors?: Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;
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
export async function submitBookingForm(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  // Rate limiting per IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rateLimitResult = checkRateLimit(`booking:${ip}`, 3, 10 * 60 * 1000);
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
    company: sanitizeField(formData.get("company")) || undefined,
    role: sanitizeField(formData.get("role")) || undefined,
    projectType: sanitizeField(formData.get("projectType")),
    budget: sanitizeField(formData.get("budget")),
    timeline: sanitizeField(formData.get("timeline")),
    goal: sanitizeField(formData.get("goal")) || undefined,
    project: sanitizeField(formData.get("project")),
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: BookingFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof bookingSchema>;
      errors[field] = issue.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;
  const to = process.env.CONTACT_EMAIL_TO ?? "hello@vibedev.se";
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  // Spara i databasen
  if (hasDatabaseUrl()) {
    try {
      await db.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company ?? null,
          message: data.project,
          type: "booking",
          metadata: {
            role: data.role ?? null,
            projectType: data.projectType,
            budget: data.budget,
            timeline: data.timeline,
            goal: data.goal ?? null,
          },
        },
      });
    } catch (err) {
      console.error("[booking-action] DB-fel:", err);
    }
  }

  // Notifikation till teamet
  try {
    const notificationHtml = await render(
      BookingNotification({
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        goal: data.goal,
        project: data.project,
      }),
    );

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Ny projektförfrågan från ${data.name} — ${data.projectType}`,
      html: notificationHtml,
    });
  } catch (err) {
    console.error("[booking-action] Resend-fel (notifikation):", err);
  }

  // Bekräftelse till avsändaren
  try {
    const confirmationHtml = await render(
      BookingConfirmation({ name: data.name, projectType: data.projectType }),
    );

    await resend.emails.send({
      from,
      to: data.email,
      subject: "Vi har tagit emot din projektförfrågan — vibedev",
      html: confirmationHtml,
    });
  } catch (err) {
    console.error("[booking-action] Resend-fel (bekräftelse):", err);
  }

  return {
    success: true,
    message: "Tack! Vi återkommer inom 24 timmar.",
  };
}
