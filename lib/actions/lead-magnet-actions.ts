"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { LeadMagnetConfirmation } from "@/lib/email/templates/lead-magnet-confirmation";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ResourceSource } from "@/content/resources";

/* ── Resource config map ──────────────────────────────────────────────────── */

const RESOURCE_CONFIG: Record<
  ResourceSource,
  {
    pdfUrl: string | null; // null = newsletter (no PDF)
    emailSubject: string;
    resourceTitle: string;
    resourceDescription: string;
  }
> = {
  "mvp-checklist": {
    /* TODO: Upload real PDF to /public/resources/mvp-checklist.pdf */
    pdfUrl: "https://vibedev.se/resources/mvp-checklist.pdf",
    emailSubject: "Din MVP-checklista är här",
    resourceTitle: "MVP-checklistan för founders",
    resourceDescription:
      "20-punkts checklista för vad som måste vara på plats innan ni börjar bygga er MVP.",
  },
  "vibecoding-guide": {
    /* TODO: Upload real PDF to /public/resources/vibecoding-guide-2026.pdf */
    pdfUrl: "https://vibedev.se/resources/vibecoding-guide-2026.pdf",
    emailSubject: "Din Vibecoding-guide är här 🎉",
    resourceTitle: "Vibecoding-guiden 2026",
    resourceDescription:
      "Så använder moderna team AI i kodflödet för att bygga produkter på halva tiden.",
  },
  "ai-decision-model": {
    /* TODO: Upload real PDF to /public/resources/ai-decision-model.pdf */
    pdfUrl: "https://vibedev.se/resources/ai-decision-model.pdf",
    emailSubject: "Din AI-guide är här",
    resourceTitle: "När passar AI i en digital produkt?",
    resourceDescription:
      "En enkel beslutsmodell för att avgöra om AI faktiskt tillför värde i just ert case.",
  },
  newsletter: {
    pdfUrl: null,
    emailSubject: "Välkommen till VibeDev — praktiska guider varje månad",
    resourceTitle: "VibeDev-nyhetsbrevet",
    resourceDescription: "Praktiska guider för team som vill bygga med mer klarhet.",
  },
  "podcast-newsletter": {
    pdfUrl: null,
    emailSubject: "Välkommen — du prenumererar nu på Vibecoding-podden",
    resourceTitle: "Vibecoding-podden",
    resourceDescription: "Nya avsnitt direkt i inboxen plus bonus-resurser och lästips.",
  },
};

/* ── Schema ───────────────────────────────────────────────────────────────── */

const schema = z.object({
  email:  z.string().email("Ange en giltig e-postadress."),
  name:   z.string().optional(),
  source: z
    .enum(["mvp-checklist", "vibecoding-guide", "ai-decision-model", "newsletter", "podcast-newsletter"])
    .default("vibecoding-guide"),
});

/* ── State type ───────────────────────────────────────────────────────────── */

export type LeadMagnetState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

/* ── Action ───────────────────────────────────────────────────────────────── */

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
  const parsed = schema.safeParse({
    email:  formData.get("email"),
    name:   formData.get("name") ?? undefined,
    source: formData.get("source") ?? "vibecoding-guide",
  });
  if (!parsed.success) {
    return {
      status:  "error",
      message: parsed.error.errors[0]?.message ?? "Ogiltig e-postadress.",
    };
  }

  const { email, source } = parsed.data;
  const config = RESOURCE_CONFIG[source];

  /* Persist */
  if (hasDatabaseUrl()) {
    try {
      const existing = await db.leadMagnetSubscriber.findUnique({
        where:  { email },
        select: { id: true },
      });

      if (existing) {
        // Already signed up — still send the requested resource
        await sendResourceEmail(email, config);
        return { status: "duplicate" };
      }

      await db.leadMagnetSubscriber.create({
        data: {
          email,
          source,
          confirmed: false,
        },
      });
    } catch (err) {
      console.error("[lead-magnet] DB-fel:", err);
      return { status: "error", message: "Något gick fel. Försök igen." };
    }
  }

  /* Send email */
  await sendResourceEmail(email, config);

  return { status: "success" };
}

/* ── Email helper ──────────────────────────────────────────────────────────── */

async function sendResourceEmail(
  email: string,
  config: (typeof RESOURCE_CONFIG)[ResourceSource],
) {
  const from = process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

  try {
    const html = await render(
      LeadMagnetConfirmation({
        email,
        pdfUrl:              config.pdfUrl ?? undefined,
        resourceTitle:       config.resourceTitle,
        resourceDescription: config.resourceDescription,
        isNewsletter:        config.pdfUrl === null,
      }),
    );

    await resend.emails.send({
      from,
      to:      email,
      subject: config.emailSubject,
      html,
    });
  } catch (err) {
    // Non-fatal: log but don't surface to user
    console.error("[lead-magnet] Resend-fel:", err);
  }
}
