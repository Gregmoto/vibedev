"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyFromPortalAction, type PortalReplyState } from "@/lib/actions/ticket-portal-actions";

/**
 * Bara de färdiga strängarna skickas in — hela TicketCopy innehåller funktioner,
 * och funktioner kan inte serialiseras från en server- till en klientkomponent.
 */
type TicketPortalFormProps = {
  token: string;
  labels: {
    replyLabel: string;
    replyPlaceholder: string;
    attachmentsLabel: string;
    submit: string;
  };
};

const initialState: PortalReplyState = {};

export function TicketPortalForm({ token, labels }: TicketPortalFormProps) {
  const [state, formAction, isPending] = useActionState(replyFromPortalAction, initialState);

  return (
    <form action={formAction} className="space-y-4" aria-busy={isPending}>
      <input type="hidden" name="token" value={token} />

      <Textarea
        name="bodyText"
        label={labels.replyLabel}
        placeholder={labels.replyPlaceholder}
        // Tvingar fram ett tomt fält efter lyckat svar, så samma text inte
        // råkar skickas två gånger.
        key={state.success ?? "draft"}
        required
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-text">{labels.attachmentsLabel}</span>
        <input
          type="file"
          name="attachments"
          multiple
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-sm file:font-medium file:text-text"
        />
        <span className="block text-xs leading-6 text-muted">Högst 5 filer, tillsammans 10 MB.</span>
      </label>

      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}

      <Button type="submit" size="lg" disabled={isPending} aria-busy={isPending}>
        {isPending ? "…" : labels.submit}
      </Button>
    </form>
  );
}
