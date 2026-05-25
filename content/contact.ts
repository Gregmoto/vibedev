import { CONTACT } from "@/lib/config/contact";

export const contactFaq = [
  {
    question: "Vad händer efter att vi skickat in formuläret?",
    answer:
      "Vi går igenom er förfrågan och återkommer med ett tydligt nästa steg, oftast inom en arbetsdag. Ibland räcker det med ett kort samtal, ibland föreslår vi en mer strukturerad första workshop.",
  },
  {
    question: "Passar ni bara stora projekt?",
    answer:
      "Nej. Vi hjälper både bolag som behöver en snabb förstudie och team som vill bygga större produkter över tid. Det viktiga är att det finns ett tydligt mål och ett seriöst behov.",
  },
  {
    question: "Kan ni hjälpa till även om scope inte är helt klart?",
    answer:
      "Ja. Det är vanligt att företag kommer till oss när mycket fortfarande är öppet. Vi hjälper er gärna att reda ut scope, prioritering och vad som är smartast att bygga först.",
  },
];

export const contactDetails = [
  {
    label: "E-post",
    value: CONTACT.email,
    href: CONTACT.emailHref,
  },
  {
    label: "Telefon",
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
  },
  {
    label: "Plats",
    value: `${CONTACT.address.city}, ${CONTACT.address.country}`,
    href: null,
  },
] as const;
