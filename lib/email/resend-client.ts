import { Resend } from "resend";

/**
 * Resend-klient som skapas vid anrop, inte vid modulladdning.
 *
 * På Cloudflare Workers är process.env tom när modulen laddas — secrets
 * injiceras först i request-contexten. En klient som konstrueras på modulnivå
 * får därför en tom API-nyckel, och varje utskick misslyckas.
 */
function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY saknas i miljön — e-postutskick kan inte genomföras.");
  }

  return new Resend(apiKey);
}

type SendPayload = Parameters<Resend["emails"]["send"]>[0];

/**
 * Skickar ett mejl och kastar vid fel.
 *
 * Resends SDK returnerar `{ data, error }` i stället för att kasta, så ett
 * misslyckat utskick ser ut som ett lyckat om man bara await:ar anropet.
 * Den här wrappern gör felet synligt för anropande kod.
 */
export async function sendEmail(payload: SendPayload): Promise<{ id: string }> {
  const { data, error } = await getResend().emails.send(payload);

  if (error) {
    throw new Error(`Resend avvisade utskicket: ${error.name} — ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("Resend returnerade inget id för utskicket.");
  }

  return { id: data.id };
}

/**
 * Bakåtkompatibel yta så att befintliga anrop (`resend.emails.send(...)`)
 * fungerar oförändrat — men nu med lat initiering och felkontroll.
 */
export const resend = {
  emails: {
    send: sendEmail,
  },
};
