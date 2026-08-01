import { db, hasDatabase } from "@/lib/db";

/**
 * Läsfrågor för ärenden. Ligger skilt från service.ts, som drar in
 * Resend-klienten — adminpanelens layout ska inte behöva göra det bara för
 * att visa en siffra i menyn.
 */

/**
 * Antal olästa ärenden. Ett ärende är oläst tills handläggaren markerar det
 * som läst, och blir oläst igen så snart kunden skickar ett nytt meddelande.
 *
 * Siffran visas i adminmenyn på varje sida, så ett databasfel får inte fälla
 * hela adminpanelen — då är det bättre att inte visa någon siffra alls.
 */
export async function getUnreadTicketCount(): Promise<number> {
  if (!hasDatabase()) {
    return 0;
  }

  try {
    // Skräpärenden räknas aldrig — poängen med att markera skräp är just att
    // slippa se det, och en siffra som aldrig går ner blir snabbt meningslös.
    return await db.ticket.count({ where: { readAt: null, spamAt: null } });
  } catch (err) {
    console.error("[tickets] Kunde inte räkna olästa ärenden:", err);
    return 0;
  }
}

export type RelatedTicket = {
  id: string;
  number: number;
  subject: string;
  status: "OPEN" | "PENDING" | "CLOSED";
  lastMessageAt: Date;
  spamAt: Date | null;
};

/** True om adressen har minst ett ärende som markerats som skräppost. */
export async function isKnownSpamSender(customerEmail: string): Promise<boolean> {
  if (!hasDatabase()) {
    return false;
  }

  try {
    const hit = await db.ticket.findFirst({
      where: {
        customerEmail: { equals: customerEmail, mode: "insensitive" },
        spamAt: { not: null },
      },
      select: { id: true },
    });

    return hit !== null;
  } catch (err) {
    console.error("[tickets] Kunde inte kontrollera skräpavsändare:", err);
    return false;
  }
}

/**
 * Andra ärenden från samma kund. Matchar på e-postadressen, som är det enda
 * vi säkert vet om en kund — namnet kan skrivas olika i varje mejl.
 */
export async function getOtherTicketsForCustomer(
  customerEmail: string,
  excludeTicketId: string,
): Promise<RelatedTicket[]> {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await db.ticket.findMany({
      where: {
        customerEmail: { equals: customerEmail, mode: "insensitive" },
        NOT: { id: excludeTicketId },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 20,
      select: {
        id: true,
        number: true,
        subject: true,
        status: true,
        lastMessageAt: true,
        // Skräpärenden visas här ändå, men märkta: att kunden tidigare
        // klassats som skräp är relevant när man bedömer ett nytt ärende.
        spamAt: true,
      },
    });
  } catch (err) {
    console.error("[tickets] Kunde inte hämta kundens övriga ärenden:", err);
    return [];
  }
}

/** Antal ärenden per kundadress, för att kunna flagga återkommande kunder i listan. */
export async function countTicketsByCustomer(emails: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (!hasDatabase() || emails.length === 0) {
    return counts;
  }

  try {
    const rows = await db.ticket.groupBy({
      by: ["customerEmail"],
      where: { customerEmail: { in: emails } },
      _count: { _all: true },
    });

    for (const row of rows) {
      counts.set(row.customerEmail, row._count._all);
    }
  } catch (err) {
    console.error("[tickets] Kunde inte räkna ärenden per kund:", err);
  }

  return counts;
}
