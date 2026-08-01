import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { countTicketsByCustomer } from "@/lib/tickets/queries";
import { toPreview } from "@/lib/tickets/text";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  OPEN: "Öppet",
  PENDING: "Väntar på kund",
  CLOSED: "Avslutat",
} as const;

const STATUS_TONE = {
  OPEN: "brand",
  PENDING: "accent",
  CLOSED: "neutral",
} as const;

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

type SearchParams = { status?: string; konto?: string; kund?: string };

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, konto, kund } = await searchParams;

  if (!hasDatabaseUrl()) {
    return (
      <AdminShell title="Ärenden" description="Inkommande kundmejl samlade som ärenden.">
        <p className="text-sm text-muted">Databasen är inte konfigurerad.</p>
      </AdminShell>
    );
  }

  const statusFilter =
    status && ["OPEN", "PENDING", "CLOSED"].includes(status)
      ? (status as "OPEN" | "PENDING" | "CLOSED")
      : undefined;

  const [tickets, accounts] = await Promise.all([
    db.ticket.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(konto ? { account: { slug: konto } } : {}),
        ...(kund ? { customerEmail: { equals: kund, mode: "insensitive" as const } } : {}),
      },
      orderBy: { lastMessageAt: "desc" },
      take: 200,
      include: {
        account: { select: { name: true, slug: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { bodyText: true, direction: true },
        },
      },
    }),
    db.ticketAccount.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Antal ärenden per kundadress, så återkommande kunder syns direkt i listan
  // i stället för att man måste öppna varje ärende för att upptäcka det.
  const ticketsPerCustomer = await countTicketsByCustomer(
    [...new Set(tickets.map((ticket) => ticket.customerEmail))],
  );

  const filters = [
    { label: "Alla", href: "/admin/arenden", active: !statusFilter && !kund },
    { label: "Öppna", href: "/admin/arenden?status=OPEN", active: statusFilter === "OPEN" },
    { label: "Väntar på kund", href: "/admin/arenden?status=PENDING", active: statusFilter === "PENDING" },
    { label: "Avslutade", href: "/admin/arenden?status=CLOSED", active: statusFilter === "CLOSED" },
  ];

  return (
    <AdminShell
      title="Ärenden"
      description="Inkommande kundmejl samlade som ärenden, med svar i samma tråd."
    >
      {kund ? (
        <div className="surface flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="text-sm text-text">
            Visar bara ärenden från <span className="font-medium">{kund}</span>
          </p>
          <Link href="/admin/arenden" className="text-sm text-brand transition hover:underline">
            Rensa filtret
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className={
              filter.active
                ? "rounded-full bg-white/[0.08] px-4 py-2 text-sm font-medium text-text"
                : "rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted transition hover:text-text"
            }
          >
            {filter.label}
          </Link>
        ))}

        {accounts.length > 1
          ? accounts.map((account) => (
              <Link
                key={account.id}
                href={`/admin/arenden?konto=${account.slug}`}
                className={
                  konto === account.slug
                    ? "rounded-full bg-white/[0.08] px-4 py-2 text-sm font-medium text-text"
                    : "rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted transition hover:text-text"
                }
              >
                {account.name}
              </Link>
            ))
          : null}
      </div>

      <AdminTable
        title="Alla ärenden"
        description="Sorterade efter senaste meddelande."
        rows={tickets}
        rowKey={(row) => row.id}
        actions={
          <LinkButton href="/admin/arenden/konton" size="sm">
            Konton
          </LinkButton>
        }
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga ärenden ännu</p>
            <p className="mt-2 text-sm text-muted">
              {accounts.length === 0
                ? "Skapa först ett konto — det är kontots adress som kunder mejlar."
                : "Ärenden skapas automatiskt när någon mejlar en av kontoadresserna."}
            </p>
            <div className="mt-5">
              <LinkButton href="/admin/arenden/konton" size="sm">
                {accounts.length === 0 ? "Skapa första kontot" : "Visa konton"}
              </LinkButton>
            </div>
          </div>
        }
        columns={[
          {
            key: "subject",
            header: "Ärende",
            render: (row) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* Olästa ärenden ska gå att hitta med ögat, inte bara via siffran i menyn. */}
                  {row.readAt ? null : (
                    <span
                      aria-label="Oläst"
                      title="Oläst"
                      className="h-2 w-2 shrink-0 rounded-full bg-brand"
                    />
                  )}
                  <Link
                    href={`/admin/arenden/${row.id}`}
                    className={
                      row.readAt
                        ? "font-medium text-text transition hover:text-brand"
                        : "font-bold text-text transition hover:text-brand"
                    }
                  >
                    #{row.number} · {row.subject}
                  </Link>
                </div>
                <p className="max-w-md text-xs text-muted">
                  {row.messages[0] ? toPreview(row.messages[0].bodyText) : "—"}
                </p>
              </div>
            ),
          },
          {
            key: "customer",
            header: "Kund",
            render: (row) => {
              const total = ticketsPerCustomer.get(row.customerEmail) ?? 1;

              return (
                <div className="space-y-1">
                  <p className="text-sm text-text">{row.customerName || row.customerEmail}</p>
                  {row.customerName ? (
                    <p className="text-xs text-muted">{row.customerEmail}</p>
                  ) : null}
                  {total > 1 ? (
                    <Link
                      href={`/admin/arenden?kund=${encodeURIComponent(row.customerEmail)}`}
                      className="inline-block text-xs text-brand transition hover:underline"
                    >
                      {total} ärenden från denna kund
                    </Link>
                  ) : null}
                </div>
              );
            },
          },
          {
            key: "account",
            header: "Konto",
            render: (row) => <span className="text-sm text-muted">{row.account.name}</span>,
          },
          {
            key: "language",
            header: "Språk",
            render: (row) => (
              <span className="text-xs uppercase tracking-[0.14em] text-muted">{row.language}</span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
          },
          {
            key: "lastMessageAt",
            header: "Senaste",
            render: (row) => (
              <span className="text-sm text-muted">{formatDate(row.lastMessageAt)}</span>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
