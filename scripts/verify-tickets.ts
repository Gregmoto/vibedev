import { parseInboundAddress, buildReplyAddress, pickOwnRecipient, extractEmailAddress, extractDisplayName } from "../lib/tickets/addressing";
import { detectLanguage } from "../lib/tickets/language";
import { stripQuotedReply, normalizeSubject } from "../lib/tickets/text";

let fail = 0;
const eq = (got: unknown, want: unknown, name: string) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fail++; console.log(`FAIL ${name}\n  fick:  ${JSON.stringify(got)}\n  ville: ${JSON.stringify(want)}`); }
  else console.log(`ok   ${name}`);
};

eq(parseInboundAddress("support@inbound.vibedev.se"), {slug:"support",replyKey:null}, "nytt ärende");
eq(parseInboundAddress("Support <support+k3f9a2@inbound.vibedev.se>"), {slug:"support",replyKey:"k3f9a2"}, "svar i tråd");
eq(parseInboundAddress("nagon@example.com"), null, "främmande domän avvisas");
eq(parseInboundAddress("SUPPORT+ABC@INBOUND.VIBEDEV.SE"), {slug:"support",replyKey:"abc"}, "versaler");
eq(buildReplyAddress("support","k3f9a2"), "support+k3f9a2@inbound.vibedev.se", "bygger svarsadress");
eq(pickOwnRecipient(["chef@kund.se","support+xy@inbound.vibedev.se"]), {slug:"support",replyKey:"xy"}, "väljer vår mottagare bland flera");
eq(extractEmailAddress("Anna Andersson <Anna@Example.com>"), "anna@example.com", "adress ur From");
eq(extractDisplayName("\"Anna Andersson\" <anna@example.com>"), "Anna Andersson", "namn ur From");

eq(detectLanguage("Hej! Jag undrar om ni kan hjälpa mig med en ny hemsida till mitt företag, det är ganska bråttom och jag vill gärna veta vad det kostar").language, "sv", "svenska");
eq(detectLanguage("Hello, I would like to know if you can help us build a new website for our company and what the price would be").language, "en", "engelska");
eq(detectLanguage("Hallo, ich möchte gerne wissen, ob Sie uns mit einer neuen Webseite für unser Unternehmen helfen können und was das kostet").language, "de", "tyska");
eq(detectLanguage("Tack!").language, "sv", "för kort text -> standard");

const svar = `Tack, det låter bra!

Den 12 juni 2026 skrev Support <support@inbound.vibedev.se>:
> Hej, vi har tagit emot ditt meddelande
> och återkommer snart.`;
eq(stripQuotedReply(svar), "Tack, det låter bra!", "klipper citat");
eq(stripQuotedReply("Bara ett vanligt mejl utan citat."), "Bara ett vanligt mejl utan citat.", "lämnar text utan citat orörd");
eq(normalizeSubject("Re: SV: [#42] Offert"), "Offert", "rensar prefix");

console.log(fail === 0 ? "\nALLA TESTER OK" : `\n${fail} TESTER MISSLYCKADES`);
process.exit(fail === 0 ? 0 : 1);
