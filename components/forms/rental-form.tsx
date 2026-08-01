"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitRentalForm, type RentalFormState } from "@/lib/actions/rental-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
        "Skicka offertförfrågan →"
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500" role="alert">
      {message}
    </p>
  );
}

function SuccessCard() {
  return (
    <div
      className="flex flex-col items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-6"
      role="status"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
        <svg
          className="h-5 w-5 text-green-600"
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
        <p className="font-semibold text-text">Tack! Vi har tagit emot din förfrågan.</p>
        <p className="mt-1 text-sm text-muted">
          Vi räknar fram din månadskostnad utifrån omfattningen och återkommer med en offert
          inom 24 timmar.
        </p>
      </div>
    </div>
  );
}

const initialState: RentalFormState = { success: false };

export function RentalForm() {
  const [state, formAction] = useActionState(submitRentalForm, initialState);

  if (state.success) {
    return <SuccessCard />;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — dolt för människor, lockar botar */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="companyWebsite">Lämna detta fält tomt</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.message && !state.success && (
        <div
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
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
            autoComplete="name"
            required
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
            autoComplete="organization"
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
            autoComplete="email"
            required
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
            autoComplete="tel"
            className={cn(state.errors?.phone && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.phone}
          />
          <FieldError message={state.errors?.phone} />
        </div>
      </div>

      <div>
        <Select
          name="projectType"
          label="Typ av projekt"
          defaultValue=""
          required
          className={cn(state.errors?.projectType && "border-red-500 focus:ring-red-500")}
          aria-invalid={!!state.errors?.projectType}
        >
          <option value="" disabled>
            Välj typ
          </option>
          <option value="Hemsida">Hemsida</option>
          <option value="Webbshop">Webbshop</option>
          <option value="System">System</option>
          <option value="Vet ej">Vet ej</option>
        </Select>
        <FieldError message={state.errors?.projectType} />
      </div>

      <div>
        <Textarea
          name="project"
          label="Kort beskrivning av projektet"
          placeholder="Vad gör din verksamhet och vad ska lösningen göra för dig?"
          required
          className={cn(state.errors?.project && "border-red-500 focus:ring-red-500")}
          aria-invalid={!!state.errors?.project}
        />
        <FieldError message={state.errors?.project} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input
            name="startDate"
            label="Önskad start"
            hint="Valfritt — t.ex. “så snart som möjligt” eller en månad."
            placeholder="Så snart som möjligt"
            className={cn(state.errors?.startDate && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.startDate}
          />
          <FieldError message={state.errors?.startDate} />
        </div>
        <div>
          <Input
            name="budget"
            label="Budgetkänsla"
            hint="Valfritt — en riktning räcker."
            placeholder="Vet ej ännu"
            className={cn(state.errors?.budget && "border-red-500 focus:ring-red-500")}
            aria-invalid={!!state.errors?.budget}
          />
          <FieldError message={state.errors?.budget} />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
