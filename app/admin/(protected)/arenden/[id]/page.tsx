import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { TicketAutoReplyRetry } from "@/components/admin/ticket-auto-reply-retry";
import { TicketReplyForm } from "@/components/admin/ticket-reply-form";
import { MessageBody } from "@/components/tickets/message-body";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import {
  deleteTicketAction,
  markTicketNotSpamAction,
  markTicketReadAction,
  markTicketSpamAction,
  markTicketUnreadAction,
  updateTicketStatusAction,
} from "@/lib/admin-ticket-actions";
import { db } from "@/lib/db";
import { buildReplyAddress } from "@/lib/tickets/addressing";
import { getOtherTicketsForCustomer } from "@/lib/tickets/queries";
import { buildPortalUrl } from "@/lib/tickets/service";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { stripQuotedReply } from "@/lib/tickets/text";

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

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabaseUrl()) {
    notFound();
  }

  const ticket = await db.ticket.findUnique({
    where: { id },
    include: {
      account: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { attachments: true },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const [{ siteUrl }, otherTickets] = await Promise.all([
    getResolvedSiteSettings(),
    getOtherTicketsForCustomer(ticket.customerEmail, ticket.id),
  ]);
  const portalUrl = buildPortalUrl(siteUrl.replace(/\/$/, ""), ticket.publicToken);

  return (
    <AdminShell
      title={`#${ticket.number} · ${ticket.subject}`}
      description={`Från ${ticket.customerName || ticket.customerEmail} · ${ticket.account.name}`}
    >
      <Link href="/admin/arenden" className="text-sm text-muted transition hover:text-text">
        ← Alla ärenden
      </Link>

      <section className="surface-elevated p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={STATUS_TONE[ticket.status]}>{STATUS_LABEL[ticket.status]}</Badge>
            {ticket.spamAt ? <Badge tone="neutral">Skräppost</Badge> : null}
            {ticket.readAt || ticket.spamAt ? null : <Badge tone="accent">Oläst</Badge>}
            <span className="text-xs uppercase tracking-[0.14em] text-muted">
              Språk: {ticket.language}
            </span>
            <span className="text-xs text-muted">Skapat {formatDateTime(ticket.createdAt)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form action={ticket.readAt ? markTicketUnreadAction : markTicketReadAction}>
              <input type="hidden" name="id" value={ticket.id} />
              <Button type="submit" variant="secondary" size="sm">
                {ticket.readAt ? "Markera som oläst" : "Markera som läst"}
              </Button>
            </form>

            <form action={ticket.spamAt ? markTicketNotSpamAction : markTicketSpamAction}>
              <input type="hidden" name="id" value={ticket.id} />
              <Button type="submit" variant="secondary" size="sm">
                {ticket.spamAt ? "Inte skräppost" : "Markera som skräp"}
              </Button>
            </form>

            {(["OPEN", "PENDING", "CLOSED"] as const)
              .filter((status) => status !== ticket.status)
              .map((status) => (
                <form key={status} action={updateTicketStatusAction}>
                  <input type="hidden" name="id" value={ticket.id} />
                  <input type="hidden" name="status" value={status} />
                  <Button type="submit" variant="secondary" size="sm">
                    {STATUS_LABEL[status]}
                  </Button>
                </form>
              ))}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Kundens adress</dt>
            <dd className="mt-1 text-text">{ticket.customerEmail}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Svarsadress för tråden</dt>
            <dd className="mt-1 break-all text-text">
              {buildReplyAddress(ticket.account.slug, ticket.replyKey)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Kundens länk</dt>
            <dd className="mt-1">
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-brand transition hover:underline"
              >
                {portalUrl}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      {ticket.spamAt ? (
        <section className="surface border-l-2 border-white/20 p-6">
          <h2 className="text-sm font-semibold text-text">Markerat som skräppost</h2>
          <p className="mt-2 text-sm text-muted">
            Ärendet ligger i skräpfliken och räknas inte som oläst. Nya mejl från{" "}
            {ticket.customerEmail} hamnar direkt i skräp utan autosvar. Tryck &quot;Inte
            skräppost&quot; ovan för att ta tillbaka det.
          </p>
        </section>
      ) : null}

      {ticket.autoReplyError ? (
        <TicketAutoReplyRetry ticketId={ticket.id} errorMessage={ticket.autoReplyError} />
      ) : null}

      {otherTickets.length > 0 ? (
        <section className="surface p-6">
          <h2 className="text-sm font-semibold text-text">
            {otherTickets.length === 1
              ? "1 tidigare ärende från samma kund"
              : `${otherTickets.length} andra ärenden från samma kund`}
          </h2>
          <p className="mt-1 text-xs text-muted">Matchat på {ticket.customerEmail}</p>

          <ul className="mt-4 divide-y divide-white/5">
            {otherTickets.map((other) => (
              <li key={other.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <Link
                  href={`/admin/arenden/${other.id}`}
                  className="text-sm text-text transition hover:text-brand"
                >
                  #{other.number} · {other.subject}
                </Link>
                <div className="flex items-center gap-3">
                  {other.spamAt ? (
                    <Badge tone="neutral">Skräp</Badge>
                  ) : (
                    <Badge tone={STATUS_TONE[other.status]}>{STATUS_LABEL[other.status]}</Badge>
                  )}
                  <span className="text-xs text-muted">{formatDateTime(other.lastMessageAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        {ticket.messages.map((message) => {
          const outbound = message.direction === "OUTBOUND";

          return (
            <article
              key={message.id}
              className={
                outbound
                  ? "surface border-l-2 border-brand/40 p-6"
                  : "surface-elevated border-l-2 border-white/10 p-6"
              }
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-text">
                  {outbound ? "Vi" : message.fromName || message.fromEmail}
                  <span className="ml-2 text-xs font-normal text-muted">{message.fromEmail}</span>
                </p>
                <p className="text-xs text-muted">{formatDateTime(message.createdAt)}</p>
              </header>

              <MessageBody
                text={stripQuotedReply(message.bodyText)}
                fadeClassName={outbound ? "from-panel" : "from-panelElevated"}
              />

              {message.attachments.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {message.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      {attachment.storageKey ? (
                        <a
                          href={`/api/tickets/attachments/${attachment.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition hover:text-text"
                        >
                          {attachment.filename}
                          <span className="text-[10px] uppercase tracking-[0.1em]">
                            {formatBytes(attachment.sizeBytes)}
                          </span>
                        </a>
                      ) : (
                        <span
                          className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/10 px-3 py-1.5 text-xs text-muted"
                          title="Filen kunde inte sparas i lagringen"
                        >
                          {attachment.filename} (ej sparad)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="surface-elevated p-6">
        <h2 className="heading-md text-2xl">Svara</h2>
        <div className="mt-6">
          <TicketReplyForm ticketId={ticket.id} customerEmail={ticket.customerEmail} />
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="text-sm font-semibold text-text">Ta bort ärendet</h2>
        <p className="mt-2 text-sm text-muted">
          Raderar hela tråden och dess bilagor permanent. Kundens länk slutar fungera.
        </p>
        <form action={deleteTicketAction} className="mt-4">
          <input type="hidden" name="id" value={ticket.id} />
          <ConfirmSubmitButton
            message={`Ta bort ärende #${ticket.number} permanent? Hela tråden och alla bilagor försvinner, och kundens länk slutar fungera.`}
          >
            Ta bort ärendet
          </ConfirmSubmitButton>
        </form>
      </section>
    </AdminShell>
  );
}
