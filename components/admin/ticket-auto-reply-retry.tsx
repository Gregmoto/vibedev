"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { retryAutoReplyAction, type TicketFormState } from "@/lib/admin-ticket-actions";

type TicketAutoReplyRetryProps = {
  ticketId: string;
  errorMessage: string;
};

const initialState: TicketFormState = {};

/**
 * Visas när autosvaret till kunden misslyckades. Felet från Resend skrivs ut
 * ordagrant — det är oftast det som säger exakt vad som behöver rättas, till
 * exempel att avsändardomänen inte är verifierad.
 */
export function TicketAutoReplyRetry({ ticketId, errorMessage }: TicketAutoReplyRetryProps) {
  const [state, formAction, isPending] = useActionState(retryAutoReplyAction, initialState);

  if (state.success) {
    return (
      <section className="surface border-l-2 border-success/50 p-6">
        <p className="text-sm text-success">{state.success}</p>
      </section>
    );
  }

  return (
    <section className="surface border-l-2 border-warning/60 p-6">
      <h2 className="text-sm font-semibold text-text">Kunden fick inget autosvar</h2>
      <p className="mt-2 text-sm text-muted">
        Ärendet registrerades, men kvittensmejlet kunde inte skickas. Resend svarade:
      </p>
      <p className="mt-3 rounded-xl bg-white/[0.03] px-4 py-3 text-xs leading-6 text-warning">
        {errorMessage}
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3" aria-busy={isPending}>
        <input type="hidden" name="id" value={ticketId} />
        <div>
          <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
            {isPending ? "Skickar…" : "Försök skicka autosvaret igen"}
          </Button>
        </div>
        {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      </form>
    </section>
  );
}
