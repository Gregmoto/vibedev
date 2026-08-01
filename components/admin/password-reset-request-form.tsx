"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  type ResetRequestState,
} from "@/lib/actions/password-reset-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ResetRequestState = { done: false };

export function PasswordResetRequestForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  if (state.done) {
    return (
      <div
        className="rounded-xl border border-green-500/30 bg-green-500/10 p-6"
        role="status"
      >
        <p className="font-semibold text-text">Kolla din inkorg</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Finns det ett konto med den adressen har vi skickat en återställningslänk. Länken
          gäller i 60 minuter.
        </p>
        <Link
          href="/admin/login"
          className="mt-4 inline-block text-sm font-medium text-brand transition hover:text-text"
        >
          ← Tillbaka till inloggning
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" aria-busy={isPending}>
      <Input
        name="email"
        type="email"
        label="E-post"
        placeholder="din@adress.se"
        autoComplete="email"
        required
      />

      {state.error ? (
        <p className="text-sm text-warning" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Skickar..." : "Skicka återställningslänk"}
      </Button>

      <Link
        href="/admin/login"
        className="block text-center text-sm text-muted transition hover:text-brand"
      >
        ← Tillbaka till inloggning
      </Link>
    </form>
  );
}
