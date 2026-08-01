import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TicketPortalForm } from "@/components/forms/ticket-portal-form";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { db } from "@/lib/db";
import { hasDatabase } from "@/lib/db";
import { getTicketCopy } from "@/lib/tickets/copy";
import { stripQuotedReply } from "@/lib/tickets/text";

export const dynamic = "force-dynamic";

/**
 * Kundens vy av sitt ärende. Länken innehåller hela behörigheten, så sidan får
 * aldrig indexeras eller följas av crawlers.
 */
export const metadata: Metadata = {
  title: "Ditt ärende",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_TONE = {
  OPEN: "brand",
  PENDING: "accent",
  CLOSED: "neutral",
} as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function TicketPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!hasDatabase()) {
    notFound();
  }

  const ticket = await db.ticket.findUnique({
    where: { publicToken: token },
    include: {
      account: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { attachments: true },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const copy = getTicketCopy(ticket.language);
  const dateFormatter = new Intl.DateTimeFormat(ticket.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Container>
      <div className="mx-auto max-w-3xl py-14">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {copy.portalTitle}
          </p>
          <h1 className="heading-lg text-3xl">
            #{ticket.number} · {ticket.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted">{copy.portalStatusLabel}:</span>
            <Badge tone={STATUS_TONE[ticket.status]}>{copy.portalStatus[ticket.status]}</Badge>
          </div>
        </header>

        {ticket.status === "CLOSED" ? (
          <p className="mt-6 rounded-2xl border border-line bg-panel px-5 py-4 text-sm text-muted">
            {copy.portalClosedNotice}
          </p>
        ) : null}

        <section className="mt-10 space-y-4">
          {ticket.messages.map((message) => {
            const fromUs = message.direction === "OUTBOUND";

            return (
              <article
                key={message.id}
                className={
                  fromUs
                    ? "rounded-2xl border border-brand/20 bg-brand/[0.04] p-6"
                    : "rounded-2xl border border-line bg-panel p-6"
                }
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-text">
                    {fromUs ? ticket.account.name : copy.portalYou}
                  </p>
                  <p className="text-xs text-muted">{dateFormatter.format(message.createdAt)}</p>
                </header>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-text">
                  {stripQuotedReply(message.bodyText)}
                </p>

                {message.attachments.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {message.attachments.map((attachment) => (
                      <li key={attachment.id}>
                        {attachment.storageKey ? (
                          <a
                            href={`/api/tickets/attachments/${attachment.id}?token=${ticket.publicToken}`}
                            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:text-text"
                          >
                            {attachment.filename}
                            <span className="text-[10px] uppercase tracking-[0.1em]">
                              {formatBytes(attachment.sizeBytes)}
                            </span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-muted">
                            {attachment.filename}
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

        <section className="mt-10 rounded-2xl border border-line bg-panel p-6">
          <TicketPortalForm token={ticket.publicToken} copy={copy} />
        </section>
      </div>
    </Container>
  );
}
