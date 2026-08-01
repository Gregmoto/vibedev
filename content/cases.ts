export type CaseStudy = {
  slug: string;
  projectName: string;
  industry: string;
  /** "published" = live product, "ongoing" = active build */
  status: "published" | "ongoing";
  /** Overrides the default status badge text on listing cards */
  statusLabel?: string;
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
    slug: "powerbike",
    projectName: "Powerbike",
    industry: "Media / Publishing",
    status: "published",
    websiteUrl: "https://powerbike.nu",
    summary:
      "Svenskt motormagasin flyttat från WordPress till en egen publiceringsplattform — med annonssystem, företagsregister och AI i redaktionen.",
    customerProblem:
      "Powerbike publicerar nyheter, tester och guider om MC, moped, ATV, snöskoter och cykel. Sajten låg på WordPress, och intäkterna byggde på annonser — en kombination som drar åt olika håll: annonsskript och plugins gör sidorna långsamma, och en långsam sajt tappar både läsare och annonsvärde. Dessutom fanns ingen egen struktur för de saker som faktiskt tjänar pengar: annonsförsäljning, betalt företagsregister och affiliatelänkar sköttes vid sidan av systemet.",
    solution:
      "Vi byggde en egen publiceringsplattform på Next.js och Cloudflare Workers, med redaktionsverktyg, annonssystem och företagsregister i samma produkt. Hela WordPress-innehållet migrerades med bevarade länkar, och AI används i redaktionen — men aldrig utan en människa som godkänner.",
    process: [
      "Egen artikelmotor med blockbaserad editor: text, bilder, citat, faktarutor, annonsplatser och affiliatelänkar",
      "Testartiklar med strukturerad betygsdata som blir Product- och Review-schema för Google",
      "Eget annonssystem med Stripe-betalning, viktad rotation och klickspårning — med AdSense som fallback",
      "Betalt företagsregister för handlare, verkstäder och klubbar, med geokodning och öppettider",
      "AI-stöd i redaktionen: RSS-flöden blir utkast som alltid passerar en granskningskö innan publicering",
      "Nyhetsbrev med dubbel opt-in, samt cookiefri egen statistik utan tredjepartsspårning",
      "Migrering av allt WordPress-innehåll med 399 redirects så att inga gamla länkar dog",
    ],
    results: [
      "Ett komplett motormagasin i produktion med fyra egna intäktsflöden — och en annonslösning som inte får sidorna att hoppa eller ladda långsammare.",
    ],
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Supabase/PostgreSQL",
      "Cloudflare Workers",
      "Stripe",
      "Claude (Anthropic)",
    ],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "bolagsdata-api",
    projectName: "Bolagsdata API",
    industry: "Data / API",
    status: "published",
    websiteUrl: "https://bolagsdataapi.se",
    summary:
      "Sökbar databas över Sveriges 3,5 miljoner företag — med ett öppet API, byggt på avgiftsfria offentliga datakällor.",
    customerProblem:
      "Svensk företagsinformation ligger i praktiken bakom betalväggar och säljsamtal, trots att grunddatan är offentlig och avgiftsfri. Journalisten som granskar, säljaren som prospekterar, utvecklaren som bygger och privatpersonen som vill kolla upp en motpart möts alla av samma sak: registrera dig, prata med säljare, teckna avtal. Datan finns hos Bolagsverket och SCB — men i bulkfiler som ingen orkar bearbeta, i tre olika format och två teckenkodningar.",
    solution:
      "Vi byggde en sökbar företagsdatabas ovanpå Bolagsverkets och SCB:s öppna datamängder, plus 360 000+ årsredovisningar tolkade ur iXBRL. Sök och API är gratis — tjänsten finansieras av annonsering och företag som uppgraderar sin profil, inte av betalväggar.",
    process: [
      "Sökning över 3,5 miljoner företag med filter på ort, status, bolagsform och SNI-bransch",
      "Öppet REST-API med tre endpoints: sök, enskilt bolag och bulkexport med keyset-paginering",
      "API-nycklar med atomisk kvotmätning — 500 anrop per dygn, utan risk för race conditions",
      "Importpipeline som streamar Bolagsverkets och SCB:s bulkfiler oavsett XML, CSV, TSV eller NDJSON",
      "360 000+ årsredovisningar tolkade ur iXBRL, med 32 taxonomibegrepp mappade till nyckeltal",
      "Bevakningslistor med notiser vid ändring, CSV-export och egen företagsprofil för bolagsägare",
      "Sitemap-arkitektur som indexerar miljontals bolagssidor utan att fälla databasen",
    ],
    results: [
      "En gratis, öppen företagsdatabas i produktion — 3,5 miljoner bolag och 360 000+ bokslut, sökbara på under en sekund där tunga frågor tidigare tog nästan en minut.",
    ],
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Supabase/PostgreSQL",
      "Cloudflare Pages (edge)",
      "Node-pipeline",
    ],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "vibeshops",
    projectName: "VIBESHOPS",
    industry: "SaaS / E-handel",
    status: "published",
    statusLabel: "Lanserad — vidare utveckling pågår",
    websiteUrl: "https://vibeshops.se",
    summary:
      "Multi-tenant e-handelsplattform där svenska handlare får en komplett webbutik — utan provision och utan inlåsning.",
    customerProblem:
      "Svenska handlare som vill sälja online har i praktiken två val: en internationell plattform som Shopify — där du betalar provision på varje order och tvingas in i deras kassa — eller en äldre svensk lösning som visserligen förstår Swish, moms och Fortnox men känns byggd för ett annat årtionde. Ingen av dem löser svensk verklighet, modern prestanda och ärlig prissättning i samma produkt.",
    solution:
      "Vi byggde en multi-tenant e-handelsplattform där svensk regelefterlevnad, modern prestanda och provisionsfri prissättning finns i samma produkt — och där en handlare kan driva flera butiker på flera marknader utan att något av det blir en integrationsövning.",
    process: [
      "Multi-tenant kärna med vattentät isolering — RLS på samtliga tabeller, verifierat med skarpa isolationstester i CI",
      "Multishop — flera butiker, marknader, språk och valutor från ett konto, med delad katalog och delat lager men eget sortiment per butik",
      "Svensk kassa — Swish, Klarna, kort och Qliro med serverside-beräkning av alla belopp i heltal öre",
      "Moms som faktiskt stämmer — destinationsmoms för EU-B2C (OSS), omvänd skattskyldighet och nollmoms vid export",
      "Lager i realtid — flera lagerställen, atomisk reservation vid köp och hämta i butik",
      "AI där den gör nytta — produkttexter och översättningar på svenska med förhandsgranskning innan de sparas",
      "Omnibus och GDPR ur lådan — prishistorik loggas från dag ett, cookie-samtycke gatar all spårning",
      "Integrationer — Fortnox, Google Shopping, Meta, Omdio och fraktbokning mot flera transportörer",
    ],
    results: [
      "Lanserad och i drift med GregMoto som första tenant, plus en publik demo på demo.vibeshops.se. Tenant-isoleringen är verifierad med cross-tenant-tester i CI. Vidareutvecklingen fortsätter med nya funktioner och fler butiker.",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Supabase/PostgreSQL",
      "Row Level Security",
      "Cloudflare Workers",
      "Stripe",
    ],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
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
    slug: "cultio",
    projectName: "Cultio",
    industry: "SaaS / Web-to-Print",
    status: "ongoing",
    websiteUrl: "https://cultio.se",
    summary:
      "Web-to-print-plattform där nordiska tryckerier får en färdig webbutik för att sälja tryck online.",
    customerProblem:
      "Många tryckerier sitter fast i manuella flöden — ordrar via mejl, tryckfiler via WeTransfer, korrektur via telefon och fakturor för hand. Befintliga web-to-print-system är gamla och röriga, och generella e-handelsplattformar som Shopify, WooCommerce och PrestaShop klarar inte trycklogiken: upplagor, kvadratmeterpris, bleed/preflight, korrekturflöden eller kundspecifika B2B-prislistor.",
    solution:
      "Vi bygger specialiserad tryckmjukvara — inte en generell butik man försöker böja till tryck. Allt ett tryckeri behöver är inbyggt: konfigurator med realtidspris, preflight, korrektur, B2B-prislistor och white-label, på en delad commerce-kärna med tryck som första vertikal.",
    process: [
      "Produktkonfigurator med realtidspris — kvantitetstrappor och m²-pris för storformat",
      "Filuppladdning med automatisk preflight (bleed, DPI, CMYK) och digitalt godkänt korrektur",
      "Kundspecifika prislistor och B2B-flöden (faktura, förskott, rabattsatser)",
      "Multi-tenant med white-label: varje tryckeri får egen butik på egen domän",
      "Återförsäljarnätverk — tryckerier ger sina partners egna white-label-butiker med vinstvy",
      "Kundportal, viktbaserad frakt, nyhetsbrev och ett tvåaxlat orderflöde (produktion + betalning)",
    ],
    results: [
      "Aktiv utveckling på en delad commerce-kärna med tryck som första vertikal. Lansering planerad till 2026.",
    ],
    techStack: ["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"],
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
