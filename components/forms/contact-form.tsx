"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── Submit-knapp med laddningsstate ───────────────────────────────────────────
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <SpinnerIcon />
          Skickar...
        </span>
      ) : (
        "Skicka förfrågan →"
      )}
    </Button>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Felmeddelande ─────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500" role="alert">
      {message}
    </p>
  );
}

// ── Success-kort ──────────────────────────────────────────────────────────────
function SuccessCard() {
  return (
    <div
      className="flex flex-col items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-6"
      role="status"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
        <svg
          className="h-5 w-5 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-text">Förfrågan skickad!</p>
        <p className="mt-1 text-sm text-muted">
          Tack! Vi återkommer inom 24 timmar.
        </p>
      </div>
    </div>
  );
}

// ── Formuläret ────────────────────────────────────────────────────────────────
const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return <SuccessCard />;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Globalt felmeddelande (t.ex. rate limit) */}
      {state.message && !state.success && (
        <div
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input
            name="name"
            label="Namn"
            placeholder="Ditt namn"
            className={cn(state.errors?.name && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.name}
          />
          <FieldError message={state.errors?.name} />
        </div>
        <div>
          <Input
            name="company"
            label="Företag"
            placeholder="Företagsnamn"
            className={cn(state.errors?.company && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.company}
          />
          <FieldError message={state.errors?.company} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input
            name="email"
            type="email"
            label="E-post"
            placeholder="namn@foretag.se"
            className={cn(state.errors?.email && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.email}
          />
          <FieldError message={state.errors?.email} />
        </div>
        <div>
          <Input
            name="phone"
            type="tel"
            label="Telefon"
            placeholder="+46 ..."
            className={cn(state.errors?.phone && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.phone}
          />
          <FieldError message={state.errors?.phone} />
        </div>
      </div>

      <div>
        <Textarea
          name="message"
          label="Vad vill ni ha hjälp med?"
          placeholder="Beskriv kort er idé, projekt eller utmaning. Ju tydligare, desto snabbare kan vi ge ett relevant svar."
          hint="Ni behöver inte ha allt klart — en riktning räcker."
          className={cn(state.errors?.message && "border-red-500 focus:ring-red-500")}
          aria-invalid={!!state.errors?.message}
        />
        <FieldError message={state.errors?.message} />
      </div>

      <SubmitButton />
    </form>
  );
}
