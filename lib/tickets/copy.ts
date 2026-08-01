import type { SupportedLanguage } from "@/lib/tickets/language";

/**
 * Texter som kunden ser, på kundens eget språk. Autosvaret och kundportalen
 * delar samma uppsättning så att en kund som skrivit på finska inte möts av
 * ett finskt mejl och sedan en svensk webbsida.
 */

export type TicketCopy = {
  autoReplySubject: (ticketNumber: number, subject: string) => string;
  greeting: (name: string | null) => string;
  received: string;
  ticketNumberLabel: string;
  followLinkIntro: string;
  followLinkLabel: string;
  replyHint: string;
  closing: string;
  /* Kundportalen */
  /** Visas i sidhuvudet på kundsidan, efter kontots namn. */
  portalBrandSuffix: string;
  portalTitle: string;
  portalStatusLabel: string;
  portalStatus: Record<"OPEN" | "PENDING" | "CLOSED", string>;
  portalFrom: string;
  portalYou: string;
  portalReplyLabel: string;
  portalReplyPlaceholder: string;
  portalAttachmentsLabel: string;
  portalSubmit: string;
  portalSent: string;
  portalEmptyReply: string;
  portalClosedNotice: string;
};

const COPY: Record<SupportedLanguage, TicketCopy> = {
  sv: {
    autoReplySubject: (n, s) => `[#${n}] Vi har tagit emot ditt meddelande – ${s}`,
    greeting: (name) => (name ? `Hej ${name},` : "Hej,"),
    received: "Tack för att du hörde av dig. Vi har tagit emot ditt meddelande och återkommer så snart vi kan.",
    ticketNumberLabel: "Ditt ärendenummer",
    followLinkIntro: "Du kan följa ärendet och svara här:",
    followLinkLabel: "Öppna ärendet",
    replyHint: "Du kan också svara direkt på det här mejlet – svaret hamnar i samma ärende.",
    closing: "Vänliga hälsningar",
    portalBrandSuffix: "Ärendesystem",
    portalTitle: "Ditt ärende",
    portalStatusLabel: "Status",
    portalStatus: { OPEN: "Öppet", PENDING: "Väntar på dig", CLOSED: "Avslutat" },
    portalFrom: "Från",
    portalYou: "Du",
    portalReplyLabel: "Skriv ett svar",
    portalReplyPlaceholder: "Skriv ditt meddelande här…",
    portalAttachmentsLabel: "Bifoga filer",
    portalSubmit: "Skicka svar",
    portalSent: "Ditt svar har skickats.",
    portalEmptyReply: "Skriv ett meddelande innan du skickar.",
    portalClosedNotice: "Ärendet är avslutat. Skickar du ett svar öppnas det igen.",
  },
  en: {
    autoReplySubject: (n, s) => `[#${n}] We've received your message – ${s}`,
    greeting: (name) => (name ? `Hi ${name},` : "Hi,"),
    received: "Thanks for getting in touch. We've received your message and will get back to you as soon as we can.",
    ticketNumberLabel: "Your ticket number",
    followLinkIntro: "You can follow the ticket and reply here:",
    followLinkLabel: "Open the ticket",
    replyHint: "You can also reply directly to this email – your reply lands in the same ticket.",
    closing: "Best regards",
    portalBrandSuffix: "Ticket system",
    portalTitle: "Your ticket",
    portalStatusLabel: "Status",
    portalStatus: { OPEN: "Open", PENDING: "Waiting for you", CLOSED: "Closed" },
    portalFrom: "From",
    portalYou: "You",
    portalReplyLabel: "Write a reply",
    portalReplyPlaceholder: "Write your message here…",
    portalAttachmentsLabel: "Attach files",
    portalSubmit: "Send reply",
    portalSent: "Your reply has been sent.",
    portalEmptyReply: "Write a message before sending.",
    portalClosedNotice: "This ticket is closed. Sending a reply will reopen it.",
  },
  no: {
    autoReplySubject: (n, s) => `[#${n}] Vi har mottatt meldingen din – ${s}`,
    greeting: (name) => (name ? `Hei ${name},` : "Hei,"),
    received: "Takk for at du tok kontakt. Vi har mottatt meldingen din og kommer tilbake til deg så snart vi kan.",
    ticketNumberLabel: "Saksnummeret ditt",
    followLinkIntro: "Du kan følge saken og svare her:",
    followLinkLabel: "Åpne saken",
    replyHint: "Du kan også svare direkte på denne e-posten – svaret havner i samme sak.",
    closing: "Vennlig hilsen",
    portalBrandSuffix: "Sakssystem",
    portalTitle: "Saken din",
    portalStatusLabel: "Status",
    portalStatus: { OPEN: "Åpen", PENDING: "Venter på deg", CLOSED: "Avsluttet" },
    portalFrom: "Fra",
    portalYou: "Du",
    portalReplyLabel: "Skriv et svar",
    portalReplyPlaceholder: "Skriv meldingen din her…",
    portalAttachmentsLabel: "Legg ved filer",
    portalSubmit: "Send svar",
    portalSent: "Svaret ditt er sendt.",
    portalEmptyReply: "Skriv en melding før du sender.",
    portalClosedNotice: "Saken er avsluttet. Sender du et svar åpnes den igjen.",
  },
  da: {
    autoReplySubject: (n, s) => `[#${n}] Vi har modtaget din besked – ${s}`,
    greeting: (name) => (name ? `Hej ${name},` : "Hej,"),
    received: "Tak fordi du skrev til os. Vi har modtaget din besked og vender tilbage hurtigst muligt.",
    ticketNumberLabel: "Dit sagsnummer",
    followLinkIntro: "Du kan følge sagen og svare her:",
    followLinkLabel: "Åbn sagen",
    replyHint: "Du kan også svare direkte på denne e-mail – svaret havner i samme sag.",
    closing: "Venlig hilsen",
    portalBrandSuffix: "Sagssystem",
    portalTitle: "Din sag",
    portalStatusLabel: "Status",
    portalStatus: { OPEN: "Åben", PENDING: "Venter på dig", CLOSED: "Afsluttet" },
    portalFrom: "Fra",
    portalYou: "Dig",
    portalReplyLabel: "Skriv et svar",
    portalReplyPlaceholder: "Skriv din besked her…",
    portalAttachmentsLabel: "Vedhæft filer",
    portalSubmit: "Send svar",
    portalSent: "Dit svar er sendt.",
    portalEmptyReply: "Skriv en besked, før du sender.",
    portalClosedNotice: "Sagen er afsluttet. Sender du et svar, åbnes den igen.",
  },
  de: {
    autoReplySubject: (n, s) => `[#${n}] Wir haben Ihre Nachricht erhalten – ${s}`,
    greeting: (name) => (name ? `Hallo ${name},` : "Hallo,"),
    received: "Vielen Dank für Ihre Nachricht. Wir haben sie erhalten und melden uns so schnell wie möglich.",
    ticketNumberLabel: "Ihre Vorgangsnummer",
    followLinkIntro: "Hier können Sie den Vorgang verfolgen und antworten:",
    followLinkLabel: "Vorgang öffnen",
    replyHint: "Sie können auch direkt auf diese E-Mail antworten – Ihre Antwort landet im selben Vorgang.",
    closing: "Mit freundlichen Grüßen",
    portalBrandSuffix: "Ticketsystem",
    portalTitle: "Ihr Vorgang",
    portalStatusLabel: "Status",
    portalStatus: { OPEN: "Offen", PENDING: "Wartet auf Sie", CLOSED: "Abgeschlossen" },
    portalFrom: "Von",
    portalYou: "Sie",
    portalReplyLabel: "Antwort schreiben",
    portalReplyPlaceholder: "Schreiben Sie Ihre Nachricht hier…",
    portalAttachmentsLabel: "Dateien anhängen",
    portalSubmit: "Antwort senden",
    portalSent: "Ihre Antwort wurde gesendet.",
    portalEmptyReply: "Bitte schreiben Sie eine Nachricht, bevor Sie senden.",
    portalClosedNotice: "Der Vorgang ist abgeschlossen. Eine Antwort öffnet ihn wieder.",
  },
  fr: {
    autoReplySubject: (n, s) => `[#${n}] Nous avons bien reçu votre message – ${s}`,
    greeting: (name) => (name ? `Bonjour ${name},` : "Bonjour,"),
    received: "Merci de nous avoir contactés. Nous avons bien reçu votre message et reviendrons vers vous dès que possible.",
    ticketNumberLabel: "Votre numéro de dossier",
    followLinkIntro: "Vous pouvez suivre le dossier et répondre ici :",
    followLinkLabel: "Ouvrir le dossier",
    replyHint: "Vous pouvez aussi répondre directement à cet e-mail – votre réponse rejoindra le même dossier.",
    closing: "Cordialement",
    portalBrandSuffix: "Suivi des demandes",
    portalTitle: "Votre dossier",
    portalStatusLabel: "Statut",
    portalStatus: { OPEN: "Ouvert", PENDING: "En attente de votre réponse", CLOSED: "Clôturé" },
    portalFrom: "De",
    portalYou: "Vous",
    portalReplyLabel: "Écrire une réponse",
    portalReplyPlaceholder: "Écrivez votre message ici…",
    portalAttachmentsLabel: "Joindre des fichiers",
    portalSubmit: "Envoyer la réponse",
    portalSent: "Votre réponse a été envoyée.",
    portalEmptyReply: "Écrivez un message avant d'envoyer.",
    portalClosedNotice: "Ce dossier est clôturé. Une réponse le rouvrira.",
  },
  es: {
    autoReplySubject: (n, s) => `[#${n}] Hemos recibido tu mensaje – ${s}`,
    greeting: (name) => (name ? `Hola ${name}:` : "Hola:"),
    received: "Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible.",
    ticketNumberLabel: "Tu número de caso",
    followLinkIntro: "Puedes seguir el caso y responder aquí:",
    followLinkLabel: "Abrir el caso",
    replyHint: "También puedes responder directamente a este correo: tu respuesta llegará al mismo caso.",
    closing: "Un saludo",
    portalBrandSuffix: "Sistema de casos",
    portalTitle: "Tu caso",
    portalStatusLabel: "Estado",
    portalStatus: { OPEN: "Abierto", PENDING: "Esperando tu respuesta", CLOSED: "Cerrado" },
    portalFrom: "De",
    portalYou: "Tú",
    portalReplyLabel: "Escribe una respuesta",
    portalReplyPlaceholder: "Escribe tu mensaje aquí…",
    portalAttachmentsLabel: "Adjuntar archivos",
    portalSubmit: "Enviar respuesta",
    portalSent: "Tu respuesta se ha enviado.",
    portalEmptyReply: "Escribe un mensaje antes de enviar.",
    portalClosedNotice: "Este caso está cerrado. Si respondes, volverá a abrirse.",
  },
  fi: {
    autoReplySubject: (n, s) => `[#${n}] Olemme vastaanottaneet viestisi – ${s}`,
    greeting: (name) => (name ? `Hei ${name},` : "Hei,"),
    received: "Kiitos yhteydenotostasi. Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian.",
    ticketNumberLabel: "Asiasi numero",
    followLinkIntro: "Voit seurata asiaa ja vastata täällä:",
    followLinkLabel: "Avaa asia",
    replyHint: "Voit myös vastata suoraan tähän sähköpostiin – vastauksesi päätyy samaan asiaan.",
    closing: "Ystävällisin terveisin",
    portalBrandSuffix: "Asiointijärjestelmä",
    portalTitle: "Asiasi",
    portalStatusLabel: "Tila",
    portalStatus: { OPEN: "Avoin", PENDING: "Odottaa sinua", CLOSED: "Suljettu" },
    portalFrom: "Lähettäjä",
    portalYou: "Sinä",
    portalReplyLabel: "Kirjoita vastaus",
    portalReplyPlaceholder: "Kirjoita viestisi tähän…",
    portalAttachmentsLabel: "Liitä tiedostoja",
    portalSubmit: "Lähetä vastaus",
    portalSent: "Vastauksesi on lähetetty.",
    portalEmptyReply: "Kirjoita viesti ennen lähettämistä.",
    portalClosedNotice: "Asia on suljettu. Vastaaminen avaa sen uudelleen.",
  },
};

export function getTicketCopy(language: string): TicketCopy {
  return COPY[language as SupportedLanguage] ?? COPY.sv;
}
