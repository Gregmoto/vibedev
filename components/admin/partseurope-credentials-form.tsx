"use client";

import { useActionState } from "react";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  savePartsEuropeCredentialsAction,
  type CredentialState,
} from "@/lib/admin-integration-actions";

type Props = {
  /** E-postadressen som är sparad. Lösenordet skickas aldrig hit. */
  savedUsername?: string;
  savedAt?: string;
};

const initialState: CredentialState = {};

export function PartsEuropeCredentialsForm({ savedUsername, savedAt }: Props) {
  const [state, formAction, isPending] = useActionState(
    savePartsEuropeCredentialsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" aria-busy={isPending}>
      <AdminFormSection
        title="Inloggning hos Parts Europe"
        description="Används av det dagliga jobbet för att hämta prisfilen. Lösenordet krypteras innan det sparas och visas aldrig igen."
        elevated
      >
        <Input
          name="username"
          type="email"
          label="E-post"
          placeholder="namn@foretag.se"
          defaultValue={savedUsername ?? ""}
          autoComplete="off"
          required
        />

        <Input
          name="password"
          type="password"
          label="Lösenord"
          placeholder={savedUsername ? "Lämna tomt för att behålla nuvarande" : "Lösenord"}
          autoComplete="new-password"
          hint={
            savedAt
              ? `Ett lösenord är sparat sedan ${savedAt}. Skriver du ett nytt ersätts det.`
              : "Sparas krypterat och kan inte läsas ut igen — bara ersättas."
          }
          required
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Sparar…" : "Spara uppgifter"}
          </Button>

          {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
        </div>
      </AdminFormSection>
    </form>
  );
}
