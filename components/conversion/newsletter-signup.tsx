"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeLeadMagnet,
  type LeadMagnetState,
} from "@/lib/actions/lead-magnet-actions";
import { cn } from "@/lib/utils";

/* ── Submit button ──────────────────────────────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "h-12 shrink-0 rounded-xl bg-brand px-6 text-sm font-semibold text-bg",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
      )}
    >
      {pending ? "Skickar…" : "Prenumerera"}
    </button>
  );
}

/* ── Component ──────────────────────────────────────────────────────────────── */

const initialState: LeadMagnetState = { status: "idle" };

export function NewsletterSignup({ source = "newsletter" }: { source?: string }) {
  const [state, formAction] = useActionState(subscribeLeadMagnet, initialState);
  const submitted = state.status === "success" || state.status === "duplicate";

  if (submitted) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-800">Du är med!</p>
          <p className="mt-0.5 text-xs text-green-700">
            {state.status === "duplicate"
              ? "Den här adressen är redan med — vi ser fram emot att fortsätta skicka."
              : "Välkommen! Håll utkik i din inbox."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="source" value={source} />

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            E-postadress
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="din@email.se"
            className={cn(
              "h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm text-text",
              "placeholder:text-muted/60",
              "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            )}
          />
        </div>
        <SubmitButton />
      </div>

      {state.status === "error" && (
        <p className="text-xs text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <p className="text-xs text-muted">
        Avregistrera när du vill. Vi delar aldrig din e-post.
      </p>
    </form>
  );
}
