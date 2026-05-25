"use client";

/**
 * Lead Magnet section — inline on homepage between FAQ and final CTA.
 *
 * Left  (40%): PDF mockup SVG placeholder.
 * Right (60%): sign-up form with server action.
 *
 * TODO: Replace SVG mockup with a real PDF cover image once available.
 */

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeLeadMagnet,
  type LeadMagnetState,
} from "@/lib/actions/lead-magnet-actions";
import { cn } from "@/lib/utils";

/* ── Submit button ───────────────────────────────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "h-12 w-full rounded-xl bg-brand px-6 text-sm font-semibold text-bg",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
      )}
    >
      {pending ? "Skickar…" : "Skicka mig guiden"}
    </button>
  );
}

/* ── PDF mockup SVG ───────────────────────────────────────────────────────────── */

function PdfMockup() {
  return (
    /* TODO: Ersätt med riktig PDF-cover-mockup */
    <div
      className="relative mx-auto w-full max-w-[220px] sm:max-w-[260px]"
      style={{ transform: "rotate(-3deg)" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-[0_20px_40px_rgba(37,99,235,0.20)]"
        role="img"
        aria-label="Vibecoding-guiden 2026 — PDF"
      >
        {/* Paper */}
        <rect width="220" height="300" rx="8" fill="#F0F7FF" />
        {/* Brand stripe */}
        <rect width="220" height="60" rx="8" fill="#2563EB" />
        <rect y="52" width="220" height="8" fill="#2563EB" />

        {/* Brand wordmark */}
        <text
          x="18"
          y="32"
          fontFamily="system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#FFFFFF"
          opacity="0.95"
        >
          VibeDev
        </text>

        {/* Badge */}
        <rect x="18" y="44" width="54" height="12" rx="3" fill="rgba(255,255,255,0.20)" />
        <text
          x="45"
          y="54"
          fontFamily="system-ui, sans-serif"
          fontSize="7"
          fontWeight="600"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          GRATIS GUIDE
        </text>

        {/* Title */}
        <text
          x="18"
          y="96"
          fontFamily="system-ui, sans-serif"
          fontSize="16"
          fontWeight="800"
          fill="#0F172A"
          letterSpacing="-0.3"
        >
          Vibecoding
        </text>
        <text
          x="18"
          y="118"
          fontFamily="system-ui, sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="#475569"
        >
          Så bygger moderna team
        </text>
        <text
          x="18"
          y="134"
          fontFamily="system-ui, sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="#475569"
        >
          snabbare 2026
        </text>

        {/* Divider */}
        <line x1="18" y1="150" x2="202" y2="150" stroke="#CBD5E1" strokeWidth="1" />

        {/* Placeholder content lines */}
        {[168, 184, 200, 216, 232, 248].map((y, i) => (
          <rect
            key={y}
            x="18"
            y={y}
            width={i % 3 === 2 ? 100 : i % 2 === 0 ? 170 : 145}
            height="6"
            rx="3"
            fill="#CBD5E1"
            opacity={0.6 + i * 0.04}
          />
        ))}

        {/* Bottom accent */}
        <rect y="284" width="220" height="16" rx="0" fill="#EFF6FF" />
        <rect y="290" width="220" height="10" rx="0" fill="#DBEAFE" />
      </svg>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */

const initialState: LeadMagnetState = { status: "idle" };

export function LeadMagnet() {
  const [state, formAction] = useActionState(subscribeLeadMagnet, initialState);

  const submitted = state.status === "success" || state.status === "duplicate";

  return (
    <div className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC]">
      <div className="grid gap-0 lg:grid-cols-[2fr_3fr]">

        {/* ── Left: PDF mockup (40%) ────────────────────────────────────────── */}
        <div className="flex items-center justify-center border-b border-brand/15 px-8 py-10 lg:border-b-0 lg:border-r">
          <PdfMockup />
        </div>

        {/* ── Right: form (60%) ────────────────────────────────────────────── */}
        <div className="px-8 py-10">

          {/* Badge */}
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Gratis guide
          </span>

          {/* Headline */}
          <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
            Vibecoding — så bygger moderna team snabbare 2026.
          </h2>

          {/* Body copy */}
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Vi har samlat erfarenheter från 4 utvecklare och 10+ projekt:
            hur vi använder AI i kodflödet, vilka verktyg vi väljer och hur
            vi skär scope för att leverera på halva tiden. Få guiden gratis.
          </p>

          {/* ── Form / success state ─────────────────────────────────────── */}

          {submitted ? (
            /* Success card */
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Tack! Guiden är på väg till din inbox.
                </p>
                {state.status === "duplicate" && (
                  <p className="mt-1 text-xs text-green-700">
                    Du har redan laddat ned guiden — vi har skickat länken igen.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-3">
              {/* Email input */}
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  E-postadress
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="din@email.se"
                  className={cn(
                    "h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm text-text",
                    "placeholder:text-muted/60",
                    "transition-colors duration-150",
                    "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
                  )}
                />
              </div>

              {/* Error message */}
              {state.status === "error" && (
                <p className="text-xs text-red-600" role="alert">
                  {state.message}
                </p>
              )}

              <SubmitButton />

              {/* Disclaimer */}
              <p className="text-center text-xs text-muted">
                Inga säljmail. Avregistrera när du vill.
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
