/**
 * Adressering för ärendesystemet.
 *
 * Varje ärende får en egen svarsadress: `konto+nyckel@inbound.vibedev.se`.
 * Kundens svar landar då på en adress som pekar ut exakt ett ärende, i stället
 * för att vi ska behöva gissa oss till ärendet genom att tolka ämnesraden
 * ("Re: Re: SV: [#1042] ...") — den är trivial för kunden att skriva om.
 *
 * Resend tar emot all post till hela mottagardomänen, så vilken lokaldel som
 * helst fungerar utan att behöva registreras i förväg.
 */

/** Domänen som tar emot kundmejl. Verifierad i Resend (eu-west-1). */
export const INBOUND_DOMAIN = process.env.TICKET_INBOUND_DOMAIN?.trim() || "inbound.vibedev.se";

/* Utan i, l, o, 0 och 1 — nycklarna läses ibland högt eller skrivs av för hand. */
const KEY_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function randomKey(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let out = "";
  for (const byte of bytes) {
    out += KEY_ALPHABET[byte % KEY_ALPHABET.length];
  }
  return out;
}

/** Nyckeln i svarsadressen. Kort — den syns i mejlheaders och ska gå att läsa. */
export function generateReplyKey(): string {
  return randomKey(10);
}

/**
 * Nyckeln till kundportalen. Längre, eftersom den ensam ger åtkomst till hela
 * ärendet och därför måste stå emot gissningar.
 */
export function generatePublicToken(): string {
  return randomKey(32);
}

/**
 * Plockar ut adressen ur ett From/To-fält, som kan se ut som
 * `Anna Andersson <anna@example.com>` eller bara `anna@example.com`.
 */
export function extractEmailAddress(value: string): string | null {
  const angled = value.match(/<([^>]+)>/);
  const candidate = (angled?.[1] ?? value).trim().toLowerCase();

  return candidate.includes("@") && !/\s/.test(candidate) ? candidate : null;
}

/** Plockar ut visningsnamnet ur `Anna Andersson <anna@example.com>`. */
export function extractDisplayName(value: string): string | null {
  const match = value.match(/^\s*"?([^"<]+?)"?\s*</);
  const name = match?.[1]?.trim();

  return name ? name : null;
}

export function buildReplyAddress(accountSlug: string, replyKey: string): string {
  return `${accountSlug}+${replyKey}@${INBOUND_DOMAIN}`;
}

export type ParsedInboundAddress = {
  /** Lokaldelen före "+", motsvarar TicketAccount.slug */
  slug: string;
  /** Nyckeln efter "+", satt bara när mejlet är ett svar i en befintlig tråd */
  replyKey: string | null;
};

/**
 * Tolkar en mottagaradress. `support@...` är ett nytt ärende till kontot
 * "support"; `support+k3f9a2@...` är ett svar i ett befintligt ärende.
 */
export function parseInboundAddress(address: string): ParsedInboundAddress | null {
  const email = extractEmailAddress(address);
  if (!email) {
    return null;
  }

  const [localPart, domain] = email.split("@");
  if (!localPart || domain !== INBOUND_DOMAIN.toLowerCase()) {
    return null;
  }

  const plusIndex = localPart.indexOf("+");
  if (plusIndex === -1) {
    return { slug: localPart, replyKey: null };
  }

  const replyKey = localPart.slice(plusIndex + 1);

  return {
    slug: localPart.slice(0, plusIndex),
    replyKey: replyKey || null,
  };
}

/**
 * Väljer den mottagaradress som hör till oss. Ett mejl kan ha flera mottagare
 * (kunden svarar alla, någon står i kopia), så vi tar den första som pekar på
 * vår mottagardomän i stället för att blint lita på `to[0]`.
 *
 * `received_for` kommer från Received-headern och är mest tillförlitlig vid
 * vidarebefordran, där To fortfarande pekar på den ursprungliga adressen.
 */
export function pickOwnRecipient(candidates: string[]): ParsedInboundAddress | null {
  for (const candidate of candidates) {
    const parsed = parseInboundAddress(candidate);
    if (parsed) {
      return parsed;
    }
  }
  return null;
}
