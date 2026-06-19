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
    slug: "omdio",
    projectName: "Omdio",
    industry: "Omdömesplattform / SaaS",
    status: "published",
    websiteUrl: "https://omdio.se",
    summary:
      "Köpverifierad omdömesplattform för butiker och produkter — i samma plattform.",
    customerProblem:
      "Svenska marknaden saknade en plats för köpverifierade omdömen som täcker både företag och enskilda produkter. Trustpilot betygsätter företag, Prisjakt jämför pris — men ingen knöt ihop verifierat köp med både butiks- och produktomdöme. Utan köpverifiering manipuleras omdömen lätt, och utan omdömen är en omdömesplattform värdelös — det klassiska kallstartsproblemet.",
    solution:
      "Vi byggde en plattformsneutral omdömeskärna med köpverifiering: butiker kopplar sin e-handel via adaptrar, en lättviktig widget samlar in verifierade omdömen direkt efter köp, och produktomdömen matchas över butiksgränser via EAN. Resultatet är trovärdiga omdömen för både företag och produkter på samma ställe.",
    process: [
      "Plattformsneutral kärna med adaptrar för Shopify och WooCommerce",
      "Inbäddbar widget (~4 kB, Shadow DOM) med köpverifiering via JSON-LD",
      "EAN-baserad produktmatchning över butiksgränser",
      "Utskicksmotor med kvot, sampling och leveransbarhet (SPF/DKIM/DMARC)",
      "AI-moderering av inkommande omdömen",
      "Företagsportal, admin och betalflöde via Stripe",
    ],
    results: [
      "En komplett plattform i produktion: publik sajt, företagsportal, admin, betalflöde och e-handelsintegrationer.",
    ],
    techStack: ["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "tis",
    projectName: "TIS",
    industry: "EdTech / Körkort",
    status: "published",
    websiteUrl: "https://tisonline.se",
    summary:
      "Digital teoriplattform för svenska B-körkortet — övningsprov, AI-förklaringar och flerspråkigt stöd på 11 språk.",
    customerProblem:
      "Att plugga inför teoriprovet för B-körkort är torrt och svårtillgängligt för den som inte har svenska som modersmål. Befintliga tjänster erbjuder ofta bara frågor utan förklaring och saknar stöd för flerspråkiga elever. Tröskeln blir hög för nyanlända som ska lära sig både trafikregler och ett nytt språk samtidigt.",
    solution:
      "Vi byggde en komplett inlärningsplattform där eleven kan öva, få AI-genererade förklaringar upplästa och ställa frågor till en flerspråkig AI-tutor — på 11 språk, inte bara svara rätt eller fel.",
    process: [
      "Övningsprov och tidsbegränsade, simulerade riktiga prov",
      "Frågebank med AI-genererade pedagogiska förklaringar, optimerade för uppläsning",
      "\"Trafiktutor\" — en flerspråkig AI-chatt för trafikfrågor",
      "Vägmärkesguide med 610 svenska vägmärken i 20 kategorier",
      "Bildanalys av parkeringsskyltar — ladda upp ett foto och få en förklaring",
      "Premium Learning Support: veckovisa fokusområden baserade på elevens svaga ämnen",
      "Teorilektioner, blogg, dagliga trafikfakta och mål/badges",
      "Fullt admin med frågebank, taggar, ämnen, kluster och översättningshantering",
    ],
    results: [
      "En komplett inlärningsplattform i produktion där eleven kan plugga på 11 språk och få förklaringar upplästa av en AI-tutor.",
    ],
    techStack: ["React 18", "Vite", "TypeScript", "Tailwind", "Supabase", "Edge Functions", "Gemini 2.5 Flash", "ElevenLabs"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "konkursfakta",
    projectName: "Konkursfakta",
    industry: "Register / Offentlig data",
    status: "published",
    websiteUrl: "https://konkursfakta.se",
    summary:
      "Öppet, sökbart register över svenska bolag i konkurs — datan från Bolagsverket, PoIT och tingsrätter samlad på ett ställe.",
    customerProblem:
      "Konkursuppgifter om svenska bolag ligger utspridda hos Bolagsverket, Post- och Inrikes Tidningar och landets tingsrätter. Leverantörer som bevakar fordringar, anställda som berörs av lönegaranti, kreditbeslutsfattare och journalister tvingas leta på flera ställen. Det fanns inget renodlat, reklamfritt register fokuserat enbart på konkurser — allabolag och ratsit är breda och kommersiella.",
    solution:
      "En öppen, sökbar plattform där varje konkurs får en egen bolagssida med org.nr, bransch, ort, konkursdatum, förvaltare, tingsrätt, adress, SNI-koder och juridisk form. Besökare söker på bolagsnamn eller organisationsnummer och får de senast inkomna konkurserna. En blogg med guideartiklar förklarar konkursprocessen, och ett inloggat admin-gränssnitt låter redaktionen lägga till och redigera bolag.",
    process: [
      "Egen bolagssida per konkurs med org.nr, förvaltare, tingsrätt, SNI-koder och juridisk form",
      "Sök på bolagsnamn eller organisationsnummer med lista över senast inkomna konkurser",
      "Blogg med tio guideartiklar som förklarar konkursprocessen",
      "Inloggat admin-gränssnitt för redaktionen att lägga till och redigera bolag",
      "SSR-säkra sidor med JSON-LD per bolag och dynamiskt genererad sitemap",
    ],
    results: [
      "Ett öppet register med cirka 13 400 bolag och SEO-optimerade bolagssidor — konkursdata samlad på ett reklamfritt ställe.",
    ],
    techStack: ["React 19", "TanStack Start", "Tailwind v4", "shadcn/ui", "Supabase", "Cloudflare Workers", "SSR", "SEO"],
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
