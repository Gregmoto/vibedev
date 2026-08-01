import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { TicketAccountForm } from "@/components/admin/ticket-account-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { deleteTicketAccountAction } from "@/lib/admin-ticket-actions";
import { db } from "@/lib/db";
import { INBOUND_DOMAIN } from "@/lib/tickets/addressing";

export const dynamic = "force-dynamic";

export default async function AdminTicketAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ redigera?: string }>;
}) {
  const { redigera } = await searchParams;

  if (!hasDatabaseUrl()) {
    return (
      <AdminShell title="Ärendekonton" description="Inkorgar med egen mejladress.">
        <p className="text-sm text-muted">Databasen är inte konfigurerad.</p>
      </AdminShell>
    );
  }

  const accounts = await db.ticketAccount.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tickets: true } } },
  });

  const editing = redigera ? accounts.find((account) => account.id === redigera) : undefined;

  return (
    <AdminShell
      title="Ärendekonton"
      description={`Varje konto är en egen inkorg. All post till ${INBOUND_DOMAIN} styrs hit utifrån adressens namn.`}
    >
      <AdminTable
        title="Konton"
        description="Adressen skapas av adressnamnet och kan inte krocka mellan konton."
        rows={accounts}
        rowKey={(row) => row.id}
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga konton ännu</p>
            <p className="mt-2 text-sm text-muted">
              Skapa ett konto nedan. Mejl till dess adress blir automatiskt ärenden.
            </p>
          </div>
        }
        columns={[
          {
            key: "name",
            header: "Konto",
            render: (row) => (
              <div className="space-y-1">
                <p className="font-medium text-text">{row.name}</p>
                <p className="text-xs text-muted">{row.inboundEmail}</p>
              </div>
            ),
          },
          {
            key: "replyFrom",
            header: "Svarar som",
            render: (row) => (
              <div className="space-y-1">
                <p className="text-sm text-text">{row.replyFromName}</p>
                <p className="text-xs text-muted">{row.replyFromEmail}</p>
              </div>
            ),
          },
          {
            key: "tickets",
            header: "Ärenden",
            render: (row) => <span className="text-sm text-muted">{row._count.tickets}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (row) =>
              row.isActive ? <Badge tone="success">Aktivt</Badge> : <Badge tone="neutral">Pausat</Badge>,
          },
          {
            key: "actions",
            header: "Åtgärder",
            render: (row) => (
              <div className="flex items-center gap-3">
                <a
                  href={`/admin/arenden/konton?redigera=${row.id}`}
                  className="text-sm text-muted transition hover:text-text"
                >
                  Redigera
                </a>
                <form action={deleteTicketAccountAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmSubmitButton
                    message={
                      row._count.tickets > 0
                        ? `Ta bort kontot "${row.name}"? Det raderar även ${row._count.tickets} ärenden med alla meddelanden och bilagor. Vill du bara sluta ta emot mejl — avmarkera "Aktivt" i stället.`
                        : `Ta bort kontot "${row.name}"? Adressen ${row.inboundEmail} slutar ta emot mejl.`
                    }
                  >
                    Ta bort
                  </ConfirmSubmitButton>
                </form>
              </div>
            ),
          },
        ]}
      />

      {accounts.length > 0 ? (
        <p className="text-sm text-warning">
          Att ta bort ett konto raderar även dess ärenden och bilagor. Vill du bara sluta ta emot
          mejl — avmarkera &quot;Aktivt&quot; i stället.
        </p>
      ) : null}

      <TicketAccountForm
        key={editing?.id ?? "nytt"}
        account={editing}
        inboundDomain={INBOUND_DOMAIN}
      />
    </AdminShell>
  );
}
