"use client";

import { useActionState, useState } from "react";
import type { TicketAccount } from "@prisma/client";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveTicketAccountAction, type TicketFormState } from "@/lib/admin-ticket-actions";

type TicketAccountFormProps = {
  account?: TicketAccount;
  inboundDomain: string;
};

const initialState: TicketFormState = {};

export function TicketAccountForm({ account, inboundDomain }: TicketAccountFormProps) {
  const [state, formAction, isPending] = useActionState(saveTicketAccountAction, initialState);
  // Adressen visas medan man skriver — annars är det inte uppenbart att
  // adressnamnet är det som blir kundens mejladress.
  const [slug, setSlug] = useState(account?.slug ?? "");

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      {account ? <input type="hidden" name="id" value={account.id} /> : null}

      <AdminFormSection
        title={account ? "Redigera konto" : "Nytt konto"}
        description="Varje konto är en egen inkorg med egen mejladress."
        elevated
      >
        <Input
          name="name"
          label="Namn"
          placeholder="Support"
          defaultValue={account?.name ?? ""}
          required
        />

        <Input
          name="slug"
          label="Adressnamn"
          placeholder="support"
          value={slug}
          onChange={(event) => setSlug(event.target.value.toLowerCase())}
          hint={
            slug
              ? `Kunder mejlar ${slug}@${inboundDomain}`
              : `Blir adressen kunder mejlar, t.ex. support@${inboundDomain}`
          }
          required
        />

        <Input
          name="replyFromName"
          label="Avsändarnamn"
          placeholder="VibeDev Support"
          defaultValue={account?.replyFromName ?? ""}
          required
        />

        <Input
          name="replyFromEmail"
          label="Avsändaradress"
          type="email"
          placeholder="support@sending.vibedev.se"
          defaultValue={account?.replyFromEmail ?? ""}
          hint="Måste ligga på en domän som är verifierad för utskick i Resend."
          required
        />

        <Textarea
          name="signature"
          label="Signatur"
          placeholder={"Erik Holm\nVibeDev"}
          defaultValue={account?.signature ?? ""}
          hint="Läggs sist i autosvar och svar. Lämnas den tom används kontonamnet."
        />

        <label className="flex items-center gap-3 text-sm text-text">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={account?.isActive ?? true}
            className="h-4 w-4 rounded border-white/20 bg-transparent"
          />
          Aktivt — tar emot mejl
        </label>
      </AdminFormSection>

      <AdminFormFooter
        isPending={isPending}
        submitLabel={account ? "Spara kontot" : "Skapa kontot"}
        pendingLabel="Sparar…"
        helperText="Inaktiva konton tar inte emot nya mejl. Befintliga ärenden ligger kvar."
        error={state.error}
        success={state.success}
      />
    </form>
  );
}
