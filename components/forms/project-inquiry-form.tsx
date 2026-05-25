"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingForm, type BookingFormState } from "@/lib/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
        "Skicka projektförfrågan"
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
          Tack! Vi återkommer inom 24 timmar för att boka in ett samtal.
        </p>
      </div>
    </div>
  );
}

// ── Formuläret ────────────────────────────────────────────────────────────────
const initialState: BookingFormState = { success: false };

export function ProjectInquiryForm() {
  const [state, formAction] = useActionState(submitBookingForm, initialState);

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
            name="role"
            label="Roll"
            placeholder="Founder, produktägare, marknadschef..."
            className={cn(state.errors?.role && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.role}
          />
          <FieldError message={state.errors?.role} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Select
            name="projectType"
            label="Typ av projekt"
            defaultValue=""
            className={cn(state.errors?.projectType && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.projectType}
          >
            <option value="" disabled>
              Välj typ av projekt
            </option>
            <option value="Apputveckling">Apputveckling</option>
            <option value="Webbapputveckling">Webbapputveckling</option>
            <option value="AI-lösning">AI-lösning</option>
            <option value="MVP-utveckling">MVP-utveckling</option>
            <option value="Design / UX">Design / UX</option>
            <option value="Teknisk rådgivning">Teknisk rådgivning</option>
          </Select>
          <FieldError message={state.errors?.projectType} />
        </div>
        <div>
          <Select
            name="budget"
            label="Budget"
            defaultValue=""
            className={cn(state.errors?.budget && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.budget}
          >
            <option value="" disabled>
              Välj budgetnivå
            </option>
            <option value="Under 100 000 SEK">Under 100 000 SEK</option>
            <option value="100 000–250 000 SEK">100 000–250 000 SEK</option>
            <option value="250 000–500 000 SEK">250 000–500 000 SEK</option>
            <option value="500 000+ SEK">500 000+ SEK</option>
          </Select>
          <FieldError message={state.errors?.budget} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Select
            name="timeline"
            label="Tidslinje"
            defaultValue=""
            className={cn(state.errors?.timeline && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.timeline}
          >
            <option value="" disabled>
              När vill ni starta?
            </option>
            <option value="Så snart som möjligt">Så snart som möjligt</option>
            <option value="Inom 1 månad">Inom 1 månad</option>
            <option value="Inom 2–3 månader">Inom 2–3 månader</option>
            <option value="Vi planerar fortfarande">Vi planerar fortfarande</option>
          </Select>
          <FieldError message={state.errors?.timeline} />
        </div>
        <div>
          <Input
            name="goal"
            label="Primärt mål"
            placeholder="Lansera MVP, effektivisera internt, öka konvertering..."
            className={cn(state.errors?.goal && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.goal}
          />
          <FieldError message={state.errors?.goal} />
        </div>
      </div>

      <div>
        <Textarea
          name="project"
          label="Berätta om projektet"
          placeholder="Beskriv nuläge, målbild, viktigaste behov och vad som känns mest oklart just nu."
          hint="Det här hjälper oss att förbereda rätt frågor inför nästa steg."
          className={cn(state.errors?.project && "border-red-500 focus:ring-red-500")}
          aria-invalid={!!state.errors?.project}
        />
        <FieldError message={state.errors?.project} />
      </div>

      <SubmitButton />
    </form>
  );
}
