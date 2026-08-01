/**
 * Texthantering för inkommande mejl.
 *
 * Vi sparar alltid hela brödtexten i databasen — det citerade i ett svar kan
 * innehålla det enda stället där kunden faktiskt beskrev problemet. Men i
 * trådvyn visar vi bara den nya delen, annars växer varje svar med hela
 * historiken under sig.
 */

/** Rader som inleder den citerade delen av ett svar, på de språk vi möter. */
const QUOTE_MARKERS = [
  /^-{2,}\s*(original message|ursprungligt meddelande|oprindelig meddelelse|opprinnelig melding|ursprüngliche nachricht)\s*-{2,}/i,
  /^_{5,}$/,
  /^on .+ wrote:$/i,
  /^den .+ skrev .+:$/i,
  /^d(en)? .+ skrev:$/i,
  /^am .+ schrieb .+:$/i,
  /^le .+ a écrit ?:$/i,
  /^el .+ escribió ?:$/i,
  /^从.+发送:$/i,
  /^(från|from|fra|von|de|lähettäjä):\s*.+<.+@.+>/i,
  /^skickat från min (iphone|ipad|android)/i,
  /^sent from my (iphone|ipad|android)/i,
];

/**
 * Klipper bort den citerade delen av ett svar. Medvetet försiktig: hittar vi
 * ingen tydlig markör returnerar vi texten oförändrad, hellre än att gissa och
 * råka klippa bort kundens egna ord.
 */
export function stripQuotedReply(text: string): string {
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (QUOTE_MARKERS.some((marker) => marker.test(line))) {
      const kept = lines.slice(0, i).join("\n").trimEnd();
      // Är allt före markören tomt är markören inte en citatgräns utan
      // början på mejlet — då är det säkrare att behålla allt.
      return kept.trim() ? kept : text.trim();
    }
  }

  // Ett block av ">"-citat sist i mejlet är också en tydlig gräns.
  let cut = lines.length;
  while (cut > 0) {
    const line = lines[cut - 1].trim();
    if (line === "" || line.startsWith(">")) {
      cut--;
    } else {
      break;
    }
  }

  const trimmed = lines.slice(0, cut).join("\n").trim();
  return trimmed || text.trim();
}

/** Kortar ner en text till en förhandsvisning för ärendelistan. */
export function toPreview(text: string, maxLength = 140): string {
  const flat = stripQuotedReply(text).replace(/\s+/g, " ").trim();
  return flat.length > maxLength ? `${flat.slice(0, maxLength - 1)}…` : flat;
}

/** Ämnesrad utan alla ackumulerade Re:/SV:/Aw:-prefix. */
export function normalizeSubject(subject: string): string {
  const cleaned = subject
    .replace(/^(\s*(re|sv|aw|vs|fwd?|vb|antw)\s*(\[\d+\])?\s*:\s*)+/i, "")
    .replace(/^\s*\[#\d+\]\s*/, "")
    .trim();

  return cleaned || "(utan ämne)";
}
