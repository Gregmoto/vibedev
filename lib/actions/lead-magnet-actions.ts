"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { LeadMagnetConfirmation } from "@/lib/email/templates/lead-magnet-confirmation";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { checkRateLimit } from "@/lib/rate-limit";

/* ── Schema ────────────────────────────────────────────────────────────────── */

const schema = z.object({
  email: z.string().email("Ange en giltig e-postadress."),
});

/* ── State type ─────────────────────────────────────────────────────────────── */

export type LeadMagnetState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

/* ── Action ─────────────────────────────────────────────────────────────────── */

export async function subscribeLeadMagnet(
  _prev: LeadMagnetState,
  formData: FormData,
): Promise<LeadMagnetState> {
  /* Rate limit: 3 submissions per IP per 10 min */
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = checkRateLimit(`lead-magnet:${ip}`, 3, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { status: "error", message: "För många försök. Prova igen om en stund." };
  }

  /* Validate */
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      status:  "error",
      message: parsed.error.errors[0]?.message ?? "Ogiltig e-postadress.",
    };
  }

  const { email } = parsed.data;

  /* Persist */
  if (hasDatabaseUrl()) {
    try {
      const existing = await db.leadMagnetSubscriber.findUnique({
        where:  { email },
        select: { id: true },
      });

      if (existing) {
        // Already signed up — still send the email so they can re-download
        await sendConfirmationEmail(email);
        return { status: "duplicate" };
      }

      await db.leadMagnetSubscriber.create({
        data: {
          email,
          source:    "vibecoding-guide",
          confirmed: false,
        },
      });
    } catch (err) {
      console.error("[lead-magnet] DB-fel:", err);
      return { status: "error", message: "Något gick fel. Försök igen." };
    }
  }

  /* Send confirmation email */
  await sendConfirmationEmail(email);

  return { status: "success" };
}

/* ── Email helper ────────────────────────────────────────────────────────────── */

async function sendConfirmationEmail(email: string) {
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  try {
    const html = await render(LeadMagnetConfirmation({ email }));

    await resend.emails.send({
      from,
      to:      email,
      subject: "Din Vibecoding-guide är här 🎉",
      html,
    });
  } catch (err) {
    // Non-fatal: log but don't surface to user
    console.error("[lead-magnet] Resend-fel:", err);
  }
}
