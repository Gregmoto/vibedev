"use client";

import { useActionState } from "react";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { Textarea } from "@/components/ui/textarea";
import { replyToTicketAction, type TicketFormState } from "@/lib/admin-ticket-actions";

type TicketReplyFormProps = {
  ticketId: string;
  customerEmail: string;
};

const initialState: TicketFormState = {};

export function TicketReplyForm({ ticketId, customerEmail }: TicketReplyFormProps) {
  const [state, formAction, isPending] = useActionState(replyToTicketAction, initialState);

  return (
    <form action={formAction} className="space-y-4" aria-busy={isPending}>
      <input type="hidden" name="ticketId" value={ticketId} />

      <Textarea
        name="bodyText"
        label="Svar till kunden"
        placeholder="Skriv ditt svar här…"
        // Nollställs efter lyckat svar så att texten inte ligger kvar och
        // riskerar att skickas en gång till.
        key={state.success ?? "draft"}
        required
      />

      <AdminFormFooter
        isPending={isPending}
        submitLabel="Skicka svar"
        pendingLabel="Skickar…"
        helperText={`Skickas till ${customerEmail} i samma mejltråd. Ärendet sätts till väntande.`}
        error={state.error}
        success={state.success}
      />
    </form>
  );
}
