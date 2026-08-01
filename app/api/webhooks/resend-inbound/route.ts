import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { ingestInboundEmail } from "@/lib/tickets/service";
import type { InboundWebhookEvent } from "@/lib/tickets/resend-inbound";

/**
 * Tar emot `email.received` från Resend och skapar ärenden.
 *
 * Endpointen är publik — vem som helst kan lägga en POST här. Därför verifieras
 * varje anrop mot signaturen (svix) innan innehållet får röra databasen. Utan
 * det kan vem som helst skapa ärenden i vårt namn och trigga utgående mejl.
 */

export const dynamic = "force-dynamic";

function getWebhookSecret(): string {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("RESEND_INBOUND_WEBHOOK_SECRET saknas — inkommande webhook kan inte verifieras.");
  }

  return secret;
}

export async function POST(request: Request) {
  const payload = await request.text();

  let event: InboundWebhookEvent;

  try {
    const headers = {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    };

    event = new Webhook(getWebhookSecret()).verify(payload, headers) as InboundWebhookEvent;
  } catch (err) {
    console.error("[tickets] Avvisade webhook med ogiltig signatur:", err);
    return NextResponse.json({ error: "Ogiltig signatur." }, { status: 401 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ignored: event.type });
  }

  try {
    const result = await ingestInboundEmail(event);

    if (result.status === "ignored") {
      console.warn(`[tickets] Ignorerade inkommande mejl: ${result.reason}`);
    }

    return NextResponse.json(result);
  } catch (err) {
    // 500 gör att Resend försöker igen — rätt vid tillfälliga fel, men det
    // betyder också att ett bestående fel ger upprepade försök. Därför loggas
    // hela felet så att orsaken går att se i Workers-loggen.
    console.error("[tickets] Kunde inte behandla inkommande mejl:", err);
    return NextResponse.json({ error: "Kunde inte behandla mejlet." }, { status: 500 });
  }
}
