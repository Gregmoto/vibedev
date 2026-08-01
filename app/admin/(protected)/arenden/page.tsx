import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import {
  deleteTicketAction,
  markTicketNotSpamAction,
  markTicketSpamAction,
} from "@/lib/admin-ticket-actions";
import { db } from "@/lib/db";
import { countTicketsByCustomer } from "@/lib/tickets/queries";
import { toPreview } from "@/lib/tickets/text";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  OPEN: "Öppet",
  PENDING: "Väntar på kund",
  CLOSED: "Avslutat",
} as const;

/* Kort form i tabellen. "Väntar på kund" radbryter i badgen och gör
   statuskolumnen bredare än vad tabellen har utrymme för. */
const STATUS_LABEL_SHORT = {
  OPEN: "Öppet",
  PENDING: "Väntar",
  CLOSED: "Avslutat",
} as const;

const STATUS_TONE = {
  OPEN: "brand",
  PENDING: "accent",
  CLOSED: "neutral",
} as const;

/* Kompakt datum ("1 aug 20:13"). Full ISO-form tog en oproportionerlig del av
   tabellbredden; året är sällan det man behöver i en lista sorterad på tid. */
function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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

  // Skräppost är en egen vy, inte ett status. I alla andra vyer hålls den
  // utanför — det är hela poängen med att markera något som skräp.
  const showSpam = status === "SPAM";

  const statusFilter =
    status && ["OPEN", "PENDING", "CLOSED"].includes(status)
      ? (status as "OPEN" | "PENDING" | "CLOSED")
      : undefined;

  const [tickets, accounts] = await Promise.all([
    db.ticket.findMany({
      where: {
        spamAt: showSpam ? { not: null } : null,
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

  const spamCount = await db.ticket.count({ where: { spamAt: { not: null } } });

  // Antal ärenden per kundadress, så återkommande kunder syns direkt i listan
  // i stället för att man måste öppna varje ärende för att upptäcka det.
  const ticketsPerCustomer = await countTicketsByCustomer(
    [...new Set(tickets.map((ticket) => ticket.customerEmail))],
  );

  const filters = [
    { label: "Alla", href: "/admin/arenden", active: !statusFilter && !kund && !showSpam },
    { label: "Öppna", href: "/admin/arenden?status=OPEN", active: statusFilter === "OPEN" },
    { label: "Väntar på kund", href: "/admin/arenden?status=PENDING", active: statusFilter === "PENDING" },
    { label: "Avslutade", href: "/admin/arenden?status=CLOSED", active: statusFilter === "CLOSED" },
    {
      label: spamCount > 0 ? `Skräppost (${spamCount})` : "Skräppost",
      href: "/admin/arenden?status=SPAM",
      active: showSpam,
    },
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
        title={showSpam ? "Skräppost" : "Alla ärenden"}
        description={
          showSpam
            ? "Ärenden du markerat som skräp. De syns inte i de andra vyerna och räknas inte som olästa. Nya mejl från samma avsändare hamnar direkt här, utan autosvar."
            : "Sorterade efter senaste meddelande. Skräppost visas i egen flik."
        }
        rows={tickets}
        rowKey={(row) => row.id}
        dense
        actions={
          <LinkButton href="/admin/arenden/konton" size="sm">
            Konton
          </LinkButton>
        }
        emptyState={
          showSpam ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
              <p className="text-base font-medium text-text">Ingen skräppost</p>
              <p className="mt-2 text-sm text-muted">
                Markera ett ärende som skräp så hamnar det här — och nya mejl från samma avsändare
                med det.
              </p>
            </div>
          ) : (
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
          )
        }
        columns={[
          {
            key: "subject",
            header: "Ärende",
            className: "w-[36%]",
            // Texterna tillåts aldrig radbryta: en förhandsvisning som viker sig
            // i en smal kolumn gör raderna orimligt höga och tvingar fram
            // vågrät scroll i hela tabellen.
            render: (row) => (
              <div className="max-w-full space-y-0.5">
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
                    title={row.subject}
                    // min-w-0 krävs för att en flex-post ska få krympa under
                    // sin innehållsbredd — utan den gör truncate ingenting.
                    className={
                      row.readAt
                        ? "min-w-0 truncate font-medium text-text transition hover:text-brand"
                        : "min-w-0 truncate font-bold text-text transition hover:text-brand"
                    }
                  >
                    #{row.number} · {row.subject}
                  </Link>
                </div>
                <p className="truncate text-xs text-muted">
                  {row.messages[0] ? toPreview(row.messages[0].bodyText, 80) : "—"}
                </p>
                {/* Kontot hade tidigare en egen kolumn. Som liten rad här ryms
                    tabellen inom adminytan utan vågrät scroll. */}
                <p className="truncate text-xs text-muted/70">
                  {row.account.name} · {row.language.toUpperCase()}
                </p>
              </div>
            ),
          },
          {
            key: "customer",
            header: "Kund",
            className: "w-[24%]",
            render: (row) => {
              const total = ticketsPerCustomer.get(row.customerEmail) ?? 1;

              return (
                <div className="max-w-full space-y-0.5">
                  <p className="truncate text-sm text-text" title={row.customerEmail}>
                    {row.customerName || row.customerEmail}
                  </p>
                  {row.customerName ? (
                    <p className="truncate text-xs text-muted">{row.customerEmail}</p>
                  ) : null}
                  {total > 1 ? (
                    <Link
                      href={`/admin/arenden?kund=${encodeURIComponent(row.customerEmail)}`}
                      className="block truncate text-xs text-brand transition hover:underline"
                    >
                      {total} ärenden från kunden
                    </Link>
                  ) : null}
                </div>
              );
            },
          },
          {
            key: "status",
            header: "Status",
            className: "w-[13%]",
            render: (row) => (
              <Badge tone={STATUS_TONE[row.status]} className="whitespace-nowrap">
                {STATUS_LABEL_SHORT[row.status]}
              </Badge>
            ),
          },
          {
            key: "lastMessageAt",
            header: "Senaste",
            className: "w-[12%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {formatDate(row.lastMessageAt)}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-[15%]",
            // Textlänkar i stället för knappar: två knappar bredvid varandra
            // sköt ut kolumnen utanför adminytan.
            render: (row) => (
              <div className="flex items-center justify-end gap-3">
                <form action={showSpam ? markTicketNotSpamAction : markTicketSpamAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="whitespace-nowrap text-sm text-muted transition hover:text-text"
                  >
                    {showSpam ? "Inte skräp" : "Skräp"}
                  </button>
                </form>

                <form action={deleteTicketAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmSubmitButton
                    plain
                    message={`Ta bort ärende #${row.number} permanent? Hela tråden och alla bilagor försvinner, och kundens länk slutar fungera.`}
                  >
                    Ta bort
                  </ConfirmSubmitButton>
                </form>
              </div>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
