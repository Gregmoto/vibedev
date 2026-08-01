"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { render } from "@react-email/render";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { resend } from "@/lib/email/resend-client";
import { PasswordResetEmail } from "@/lib/email/templates/password-reset";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { getResolvedSiteSettings } from "@/lib/site-settings";

/**
 * Återställning av lösenord.
 *
 * Vi återanvänder VerificationToken-tabellen (identifier/token/expires) i stället
 * för att lägga till en egen tabell — samma fält behövs, och ingen migrering krävs.
 *
 * Säkerhet:
 *  - Endast en HASH av token lagras. Läcker databasen går den inte att använda.
 *  - Token gäller i 60 minuter och är engångs — den raderas när den använts.
 *  - Nya förfrågningar rensar tidigare tokens för samma adress.
 *  - Svaret är alltid detsamma oavsett om adressen finns, så att formuläret inte
 *    kan användas för att kartlägga vilka konton som existerar.
 */

const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/* ── 1. Begär återställningslänk ──────────────────────────────────────────── */

const requestSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress."),
});

export type ResetRequestState = {
  done: boolean;
  error?: string;
};

export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const raw = { email: String(formData.get("email") ?? "").trim().toLowerCase() };

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return { done: false, error: parsed.error.issues[0]?.message };
  }

  const rate = checkRateLimit(`pwreset:${await clientIp()}`, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    const min = Math.ceil(rate.retryAfterMs / 60_000);
    return {
      done: false,
      error: `För många försök. Vänta ${min} minut${min === 1 ? "" : "er"} och försök igen.`,
    };
  }

  if (!hasDatabaseUrl()) {
    return { done: false, error: "Tjänsten är inte tillgänglig just nu. Försök igen senare." };
  }

  try {
    const user = await db.user.findUnique({ where: { email: parsed.data.email } });

    // Finns kontot skickar vi mejlet. Finns det inte gör vi ingenting —
    // men svaret nedan är identiskt i båda fallen.
    if (user) {
      const token = randomBytes(32).toString("hex");

      await db.verificationToken.deleteMany({ where: { identifier: parsed.data.email } });
      await db.verificationToken.create({
        data: {
          identifier: parsed.data.email,
          token: hashToken(token),
          expires: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const settings = await getResolvedSiteSettings();
      const resetUrl = `${settings.siteUrl}/admin/losenord/${token}`;

      const html = await render(
        PasswordResetEmail({ resetUrl, expiresInMinutes: TOKEN_TTL_MS / 60_000 }),
      );

      await resend.emails.send({
        from: process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev",
        to: parsed.data.email,
        subject: "Återställ ditt lösenord — VibeDev",
        html,
      });
    }
  } catch (err) {
    console.error("[password-reset] Kunde inte skicka återställningslänk:", err);
    return {
      done: false,
      error: "Något gick fel. Försök igen om en stund.",
    };
  }

  return { done: true };
}

/* ── 2. Sätt nytt lösenord ────────────────────────────────────────────────── */

const resetSchema = z
  .object({
    token: z.string().min(10),
    password: z
      .string()
      .min(10, "Lösenordet måste vara minst 10 tecken.")
      .max(200, "Lösenordet är för långt."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Lösenorden matchar inte.",
    path: ["confirm"],
  });

export type ResetPasswordState = {
  done: boolean;
  error?: string;
};

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetSchema.safeParse({
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  });

  if (!parsed.success) {
    return { done: false, error: parsed.error.issues[0]?.message };
  }

  const rate = checkRateLimit(`pwset:${await clientIp()}`, 10, 15 * 60 * 1000);
  if (!rate.allowed) {
    return { done: false, error: "För många försök. Vänta en stund och försök igen." };
  }

  if (!hasDatabaseUrl()) {
    return { done: false, error: "Tjänsten är inte tillgänglig just nu. Försök igen senare." };
  }

  try {
    const record = await db.verificationToken.findFirst({
      where: { token: hashToken(parsed.data.token) },
    });

    if (!record || record.expires < new Date()) {
      if (record) {
        await db.verificationToken.deleteMany({ where: { token: record.token } });
      }
      return {
        done: false,
        error: "Länken är ogiltig eller har gått ut. Begär en ny återställningslänk.",
      };
    }

    const user = await db.user.findUnique({ where: { email: record.identifier } });
    if (!user) {
      await db.verificationToken.deleteMany({ where: { token: record.token } });
      return { done: false, error: "Länken är ogiltig. Begär en ny återställningslänk." };
    }

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
    });

    // Engångstoken — förbrukas direkt. Rensa även ev. andra tokens för adressen.
    await db.verificationToken.deleteMany({ where: { identifier: record.identifier } });

    // Logga ut befintliga sessioner så att ett stulet lösenord inte kan användas vidare.
    await db.session.deleteMany({ where: { userId: user.id } }).catch(() => {});
  } catch (err) {
    console.error("[password-reset] Kunde inte sätta nytt lösenord:", err);
    return { done: false, error: "Något gick fel. Försök igen om en stund." };
  }

  return { done: true };
}
