"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type ResetPasswordState } from "@/lib/actions/password-reset-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ResetPasswordState = { done: false };

export function PasswordResetForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  if (state.done) {
    return (
      <div
        className="rounded-xl border border-green-500/30 bg-green-500/10 p-6"
        role="status"
      >
        <p className="font-semibold text-text">Lösenordet är uppdaterat</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Du kan nu logga in med ditt nya lösenord. Eventuella tidigare inloggningar har
          avslutats.
        </p>
        <Link
          href="/admin/login"
          className="mt-4 inline-block text-sm font-medium text-brand transition hover:text-text"
        >
          Till inloggning →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" aria-busy={isPending}>
      <input type="hidden" name="token" value={token} />

      <Input
        name="password"
        type="password"
        label="Nytt lösenord"
        placeholder="••••••••••"
        hint="Minst 10 tecken."
        autoComplete="new-password"
        required
      />

      <Input
        name="confirm"
        type="password"
        label="Upprepa lösenordet"
        placeholder="••••••••••"
        autoComplete="new-password"
        required
      />

      {state.error ? (
        <p className="text-sm text-warning" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sparar..." : "Spara nytt lösenord"}
      </Button>

      <Link
        href="/admin/losenord"
        className="block text-center text-sm text-muted transition hover:text-brand"
      >
        Begär en ny länk
      </Link>
    </form>
  );
}
