import type { Metadata } from "next";
import Link from "next/link";
import { articleSchema } from "@/lib/schema";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/vibecoding",
    fallbackTitle: "Vibecoding: så bygger moderna team digitala produkter med AI 2026",
    fallbackDescription:
      "En djupgående guide till vibecoding — vad det är, vilka verktyg som används, hur arbetsflöden ser ut och när metoden passar bäst för ett produktteam.",
    keywords: [
      "vibecoding",
      "vibecoding guide",
      "ai-assisterad utveckling",
      "ai i produktutveckling",
      "claude code",
      "cursor ai",
      "modern produktutveckling",
      "ai verktyg för utvecklare",
    ],
  });
}

/* ── TOC items ──────────────────────────────────────────────────────────────── */

const tocItems = [
  { id: "vad-ar-vibecoding",   label: "Vad är vibecoding?" },
  { id: "vs-klassisk",         label: "Vibecoding vs klassisk utveckling" },
  { id: "verktygen",           label: "Verktygen som gör det möjligt" },
  { id: "arbetsfloden",        label: "Arbetsflöden som fungerar" },
  { id: "misstag",             label: "Vanliga misstag" },
  { id: "nar-det-passar",      label: "När vibecoding passar" },
  { id: "framtiden",           label: "Framtiden för vibecoding" },
  { id: "hur-vibedev-jobbar",  label: "Hur VibeDev jobbar" },
];

/* ── Inline icons ────────────────────────────────────────────────────────────── */

function IconCheck() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function VibeCodingPage() {
  const publishedAt = "2026-01-15";

  const articleLd = articleSchema({
    title: "Vibecoding: så bygger moderna team digitala produkter med AI 2026",
    description:
      "En djupgående guide till vibecoding — vad det är, vilka verktyg som används, hur arbetsflöden ser ut och när metoden passar bäst för ett produktteam.",
    path: "/vibecoding",
    publishedAt,
    keywords: ["vibecoding", "ai-assisterad utveckling", "claude code", "cursor ai", "modern produktutveckling"],
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",         url: siteConfig.url },
    { name: "Vibecoding",  url: `${siteConfig.url}/vibecoding` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-gradient-to-b from-bg to-[#EFF6FF] px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">GUIDE · UPPDATERAD 2026</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Vibecoding: så bygger moderna team digitala produkter med AI
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Från Andrej Karpathys tweet till en konkret arbetsmetod — en djupgående genomgång av vad vibecoding faktiskt innebär, vilka verktyg som används och hur team börjar bygga snabbare utan att kompromissa med kvalitet.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted">
            <span>Av VibeDev</span>
            <span aria-hidden="true">·</span>
            <span>Ca 15 min läsning</span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>Januari 2026</time>
          </div>
        </div>
      </div>

      {/* ── Content + TOC ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="lg:flex lg:gap-16">

          {/* Main article */}
          <article className="min-w-0 flex-1 prose-custom">

            {/* TL;DR box */}
            <div className="mb-12 rounded-2xl border border-brand/20 bg-brand/5 p-7">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">TL;DR</p>
              <ul className="space-y-2">
                {[
                  "Vibecoding innebär att använda AI-verktyg som Claude Code, Cursor och v0 som aktiva medarbetare i hela produktcykeln — inte bara för att skriva kod.",
                  "Moderna team bygger 2–5× snabbare utan att sänka kvaliteten, när senior kompetens styr arkitekturen och AI hanterar det repetitiva.",
                  "Rätt metod: tydliga kontexter och specs till AI, frekventa reviews, små commits och mänskligt ansvar för arkitektur och affärsbeslut.",
                  "Vibecoding passar bäst för MVPs, webbappar, komponenter och iterativa produktflöden — sämre för säkerhetskritisk kod eller djupt domänspecifik logik.",
                  "VibeDev har jobbat med vibecoding sedan 2024 och levererar produkter på en tredjedel av klassisk estimerad ledtid.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-text">
                    <IconCheck />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 1 */}
            <section id="vad-ar-vibecoding" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Vad är vibecoding egentligen?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Termen myntades i januari 2025 av AI-forskaren Andrej Karpathy — en av grundarna bakom OpenAI och tidigare AI-chef på Tesla — i ett inlägg på X där han beskrev hur han byggde program genom att "ge sig hän åt vibbar" med AI-assistans. Karpathys ursprungliga definition var lekfull, nästan provokativ: att man låter AI skriva koden och nästan slutar att förstå varje rad på djupet.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Men begreppet har vuxit långt bortom den ursprungliga tweetens gränser. I dag beskriver vibecoding en bredare filosofi för hur moderna produktteam arbetar: ett flöde där AI-verktyg är integrerade i hela cykeln — från idé och spec, via prototyp och komponentbygge, till review och refaktorering — och där tempot är väsentligt högre än i traditionell utveckling utan att kvaliteten offras.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Nyckeln är <em>kombinationen</em> av snabb AI-generering och mänskligt senioromdöme. Vibecoding i sin bästa form är inte att blint acceptera allt AI producerar — det är att använda AI som en extremt kompetent men oinformerad kollega som behöver tydliga kontexter, bra specs och kontinuerlig feedback för att producera rätt saker.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Simon Willison, som länge skrivit om AI-assisterad utveckling, sammanfattar det väl: skillnaden mellan bra och dålig vibecoding är om du förstår koden som AI genererar. Om du inte förstår den kan du inte felsöka, inte driva den vidare och inte ta ansvar för den. Om du förstår den — och använder AI för att producera den snabbare — skapar du genuint hävstång.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Varför exploderade intresset 2025–2026?</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Tre saker sammanföll: modellerna blev tillräckligt bra (GPT-4, Claude 3, Gemini Ultra), verktygen blev tillräckligt smidiga (Cursor, Claude Code, v0) och kontextfönstren blev tillräckligt stora för att hålla hela kodbaser i arbetsminnet. Det är inte längre en nischpraxis för tidiga adopters — det är mainstream i de snabbaste produktteamen.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Enligt GitHubs State of the Octoverse 2025 använde 92 % av professionella utvecklare AI-verktyg i sitt dagliga arbete. Bland de snabbaste startupteamen är siffran 100 %. Frågan är inte längre <em>om</em> man ska använda AI i utveckling — utan <em>hur</em> man gör det rätt.
              </p>
            </section>

            {/* Section 2 */}
            <section id="vs-klassisk" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Vibecoding vs klassisk utveckling — vad är egentligen annorlunda?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Klassisk mjukvaruutveckling är en välkalibrerad process: kravanalys, design, implementation, testning, deployment. Varje steg har sina roller — produktägare, designer, frontend-utvecklare, backend-utvecklare, QA. Kommunikationen sker i handoffs, estimat är veckovisa och velocity mäts i story points.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Vibecoding bryter inte nödvändigtvis den strukturen. Vad det gör är att komprimera implementation och iteration dramatiskt — vilket förändrar dynamiken i hela teamet.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line bg-[#F8FAFC]">
                      <th className="px-6 py-4 text-left font-semibold text-text">Dimension</th>
                      <th className="px-6 py-4 text-left font-semibold text-brand">Vibecoding</th>
                      <th className="px-6 py-4 text-left font-semibold text-text">Klassisk utveckling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {[
                      ["Komponentbygge", "Minuter per komponent", "Timmar per komponent"],
                      ["Prototyp → MVP", "1–2 veckor", "4–8 veckor"],
                      ["Feedback-loop", "Kontinuerlig, per commit", "Sprint-baserad (2-4 v)"],
                      ["Rollstruktur", "Generalist + AI", "Specialiserade roller"],
                      ["Kodgranskning", "Senior + AI-analys", "Senior manuellt"],
                      ["Dokumentation", "AI-genererad inline", "Manuellt, ofta eftersläpande"],
                      ["Teknisk skuld", "Risk om utan review", "Risk om utan prioritering"],
                    ].map(([dim, vibe, classic]) => (
                      <tr key={dim} className="hover:bg-[#F8FAFC]/50">
                        <td className="px-6 py-3.5 font-medium text-text">{dim}</td>
                        <td className="px-6 py-3.5 text-brand">{vibe}</td>
                        <td className="px-6 py-3.5 text-muted">{classic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-base leading-relaxed text-muted">
                Den viktigaste skillnaden är inte hastigheten i sig — det är vad ökad hastighet <em>möjliggör</em>. När implementationstiden halveras kan ett produktteam iterera snabbare, testa fler hypoteser och nå rätt lösning utan att investera månader i fel riktning. Det är en strategisk fördel, inte bara en operationell.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                En viktig anmärkning: vibecoding kräver fortfarande seniora produktbeslut. AI vet inte vad som är rätt att bygga — det vet bara hur man bygger det man ber om. Arkitektur, prioritering, UX-beslut och affärslogik måste fortfarande ägas av kompetenta människor. AI är en kraftmultiplikator, inte en ersättare.
              </p>
            </section>

            {/* Section 3 */}
            <section id="verktygen" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Verktygen som gör vibecoding möjligt
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Ekosystemet runt AI-assisterad utveckling växer snabbt. Här är de verktyg som 2025–2026 är standard i de mest produktiva teamen — och vad de faktiskt är bäst på.
              </p>

              {[
                {
                  name: "Claude Code (Anthropic)",
                  tagline: "Agentic terminal-baserat verktyg för hela kodbaser",
                  body: "Claude Code är ett terminal-verktyg som låter dig ge Claudes intelligens tillgång till hela din kodbas — läsa filer, skriva kod, köra tester, committa ändringar och refaktorera på ett koordinerat sätt. Skillnaden mot inline-suggestions är att Claude Code kan hålla kontext över hela projektet och utföra sekvenser av åtgärder utan att du behöver klippa och klistra. Det är ett av de starkaste verktygen för refaktorering, komplexa features och kodbase-wide changes.",
                  best: "Refaktorering, komplexa features, multi-fil-ändringar, testgenerering",
                },
                {
                  name: "Cursor",
                  tagline: "VS Code med djup AI-integration",
                  body: "Cursor är en fork av VS Code med inbyggd AI på editor-nivå. Det erbjuder Cmd+K för inline editeringar, en chatt-sidebar med kontext om hela kodbasen och ett Agent-läge som kan exekvera mer komplexa ändringar. Cursor är ett av de mest adopterade verktygen bland professionella utvecklare 2025 — framförallt tack vare att den känns som VS Code men snabbare.",
                  best: "Inline kodgenerering, snabb prototyping, dagligt kodarbete",
                },
                {
                  name: "v0 by Vercel",
                  tagline: "UI-generering direkt till React/Tailwind",
                  body: "v0 är Vercels verktyg för att generera UI-komponenter från text eller bild. Skriv 'en inloggningssida med email/password och glömt-lösenord-länk' och få tillbaka en komplett React-komponent med Tailwind-styling. Det är ett extremt snabbt sätt att komma igång med UI-arbete — man justerar och anpassar hellre än att börja från noll.",
                  best: "UI-prototyper, komponentgenerering, design-till-kod",
                },
                {
                  name: "GitHub Copilot",
                  tagline: "Inline-suggestions i din befintliga miljö",
                  body: "Copilot är fortfarande det mest spridda AI-verktyget för kod tack vare sin bredd av IDE-stöd. Det fungerar som ett autocompletion-lager på steroider — det förutser nästa rad eller block baserat på kontext. Inte det kraftfullaste verktyget ensamt, men oumbärligt för många utvecklare som ett komplement till djupare AI-agenter.",
                  best: "Snabb inline-completion, repetitiv kod, boilerplate",
                },
                {
                  name: "Replit",
                  tagline: "Browser-baserad IDE med integrerad AI-agent",
                  body: "Replit är ett webbläsar-baserat utvecklingsverktyg som låter dig bygga och deploya appar utan lokal miljö. Deras AI-agent kan generera hela appar från en beskrivning och deploya dem direkt. Perfekt för snabba prototyper, demos och situationer där du inte vill sätta upp lokal miljö — men bäst av allt för icke-tekniska grundare som vill visa upp en idé.",
                  best: "Snabba demos, prototyper utan lokal miljö, icke-tekniska grundare",
                },
              ].map((tool) => (
                <div key={tool.name} className="mt-8 rounded-2xl border border-line bg-bg p-7 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-text">{tool.name}</h3>
                      <p className="mt-0.5 text-sm text-brand">{tool.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{tool.body}</p>
                  <p className="mt-3 text-xs font-semibold text-text">
                    <span className="text-muted">Bäst för: </span>{tool.best}
                  </p>
                </div>
              ))}

              <p className="mt-8 text-base leading-relaxed text-muted">
                Verktygen fortsätter att utvecklas snabbt. Det viktigaste att förstå är att inget enskilt verktyg är "rätt svar" — de bästa teamen använder typiskt 2–3 verktyg i kombination beroende på uppgift. Se{" "}
                <Link href="/resurser" className="font-medium text-brand underline-offset-2 hover:underline">
                  vår resursguide
                </Link>{" "}
                för att ladda ned en PDF med en utförligare jämförelseöversikt.
              </p>
            </section>

            {/* Section 4 */}
            <section id="arbetsfloden" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Arbetsflöden som faktiskt fungerar
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Vibecoding är inte ett verktyg — det är ett sätt att tänka och strukturera arbete. Här är de konkreta arbetsflöden som skilje riktigt snabba team från team som börjar använda AI men inte ser dramatiska resultat.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">1. Spec-first, inte kod-first</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Det vanligaste misstaget nybörjare gör är att be AI att "skriva en funktion som gör X" utan kontext. AI-modeller producerar generell kod när de får generella instruktioner. De producerar bra kod när de får tydliga specifikationer.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Arbetsflödet ser ut såhär: skriv en kort spec-fil (150–300 ord) som beskriver vad komponenten ska göra, vilka edge cases som gäller, vilka externa beroenden som finns och vilken befintlig kod den ska integrera med. Ge sedan AI-verktyget den filen som kontext. Kvaliteten på output ökar markant.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">2. Kontext är allt</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                AI-verktyg med kod-kontext (som Claude Code och Cursor) presterar avsevärt bättre när de har tillgång till relevanta filer, typdefinitioner och befintliga mönster i din kodbas. Lägg ned 5 minuter på att peka ut vilka filer som är relevanta och du sparar 30 minuter av fel och omgörning.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                En tumregel: ge AI-verktyget minst en befintlig, fungerande komponent som den nya ska likna — "implementera X på samma sätt som Y" ger konsekventare resultat än att börja från blank.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">3. Små iterationer, frekventa reviews</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                En av de vanligaste fallgroparna är att be AI om för mycket på en gång och sedan sitta med 400 rader kod man aldrig riktigt förstår. Bättre att jobba i steg om 50–100 rader, granska varje steg och committa när det är verifierat.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Git-disiplinen är lika viktig i vibecoding som i klassisk utveckling — kanske mer. Frekventa, välmärkta commits gör det enkelt att rulla tillbaka om ett AI-förslag skapade ett oavsiktligt beroende eller bröt ett flöde.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">4. Testning integrerat i flödet</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                AI-verktyg är utmärkta på att generera tester för kod de just skrivit. Gör det till en vana att explicit be om tester i samma prompt: "Skriv funktionen och lägg till unit tests för de viktigaste fallen." Det är en av de starkaste hävstängerna för att bibehålla kvalitet i ett snabbt tempo.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">5. Mänskligt ägarskap av arkitekturen</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                AI kan föreslå arkitektur men ska aldrig ensam besluta om den. Beslut om databasscheman, API-design, autentiseringsflöden, cachingstrategier och skalningshypoteser kräver mänsklig kompetens och affärsförståelse. Bygg en kultur där arkitekturdokument granskas av senior ingenjör — oavsett om de är AI-genererade eller inte.
              </p>
            </section>

            {/* Section 5 */}
            <section id="misstag" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Vanliga misstag — och hur du undviker dem
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Vi har jobbat med vibecoding sedan tidigt och sett de mönster som delar snabba team från team som krockar. Här är de sex vanligaste felen.
              </p>

              <div className="mt-6 space-y-5">
                {[
                  {
                    title: "Acceptera all output utan review",
                    body: "AI-modeller kan producera korrekt-utseende kod med subtila logikfel, säkerhetsproblem eller dåliga prestanda-karaktäristika. Att acceptera output utan att förstå den är den enda garantin för att teknisk skuld byggs upp snabbt.",
                    fix: "Läs alltid koden. Om du inte förstår ett block — fråga AI att förklara det. Om du ändå inte förstår — skriv om det.",
                  },
                  {
                    title: "Börja för stort",
                    body: "En vanlig nybörjarprompt: 'Bygg hela inloggningssystemet med OAuth, email-verifikation, lösenordsåterställning och admin-flöden.' Resultatet är en flod av kod som är svår att granska och ofta innehåller inkonsekvenser.",
                    fix: "Dela upp i diskreta delar. Bygg email-inloggning först. Verifiera. Sedan OAuth. Sedan admin-flödet. Steg för steg.",
                  },
                  {
                    title: "Ingen kontexthantering",
                    body: "Att börja varje AI-session från noll — utan att ge kontext om kodbasen, arkitekturen och befintliga mönster — resulterar i inkonsekvent kod som inte stämmer med projektets stil och beroenden.",
                    fix: "Skapa ett litet CONTEXT.md-dokument för projektet. Lägg in det i varje ny session eller ge det som kontextfil i Claude Code/Cursor.",
                  },
                  {
                    title: "Hoppa över tester",
                    body: "Vibecoding lockar till snabbhet — och tester känns som bromsar. I verkligheten är ett bra test-coverage det enda skyddsnätet som gör att man kan röra sig fort över tid utan att rädslan för regression bromsar.",
                    fix: "Be AI generera tester i samma prompt som funktionen. Det kostar nästan ingenting och sparar enormt.",
                  },
                  {
                    title: "Blanda ihop AI-fel med buggar i systemet",
                    body: "AI kan generera kod som ser korrekt ut men introducerar edge cases som dyker upp i produktion. Utan tydlig commit-historia och kodgranskning är de svåra att spåra.",
                    fix: "Commit ofta. Använd beskrivande commit-meddelanden. Granska diff:en innan du pushar.",
                  },
                  {
                    title: "Ingen exit-strategi från AI-beroende",
                    body: "Kod som är fullt genererad av AI och aldrig granskats av en mänsklig ingenjör är en tidsinvestering i framtida teknisk skuld. Teamet vet inte vad koden gör — och om AI:n slutar fungera som förväntat finns ingen kompetens att ta vid.",
                    fix: "Investera i att förstå koden. Håll en 'kodägar-princip' — minst en person i teamet ska kunna förklara och vidareutveckla varje kritisk modul.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-line p-6">
                    <div className="flex items-start gap-3">
                      <IconX />
                      <h3 className="font-display text-base font-semibold text-text">{item.title}</h3>
                    </div>
                    <p className="mt-2 pl-7 text-sm leading-relaxed text-muted">{item.body}</p>
                    <div className="mt-3 flex items-start gap-2 pl-7">
                      <IconCheck />
                      <p className="text-sm font-medium leading-relaxed text-text">
                        <span className="text-brand">Lösning: </span>{item.fix}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 */}
            <section id="nar-det-passar" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                När vibecoding passar — och när det inte gör det
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Vibecoding är inte ett universalverktyg. Det är kraftfullt i rätt sammanhang och potentiellt riskabelt i fel. Här är en ärlig genomgång.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-7">
                  <h3 className="font-display text-base font-bold text-green-800">Passar utmärkt</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "MVPs och proof of concepts — snabb tid till marknaden är avgörande",
                      "CRUD-appar, dashboards och adminpaneler — välkänd struktur som AI är tränad på",
                      "Komponentbibliotek och UI — v0 och Cursor genererar skarp UI snabbt",
                      "Integrationskod mot välkända API:er — Stripe, Resend, Supabase, etc.",
                      "Intern tooling och automationsscript — snabbt värde utan produktionskrav",
                      "Testgenerering — AI är utmärkt på att skriva systematiska tester",
                      "Dokumentation och kommentarer — notoriskt eftersatt, AI fyller igen gapet",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                        <IconCheck />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-7">
                  <h3 className="font-display text-base font-bold text-red-800">Kräver extra försiktighet</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Säkerhetskritisk kod — autentisering, kryptografi, betalningsflöden",
                      "Högt domänspecifik logik — medicinsk, legal eller finansiell beräkning",
                      "Systemprogrammering och lågniväkod — kompilerare, drivrutiner, OS-komponenter",
                      "Kod utan tester — AI-genererad kod utan testtäckning är en tidsinvestering i skuld",
                      "Beslut om dataarkitektur — schemaändringar med stora konsekvenser",
                      "Migrering av legacy-system — kräver djup kontextuell förståelse",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                        <IconX />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-base leading-relaxed text-muted">
                En praktisk tumregel: om felet kostar pengar direkt eller skapar juridiska risker bör AI-genererad kod ha mänsklig granskning av en specialist innan den når produktion. Om felet är hanterbart och reverserbart kan vibecoding gå snabbt. Se{" "}
                <Link href="/blogg/ai-i-din-produkt" className="font-medium text-brand underline-offset-2 hover:underline">
                  vår guide om AI i digitala produkter
                </Link>{" "}
                för en beslutsmodell kring just detta.
              </p>
            </section>

            {/* Section 7 */}
            <section id="framtiden" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Framtiden för vibecoding
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                AI-assisterad utveckling är inte en topp — det är en grundförändring i hur mjukvara skapas. Baserat på den trajectory vi sett sedan 2023 är det rimligt att förvänta sig följande under de närmaste åren.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Multi-agentsystem tar mer ansvar</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                I dag är det vanligt med en AI-agent som hjälper en utvecklare. Inom 1–2 år ser vi allt mer av parallella agenter som koordinerar — en agent som skriver tester, en som skriver implementation, en som granskar mot säkerhetsmönster, en som uppdaterar dokumentationen. Mänsklig roll blir mer och mer den som sätter mål, granskar kritiska beslut och hanterar affärslogik.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Den seniora rollen förändras, försvinner inte</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Det råder en falsk berättelse om att AI ersätter utvecklare. Det stämmer inte för seniora ingenjörer. Vad som händer är att rollen förskjuts — från implementation mot arkitektur, produktbeslut och review. Den senior ingenjör som kan röra sig snabbt med AI och har stark produktsense är mer värdefull nu än någonsin. Den junior ingenjör som bara kan skriva boilerplate-kod tappar sin nisch snabbare.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Produktteam konvergerar</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Gränsen mellan designer, produktchef och utvecklare suddas ut gradvis. Med verktyg som v0 och Cursor kan en designer generera fungerande React-komponenter. En produktchef kan prototypa ett flöde i Replit utan att involvera ett dev-team. Specialistrollerna lever kvar — men generalistkompetens kombinerat med AI-verktyg öppnar för nya hybridroller som inte hade funnits för tre år sedan.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Kod som är "skriven av AI" slutar vara en distinktion</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Frågan "är den här koden AI-genererad?" är meningslös om ett år. All kod granskas, testas och ägs av ingenjörer — ursprunget spelar mindre roll. Det som spelar roll är om koden fungerar korrekt, håller sig läsbar, är vältestad och är förståelig för teamet. Det är en ingenjörsfråga, inte en AI-fråga.
              </p>
            </section>

            {/* Section 8 */}
            <section id="hur-vibedev-jobbar" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Hur VibeDev arbetar med vibecoding
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Vi har jobbat med AI-assisterad produktutveckling sedan innan "vibecoding" var ett begrepp. Här är hur det ser ut i praktiken i de projekt vi driver.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Verktygsstacken</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Vi använder <strong>Claude Code</strong> som primärt agentic-verktyg för komplexa refaktoreringar, multi-fil-ändringar och kod-review. <strong>Cursor</strong> är standardredigeraren för alla utvecklare i teamet. <strong>v0</strong> används i tidiga UI-faser för att snabbt generera komponentstrukturer som sedan förfinas. <strong>Claude</strong> används för spec-skrivning, PR-beskrivningar, teststrategier och teknisk dokumentation.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Vad det innebär för kunder</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Det praktiska resultatet för kunder är att leveranstider är markant kortare än branschstandard utan att vi sänker vår standard på arkitektur eller testkvalitet. En MVP som typiskt tar 12 veckor i ett klassiskt team tar oss 4–6 veckor. Det frigör budget för iteration — vilket är det som faktiskt avgör om en produkt lyckas på marknaden.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Se hur det sett ut i praktiken: vi byggde{" "}
                <Link href="/case-studies/cms-online" className="font-medium text-brand underline-offset-2 hover:underline">
                  CMS Onlines e-handelsplattform
                </Link>{" "}
                med full integration mot Fortnox, Shopify och Starweb på en tidslinje som förvånade deras tidigare byrå. Vi byggde{" "}
                <Link href="/case-studies/min-odling" className="font-medium text-brand underline-offset-2 hover:underline">
                  Min Odlings community-app
                </Link>{" "}
                med AI-växtidentifiering, socialt flöde och personlig kalender parallellt.
              </p>

              <h3 className="mt-8 font-display text-xl font-semibold text-text">Senior kompetens driver riktningen — AI driver tempot</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Det är vår grundprincip och vi avviker aldrig från den. AI-verktyg är kraftmultiplikatorer för seniora ingenjörer — de är inte ersättare. Alla arkitekturbeslut, alla produktprioriteringar och all säkerhetsgranskning görs av erfarna människor. Det är det som avgör om vibecoding skapar värde på lång sikt eller skapar teknisk skuld.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Är du nyfiken på hur vi kan använda vibecoding för att accelerera ert projekt? Vi berättar gärna mer i ett kortare samtal.
              </p>
            </section>

            {/* Final CTA */}
            <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-[#EFF6FF] p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">NÄSTA STEG</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text">
                Vill ni jobba med vibecoding på riktigt?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-muted">
                Vi berättar hur vi jobbat med liknande projekt och vad ni realistiskt kan förvänta er i termer av tempo, kostnad och resultat. Kostnadsfritt, 30 minuter.
              </p>
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/boka-mote"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-8 text-sm font-semibold text-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  Boka samtal →
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-bg px-8 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  Se våra case-studies
                </Link>
              </div>
              <p className="mt-5 text-xs text-muted">
                Eller utforska{" "}
                <Link href="/tjanster" className="text-brand hover:underline">våra tjänster</Link>
                {" "}·{" "}
                <Link href="/resurser" className="text-brand hover:underline">ladda ned guider</Link>
              </p>
            </div>

          </article>

          {/* ── Sticky TOC sidebar ─────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">INNEHÅLL</p>
              <nav aria-label="Sidinnehåll">
                <ol className="space-y-1">
                  {tocItems.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-line/40 hover:text-text"
                      >
                        <span className="mt-px w-4 shrink-0 text-xs font-mono text-muted/50">{String(i + 1).padStart(2, "0")}</span>
                        <span className="leading-snug">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Quick links */}
              <div className="mt-8 rounded-xl border border-line p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Läs också</p>
                <ul className="space-y-2">
                  {[
                    { href: "/blogg/ai-i-din-produkt", label: "AI i din produkt — guide" },
                    { href: "/tjanster", label: "Våra tjänster" },
                    { href: "/resurser", label: "Gratis resurser" },
                    { href: "/case-studies", label: "Kundcases" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-xs text-brand hover:underline underline-offset-2">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
