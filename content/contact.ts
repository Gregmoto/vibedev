import { CONTACT } from "@/lib/config/contact";

export const contactFaq = [
  {
    question: "Vad händer efter att vi skickat in formuläret?",
    answer:
      "Vi går igenom er förfrågan och återkommer inom 24 timmar med ett konkret nästa steg. Oftast räcker det med ett kort samtal för att förstå läget — ibland föreslår vi en strukturerad workshop om projektet är komplext.",
  },
  {
    question: "Passar ni bara stora projekt?",
    answer:
      "Nej. Vi tar projekt från små AI-sprintar (2 veckor) upp till stora plattformar. Om ert projekt är för litet säger vi det rakt — och rekommenderar gärna någon annan som passar bättre.",
  },
  {
    question: "Kan ni hjälpa till även om scope inte är klart?",
    answer:
      "Absolut. Många av våra bästa projekt har startat med 'vi vet inte riktigt vad vi behöver'. Vi hjälper er definiera scope, prioriteringar och första version.",
  },
  {
    question: "Vad kostar ett projekt?",
    answer:
      "Det beror på scope. Vi sätter alltid pris efter en gemensam genomgång av era behov — så ni vet exakt vad ni betalar innan vi börjar. Boka samtal eller skicka förfrågan, så återkommer vi med offert inom 24 timmar.",
  },
  {
    question: "Hur går processen till?",
    answer:
      "Steg 1: Kostnadsfritt strategisamtal. Steg 2: Vi skickar offert med scope och fast pris. Steg 3: Signering + uppstart inom 2–4 veckor. Steg 4: Veckovis demo under projektet. Steg 5: Lansering + uppföljning.",
  },
  {
    question: "Vilka tekniker använder ni?",
    answer:
      "Default: Next.js för web, React Native för mobil, TypeScript överallt, PostgreSQL, Prisma och AWS/Vercel för hosting. Vi väljer alltid det som passar projektet — inte det som är mest populärt just nu.",
  },
  {
    question: "Skriver ni NDA?",
    answer:
      "Ja. Vi signerar standardavtal eller ert eget innan vi diskuterar detaljer. Bara säg till.",
  },
  {
    question: "Vem äger koden?",
    answer:
      "Ni. Allt levereras i ert GitHub eller GitLab från första dagen. Ingen inlåsning, inga dolda licenser.",
  },
  {
    question: "Kan ni jobba med oss långsiktigt?",
    answer:
      "Ja. Många kunder börjar med ett MVP-projekt och fortsätter sedan med ett Produktpartnerskap där vi är deras team för fortsatt utveckling.",
  },
  {
    question: "Var ligger ni?",
    answer:
      "Stockholm, men vi jobbar med kunder i hela Norden och Europa. Möten på plats är möjligt i Stockholm; annars jobbar vi remote med veckovis demo.",
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
