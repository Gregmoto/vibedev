export type CaseStudy = {
  slug: string;
  projectName: string;
  industry: string;
  /** "published" = live product, "ongoing" = active build */
  status: "published" | "ongoing";
  /** External product URL — opens in new tab */
  websiteUrl?: string;
  /** Short tagline shown on listing cards */
  summary: string;
  customerProblem: string;
  solution: string;
  /** "Vad vi byggde" — deliverable bullet list */
  process: string[];
  /** Single-item array: the headline result (or current status for ongoing) */
  results: string[];
  techStack: string[];
  cta: {
    label: string;
    href: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cms-online",
    projectName: "CMS Online",
    industry: "E-handel / SaaS",
    status: "published",
    websiteUrl: "https://cmsonline.se",
    summary:
      "Komplett CMS för e-handel med integrationer mot Fortnox, Shopify och Starweb.",
    customerProblem:
      "E-handlare hanterade ordrar, lager och bokföring i många olika system. Manuell sync, dubbla inmatningar och fel i lager skapade dagligen friktion.",
    solution:
      "Vi byggde en samlad CMS-plattform som kopplar ihop hela e-handelskedjan — från order till leverans till bokföring — i ett och samma system med en inloggning.",
    process: [
      "CMS-plattform med koppling till Fortnox (bokföring + fakturor)",
      "Lagerhantering med synkronisering mot flera lagerorter",
      "Integration mot Shopify och Starweb som butiks-grund",
      "Orderhantering för DHL, Schenker och Postnord (frakthandling)",
      "SMS- och mailutskick direkt från plattformen",
      "Returhantering och kreditflöden",
    ],
    results: [
      "En enda plattform där handlare hanterar hela kedjan från order till leverans till bokföring.",
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "Fortnox API", "Shopify Admin API"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "bookiz",
    projectName: "Bookiz",
    industry: "Community / Bok",
    status: "published",
    websiteUrl: "https://bookiz.se",
    summary:
      "Sveriges community för bokälskare, författare och förlag.",
    customerProblem:
      "Det fanns inget bra svenskt community för bokläsare där de kunde organisera sina bibliotek, hitta nya böcker och engagera sig i bokklubbar — samtidigt som författare och förlag kunde nå läsare direkt.",
    solution:
      "Vi byggde en komplett community-plattform med tre distinkta användartyper och funktioner för bibliotek, bokklubbar, recensioner och direktkontakt med förlag och författare.",
    process: [
      "Användarkonton med personliga bibliotek",
      "Bokklubbar — skapa, gå med, diskutera",
      "Recensions- och betygssystem",
      "Separata konton för författare och förlag med egna profiler",
      "Sök och upptäcktsflöden för nya boktips",
    ],
    results: [
      "En komplett community-plattform där tre olika användartyper (läsare, författare, förlag) hittar varandra naturligt.",
    ],
    techStack: ["Next.js", "PostgreSQL", "Tailwind", "Community-features", "Notifieringar"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "mittbrottmal",
    projectName: "Mittbrottmål",
    industry: "Legal Tech",
    status: "published",
    websiteUrl: "https://mittbrottmal.se",
    summary:
      "Verktyg som hjälper privatpersoner förstå sitt brottmål — utan att ersätta advokaten.",
    customerProblem:
      "Privatpersoner som hamnar i brottmål förstår sällan processen, rättigheterna eller vad som väntar. Advokatbesök är dyra och rådgivning svår att hitta.",
    solution:
      "Vi byggde ett guideverktyg med anonyma, strukturerade flöden som förklarar brottmålsprocessen på enkel svenska och tydliggör när juridisk hjälp faktiskt behövs.",
    process: [
      "Guidade flöden där användaren går igenom sitt eget ärende steg för steg",
      "Tips och förklaringar på enkel svenska",
      "Tydliga signaler om när advokat krävs (ersätter INTE juridisk rådgivning)",
      "Anonymt och säkert flöde",
    ],
    results: [
      "En lågtröskel-tjänst som demokratiserar juridisk grundförståelse.",
    ],
    techStack: ["Next.js", "Tailwind", "Strukturerad innehållsmotor"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "min-odling",
    projectName: "Min Odling",
    industry: "Community / Hortikultur",
    status: "published",
    websiteUrl: "https://minodling.se",
    summary:
      "Community och verktyg för odlare — från balkonglåda till växthus.",
    customerProblem:
      "Hobbyodlare i Sverige saknade en samlad digital plats för att hantera sin odling, identifiera växter och samverka med andra odlare.",
    solution:
      "Vi byggde en kombinerad community- och verktygsapp med växtidentifiering via AI, personlig odlingskalender och socialt flöde.",
    process: [
      "Användarkonton och sociala feeds",
      "Inbyggd växtidentifikation (foto → art)",
      "Personlig odlingskalender baserad på zon och växter",
      "Diskussionsforum och tips",
      "Bibliotek över växter och odlingstekniker",
    ],
    results: [
      "En odlings-app som faktiskt används året runt — inte bara vid sådd.",
    ],
    techStack: ["Next.js", "React Native", "AI-bildigenkänning", "PostgreSQL"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "endoo",
    projectName: "Endoo",
    industry: "SaaS / Ekonomi",
    status: "ongoing",
    websiteUrl: "https://endoo.se",
    summary:
      "Komplett SaaS för fakturering, order, inköp och bokföring — i en plattform.",
    customerProblem:
      "Små och medelstora bolag splittrar ekonomin över 4–6 olika system: ett för faktura, ett för bokföring, ett för order, ett för inköp. Dubbla inmatningar, onödig integrationsfriktion och dyra licenskostnader.",
    solution:
      "Vi bygger en komplett ekonomiplattform med allt i en inloggning och en databas — utan integrationsfriktion, utan dubbelarbete.",
    process: [
      "Komplett fakturering med svenska standardregler",
      "Orderhantering kopplat till fakturor",
      "Inköp och leverantörsfakturor",
      "Full bokföring (BAS-kontoplan)",
      "Allt i samma plattform — en inloggning, en databas",
    ],
    results: [
      "Aktiv utveckling. Beta planerad till Q3 2026.",
    ],
    techStack: ["Next.js", "Prisma", "PostgreSQL", "TypeScript"],
    cta: {
      label: "Läs mer om Endoo",
      href: "https://endoo.se",
    },
  },
];
