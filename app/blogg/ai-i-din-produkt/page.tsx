import type { Metadata } from "next";
import Link from "next/link";
import { articleSchema } from "@/lib/schema";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/blogg/ai-i-din-produkt",
    fallbackTitle: "AI i din digitala produkt — när det tillför värde och när det inte gör det",
    fallbackDescription:
      "En praktisk guide för founders och produktteam: fem frågor att ställa innan ni implementerar AI, konkreta use cases och hur ni undviker den kostsamma demoeffekten.",
    keywords: [
      "ai i produkt",
      "ai produktutveckling",
      "när ska man använda ai",
      "ai beslutsmodell",
      "ai i appar",
      "ai use cases",
      "ai i digitala produkter",
    ],
  });
}

/* ── Inline icons ────────────────────────────────────────────────────────────── */

function IconCheck() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function AiIdinProduktPage() {
  const publishedAt = "2026-02-01";
  const slug = "ai-i-din-produkt";

  const articleLd = articleSchema({
    title: "AI i din digitala produkt — när det tillför värde och när det inte gör det",
    description:
      "En praktisk guide för founders och produktteam: fem frågor att ställa innan ni implementerar AI, konkreta use cases och hur ni undviker den kostsamma demoeffekten.",
    path: `/blogg/${slug}`,
    publishedAt,
    keywords: ["ai i produkt", "ai produktutveckling", "ai beslutsmodell", "ai use cases"],
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",   url: siteConfig.url },
    { name: "Blogg", url: `${siteConfig.url}/blogg` },
    { name: "AI i din digitala produkt", url: `${siteConfig.url}/blogg/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-gradient-to-b from-bg to-[#EFF6FF] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
              AI
            </span>
            <span className="text-xs text-muted">Guide</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
            AI i din digitala produkt — när det tillför värde och när det inte gör det
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            De flesta bolag vi pratar med har en ambition att "använda AI" i sin produkt. Färre har svar på vilken uppgift AI ska lösa, för vem och med vilket konkret resultat. Den frågan är dyr att missa.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted">
            <span>Av VibeDev</span>
            <span aria-hidden="true">·</span>
            <span>Ca 12 min läsning</span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>Februari 2026</time>
          </div>
        </div>
      </div>

      {/* ── Article content ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-16">

        {/* Section 1: Vad menas med AI i en produkt */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Vad menas egentligen med AI i en digital produkt?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            "AI i produkten" kan betyda hundra olika saker. Det är viktigt att specificera vad man menar, annars bygger man fel sak — eller köper in ett lager som aldrig levererar det man hoppades på.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            I praktiken faller AI-funktioner i digitala produkter i fyra kategorier:
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                title: "Generativ AI (text, bild, kod)",
                body: "Systemen som ChatGPT, Claude och Gemini representerar. Genererar innehåll — svar, sammanfattningar, utkast, förklaringar — baserat på en prompt. Används i produkter för kundtjänst-bots, innehållshjälp, dokumentationsgenerering och mer.",
              },
              {
                title: "Klassisk maskininlärning (ML)",
                body: "Modeller tränade på historisk data för att förutsäga ett specifikt utfall — vad en användare troligtvis vill ha, om en transaktion är bedräglig, vilken kategori ett objekt tillhör. Lång historia, väletablerade mönster, ofta mer förutsägbar i produktion.",
              },
              {
                title: "Datorseende och igenkänning",
                body: "AI som analyserar bilder eller video — produktidentifiering, ansiktsigenkänning, skadeanalys, kvalitetskontroll. Kräver bra träningsdata men ger unik funktionalitet i rätt kontext.",
              },
              {
                title: "Naturlig språkbehandling (NLP) utan LLM",
                body: "Sök, klassificering, sentiment-analys och textextraktion baserat på enklare NLP-modeller — snabbare och billigare än LLM:er i situationer som inte kräver generativ förmåga.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-line p-6">
                <h3 className="font-display text-base font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted">
            Valet av kategori är ett arkitekturbeslut, inte ett marknadsbeslut. Gör det tidigt och baserat på vad som faktiskt behövs — inte vad som låter mest imponerande.
          </p>
        </section>

        {/* Section 2: 4 use cases */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Fyra use cases där AI faktiskt tillför värde
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Baserat på de projekt vi jobbat med ser vi ett tydligt mönster: AI tillför störst värde när det löser en konkret, upprepande uppgift som tidigare krävde mänsklig ansträngning — eller var omöjlig att göra alls.
          </p>

          {[
            {
              num: "01",
              title: "Automatisera repetitiva mänskliga beslut",
              body: "En e-handelsplattform som manuellt kategoriserar 10 000 produkter per månad. En HR-plattform som granskar liknande ansökningar om och om igen. En supportfunktion som svarar på 80 % identiska frågor. Dessa är starka AI-candidates — inte för att ersätta alla beslut, utan för att hantera volymen av rutinfall och frigöra mänsklig kapacitet till undantagen.",
              examples: ["Produktkategorisering i e-handel", "Routing av support-ärenden", "Dokumentvalidering och extraktion"],
            },
            {
              num: "02",
              title: "Personalisering i rätt skala",
              body: "Manuell personalisering av upplevelser för tusentals användare är omöjlig. AI gör det möjligt — rekommendationer baserade på beteende, anpassade dashboards, dynamisk prioritering. Nyckeln är att personaliseringen faktiskt speglar vad användaren vill ha, inte vad algoritmen optimerar för (engagemang utan värde är en fallgrop).",
              examples: ["Innehålls- och produktrekommendationer", "Adaptiva onboarding-flöden", "Personliga sammanfattningar och insights"],
            },
            {
              num: "03",
              title: "Intelligenta sök- och filterfunktioner",
              body: "Klassisk sök kräver exakta ord. Semantisk sök förstår intent — användaren söker 'löparskor för regn' och hittar 'vattentäta skor för löpning utomhus'. Det är en dramatisk förbättring av användarupplevelsen och döljer den underliggande komplexiteten väl.",
              examples: ["Semantisk fulltextsök", "Naturligt språk till filter/query", "Dokumentsök och kunskapsbase"],
            },
            {
              num: "04",
              title: "Hjälpa användare att göra sin uppgift snabbare",
              body: "Istället för att användaren ska fylla i ett formulär med 15 fält — låt dem berätta vad de behöver och fyll i fälten åt dem. Istället för att de ska hitta rätt inställning i en komplex produkt — ge dem ett naturligt språk-interface för de vanligaste uppgifterna. AI som osynlig assistent, inte som synlig feature.",
              examples: ["Formulärifyllning via naturligt språk", "In-app AI-assistent för komplexa produkter", "Smarta genvägar baserade på beteende"],
            },
          ].map((item) => (
            <div key={item.num} className="mt-8 rounded-2xl border border-line p-7">
              <div className="flex items-start gap-4">
                <span className="font-mono text-2xl font-bold text-brand/30">{item.num}</span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-text">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Exempel</p>
                    <ul className="mt-2 space-y-1">
                      {item.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm text-text">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Section 3: Demoeffekten */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Den kostsamma demoeffekten
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Det finns ett fenomen vi kallar demoeffekten. Det ser ut såhär: ett team implementerar en AI-funktion. I demo är den imponerande. I produktion, med riktiga användare och riktiga variationer i input, fallerar den på 20–40 % av fallen. Ingen förstår varför. Fixa är svåra. Förtroendet eroderar.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-7">
            <div className="flex items-start gap-3">
              <IconWarning />
              <div>
                <p className="font-semibold text-amber-800">Varningssignaler att känna igen</p>
                <ul className="mt-3 space-y-2">
                  {[
                    "Funktionen fungerar utmärkt i demoscenario men kollapsar på edge cases",
                    "Latensen gör det oanvändbart i realtidskontexten den ska fungera i",
                    "Kostnaden per API-anrop skalas inte med antalet användare",
                    "AI-svaret är icke-deterministiskt och skapar förvirring i strukturerade flöden",
                    "Ingen fallback existerar om modellen är nere eller svarar felaktigt",
                    "Funktionen träffar modellen direkt — ingen guardrail, validering eller sanity check",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-amber-800">
                      <IconWarning />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted">
            Demoeffekten uppstår nästan alltid av samma orsak: man har byggt en proof of concept och kallat det en feature. En riktig produktionsfärdig AI-feature kräver prompt engineering, fallback-logik, monitoring, testning mot representativa data och en plan för när modellen uppför sig oväntat.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Det är inte mer komplicerat än annan produktutveckling — det kräver bara att man tar det på allvar från start.
          </p>
        </section>

        {/* Section 4: Beslutsmodellen */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Fem frågor att ställa innan ni implementerar AI
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Vi använder en enkel beslutsmodell med fem frågor när vi utvärderar om AI är rätt för en specifik funktion. Fem ja-svar: grönt ljus. Tre eller fler nej: gå tillbaka till ritbordet.
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                num: 1,
                q: "Finns det ett tydligt, avgränsat problem AI ska lösa?",
                yes: "AI vet vilken uppgift den har.",
                no: "AI blir ett svar utan fråga — dyrt och ineffektivt.",
              },
              {
                num: 2,
                q: "Har ni tillgång till tillräckligt med representativ data (för ML) eller ett tydligt prompt-case (för LLM)?",
                yes: "Modellen kan tränas eller kalibreras korrekt.",
                no: "Output blir opålitlig och demoeffekten väntar.",
              },
              {
                num: 3,
                q: "Är kostnaden per anrop i paritet med värdet det skapar för användaren?",
                yes: "Ekonomin i funktionen är hållbar i skala.",
                no: "Ni betalar mer för AI än ni tjänar på värdet det skapar.",
              },
              {
                num: 4,
                q: "Har ni en plan för när AI-svaret är fel eller modellen är otillgänglig?",
                yes: "Produkten fungerar även utan AI — degradat men fungerande.",
                no: "En driftstörning i modellen slår ut hela funktionen.",
              },
              {
                num: 5,
                q: "Förstår användarna att de interagerar med AI, och är de okej med det?",
                yes: "Förtroendet är intakt och användarförväntningarna är satta rätt.",
                no: "Ni riskerar en backlash om (när) AI svarar felaktigt.",
              },
            ].map((item) => (
              <div key={item.num} className="overflow-hidden rounded-xl border border-line">
                <div className="flex items-start gap-4 bg-[#F8FAFC] px-6 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-bg">
                    {item.num}
                  </span>
                  <p className="font-medium text-text">{item.q}</p>
                </div>
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line">
                  <div className="flex items-start gap-2 px-6 py-4">
                    <IconCheck />
                    <p className="text-sm text-muted"><span className="font-medium text-text">Ja: </span>{item.yes}</p>
                  </div>
                  <div className="flex items-start gap-2 px-6 py-4">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-muted"><span className="font-medium text-text">Nej: </span>{item.no}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inline lead magnet */}
          <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 p-7">
            <div className="flex items-start gap-5">
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                <svg className="h-6 w-6 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">GRATIS GUIDE</p>
                <h3 className="mt-1 font-display text-base font-bold text-text">
                  Ladda ned AI-beslutsmodellen som PDF
                </h3>
                <p className="mt-1 text-sm text-muted">
                  En utökad version av de fem frågorna ovan — med bedömningsmatris, exempel och ett arbetsblad för att utvärdera ett specifikt use case i ert projekt.
                </p>
                <Link
                  href="/resurser"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  Hämta guiden gratis →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Tekniska val */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Tekniska val — vad ni faktiskt behöver bestämma
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            När beslutet att implementera AI är fattat uppstår en mängd tekniska frågor. Här är de som vi ser ha störst påverkan på utfall.
          </p>

          <h3 className="mt-8 font-display text-xl font-semibold text-text">API vs. egna modeller</h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            För de flesta produkter är svaret att använda ett API: OpenAI, Anthropic (Claude), Google (Gemini) eller Mistral. Det ger tillgång till state-of-the-art modeller utan att ni behöver träna, hålla eller skala infrastruktur. Kostnaden är förutsägbar och faller kontinuerligt. Egna modeller gör bara ekonomisk mening vid mycket hög volym, starka datasekretesskrav eller behov av domänspecifik fintuning som ett API inte kan matcha.
          </p>

          <h3 className="mt-8 font-display text-xl font-semibold text-text">RAG — Retrieval-Augmented Generation</h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Om er AI-funktion ska svara på frågor om er specifika data — produktkatalog, kunskapsbas, kunddata — är RAG ofta rätt arkitektur. Istället för att träna en modell på er data hämtar man relevant information dynamiskt och skickar den som kontext till LLM:en. Det är snabbare att bygga, billigare att underhålla och faktauppdateringar kräver ingen omträning.
          </p>

          <h3 className="mt-8 font-display text-xl font-semibold text-text">Strukturerad output och validering</h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Moderna API:er stöder structured output — AI svarar med JSON som matchar ett schema ni definierar. Det är avgörande för att integrera AI i produktflöden utan att behöva parsa fri text. Kombinerat med Zod eller liknande valideringsbibliotek skapar det ett robust lager som fångar fel innan de når användaren.
          </p>

          <h3 className="mt-8 font-display text-xl font-semibold text-text">Caching och kostnadskontroll</h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            AI-anrop kostar pengar. I produkter med hög volym och liknande queries är caching av svar (på prompt-hash-nivå) en av de snabbaste sätten att sänka kostnaden utan att kompromissa med upplevelsen. Sätt upp monitoring på token-förbrukning tidigt — det är lätt att glömma och svårt att åtgärda retroaktivt.
          </p>
        </section>

        {/* Section 6: Case-exempel */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Hur vi ser det i praktiken
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Teorin är en sak. Här är hur AI-besluten faktiskt sett ut i projekt vi jobbat med.
          </p>

          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-line p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">CASE: MIN ODLING</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-text">AI-växtidentifiering som kärnutbyte</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                I Min Odling-appen var en av de mest efterfrågade funktionerna att identifiera växter via kameran. Alternativet var en statisk sök-databas. AI-identifiering svarade på en tydlig fråga (vad är det här?), levererade ett svar med hög precision i rätt kontext (foton av växter) och fallbacker elegant till en manuell sökning när säkerheten är låg. Det är ett textboksexempel på AI som löser rätt problem på rätt sätt.
              </p>
              <Link href="/case-studies/min-odling" className="mt-4 inline-flex items-center text-sm font-medium text-brand hover:underline underline-offset-2">
                Läs hela casen →
              </Link>
            </div>

            <div className="rounded-2xl border border-line p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">CASE: CMS ONLINE</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-text">AI är inte svaret på varje problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                I CMS Onlines e-handelsplattform diskuterades tidigt om AI skulle användas för produktkategorisering. Analysen visade att de befintliga Shopify- och Starweb-API:erna redan hade välstrukturerad data och att kategorisering redan skedde korrekt med regelbaserad logik. Att lägga AI ovanpå det hade inneburit kostnad och komplexitet utan mervärde. Vi valde bort AI i det sammanhanget — och det var rätt beslut.
              </p>
              <Link href="/case-studies/cms-online" className="mt-4 inline-flex items-center text-sm font-medium text-brand hover:underline underline-offset-2">
                Läs hela casen →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 7: Få hjälp */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Hur ni kommer igång utan att köpa för mycket
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Det vanligaste misstaget vi ser är inte att ett bolag väljer AI för tidigt. Det är att de investerar i en stor AI-satsning utan att ha validerat en enda use case i produktion med riktiga användare.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            En bättre approach:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "Välj en enda, avgränsad funktion med ett tydligt framgångsmått (t.ex. 30 % snabbare uppgift X för användare Y).",
              "Bygg den på 2–4 veckor med rätt stack — API + strukturerad output + validering + fallback.",
              "Mät utfallet i produktion med riktiga användare under 4 veckor.",
              "Besluta baserat på data om ni ska expandera, anpassa eller skrota funktionen.",
              "Iterera — AI-features förbättras ofta markant med rätt prompt-justeringar och bättre kontext.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-base text-muted">
                <IconCheck />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Det kräver disciplin att starta litet — men det är skillnaden mellan en AI-feature som skapar värde och en som kostar mer att underhålla än den är värd.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Vill ni ha hjälp att utforma ett konkret AI-use case och ta det från idé till produktion? Vi hjälper er i ett kortare sprint-format.
          </p>
        </section>

        {/* Final CTA */}
        <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-[#EFF6FF] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">NÄSTA STEG</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text">
            Boka ett AI Sprint — från idé till produktion på fyra veckor
          </h2>
          <p className="mt-3 text-base text-muted">
            Vi hjälper er definiera rätt AI-use case, designa arkitekturen och leverera en produktionsklar feature. Inget fluff, ingen överdimensionerad lösning.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/kontakt?paket=ai-sprint"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-8 text-sm font-semibold text-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              Boka AI Sprint →
            </Link>
            <Link
              href="/resurser"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-bg px-8 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              Ladda ned AI-beslutsguiden
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted">
            Se hur vi jobbat med AI tidigare:{" "}
            <Link href="/case-studies/min-odling" className="text-brand hover:underline">Min Odling</Link>
            {" "}·{" "}
            <Link href="/vibecoding" className="text-brand hover:underline">Läs vibecoding-guiden</Link>
          </p>
        </div>

      </div>
    </>
  );
}
