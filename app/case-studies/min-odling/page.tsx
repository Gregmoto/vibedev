import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Section } from "@/components/ui/section";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { getBreadcrumbSchema, getCaseStudySchema } from "@/lib/seo/jsonld";
import { getPublishedCaseStudies } from "@/lib/cms-public";
import { siteConfig, createMetadata } from "@/lib/metadata";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = createMetadata(
  "Min Odling — Hur vi byggde en odlings-app som används året runt | VibeDev",
  "Vi byggde Min Odling: tvärplattformsapp med AI-växtidentifiering, zonbaserad odlingskalender och community för svenska hobbyodlare. Läs om React Native, nordisk AI-modell och säsongsbunden retention.",
  "/case-studies/min-odling",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Min Odling",   url: `${siteConfig.url}/case-studies/min-odling` },
  ]),
  getCaseStudySchema({
    slug:        "min-odling",
    projectName: "Min Odling",
    summary:
      "Tvärplattformsapp för svenska hobbyodlare med AI-växtidentifiering, personlig odlingskalender per zon och socialt community.",
    industry:    "Community & Hortikultur",
    techStack:   ["Next.js", "React Native", "AI-bildigenkänning", "PostgreSQL"],
    publishedAt: "2024-11-01",
  }),
];

/* ── Shared micro-components ──────────────────────────────────────────────── */

function TechPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 text-base leading-[1.85] text-muted ${className}`}>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted sm:text-base">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function MinOdlingPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "min-odling").slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="page-hero border-b border-line/50">
        <Container className="pb-12 pt-20 sm:pb-16 sm:pt-28">
          <div className="surface-elevated max-w-5xl px-6 py-10 sm:px-10 sm:py-14">

            <nav className="mb-6 flex items-center gap-2 text-xs text-muted" aria-label="Brödsmulor">
              <Link href="/case-studies" className="transition hover:text-brand">Case studies</Link>
              <span aria-hidden="true">›</span>
              <span className="text-text">Min Odling</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                COMMUNITY
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Hur vi byggde en odlings-app som används året runt
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              Min Odling är en app som hobbyodlare faktiskt använder — inte bara vid sådd, utan
              året runt. Med AI-baserad växtidentifikation, personlig odlingskalender och socialt
              flöde är det den enda odlings-appen som fungerar i svenska zoner.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "React Native", "AI-bildigenkänning", "PostgreSQL"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om app-projekt</LinkButton>
              <a
                href="https://minodling.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök minodling.se ↗
              </a>
            </div>

          </div>
        </Container>
      </header>

      {/* ── Article + Sidebar ────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          <article className="space-y-14">

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Svenska hobbyodlare är tekniskt underbetjänade
              </h2>
              <Prose>
                <p>
                  Internationella appar antar sydeuropeiska klimat. Svenska odlingsråd ligger
                  spridda på trädgårdstidningar, Facebook-grupper och Google. Ingen samlad
                  digital plats finns — och ändå är hobbyodlare i Sverige fler än man tror.
                </p>
              </Prose>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { q: "Vad är det här för växt?",           tag: "Igenkänning" },
                  { q: "När ska jag så och skörda?",          tag: "Kalender"   },
                  { q: "Hur gör andra odlare här?",           tag: "Community"  },
                  { q: "Hur håller jag koll på vad jag odlat?", tag: "Loggbok" },
                ].map(({ q, tag }) => (
                  <div
                    key={tag}
                    className="flex gap-3 rounded-xl border border-line bg-bg p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                      ?
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text">{q}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted/70">{tag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                Fem sammanlänkade funktioner i en plattform
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">AI-baserad växtidentifikation</h3>
                  <BulletList items={[
                    "Fotografera en växt → appen identifierar art och sort",
                    "Information om växten: krav, hur den odlas, svenska förhållanden",
                    "Inspirerar nybörjare och hjälper rutinerade odlare med okända fynd",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Personlig odlingskalender</h3>
                  <BulletList items={[
                    "Baserad på användarens odlingszon — Sverige delas i 8 zoner",
                    "Personaliserad efter vad användaren faktiskt odlar",
                    "Push-notiser vid kritiska moment: sådd, ompottning, skörd",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Social feed</h3>
                  <BulletList items={[
                    "Odlare i samma region delar bilder och tips",
                    "Kommentera, ställ frågor, dela framgångar",
                    "Bygg \"min trädgård\" som offentlig profil",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Växtbibliotek</h3>
                  <BulletList items={[
                    "Komplett databas med svenska odlingsförhållanden",
                    "Bättre än vad som finns tillgängligt gratis idag",
                    "Kontinuerligt uppdaterat baserat på vad användare lägger till",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Tvärplattform</h3>
                  <BulletList items={[
                    "Native iOS- och Android-app via React Native",
                    "Webb-version för planering vid datorn",
                    "Data synkat sömlöst över alla enheter",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Hur vi tänkte tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Nordisk AI-modell, zonformler och React Native
              </h2>
              <Prose>
                <p>
                  Vi valde React Native för mobil — där 90% av användningen sker — och Next.js
                  för webb. Delad business logic via ett gemensamt API håller nere komplexiteten
                  och gör att vi inte bygger samma sak två gånger.
                </p>
                <p>
                  AI-igenkänningen är det tekniskt mest intressanta. Vi använder en
                  specialtränad modell för växter i nordiskt klimat — generiska modeller som
                  ML Kit fungerade dåligt på svenska vilda växter och ovanliga trädgårdssorter.
                  Modellen kör server-side för att hålla appen liten och göra uppdateringar
                  utan ny app-release möjliga.
                </p>
                <p>
                  Kalenderlogiken är icke-trivial. Sådatum för en tomat skiljer sig mellan
                  zon 1 och zon 8 med flera veckor. Vi modellerar varje växt med en formel
                  snarare än fasta datum — vilket gör att kalendern blir korrekt för varje
                  enskild användares exakta plats, inte en genomsnittlig approximation.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss */}
            <section>
              <SectionLabel>Vad vi lärde oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter om retention, AI och tvärplattform
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Säsongsbundna appar måste vara intressanta i lågsäsong.",
                    body:  "Odling är säsongsbundet — men användarna ska vilja öppna appen även i november. Communityn och planeringen inför nästa säsong löser det. En app som bara används tre månader per år överlever inte.",
                  },
                  {
                    num:   "02",
                    title: "AI-igenkänning skapar wow-effekt som driver retention.",
                    body:  "Första gången en användare fotograferar en växt och appen svarar \"Det här är en Strävlosta\" händer något. Det är ofta det ögonblicket som avgör om appen får finnas kvar på telefonen.",
                  },
                  {
                    num:   "03",
                    title: "Tvärplattform är värt komplexiteten.",
                    body:  "Vi bygger kärnan en gång och får både mobil- och webbversion. För community-data där användare hoppar mellan enheter — foto på mobil, planera vid datorn — är det avgörande för upplevelsen.",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex gap-5 rounded-2xl border border-line bg-bg p-6"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {item.num}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resultatet */}
            <section>
              <SectionLabel>Resultatet</SectionLabel>
              <h2 className="heading-md mb-5">
                En app svenska odlare faktiskt har kvar på telefonen
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Min Odling är idag en app svenska användare{" "}
                  <strong className="font-semibold text-text">öppnar regelbundet</strong> — inte
                  bara i april. Communityn är aktiv, växtidentifieringen är accurate för nordiska
                  förhållanden, och{" "}
                  <strong className="font-semibold text-text">kalendern fungerar korrekt för alla Sveriges åtta odlingszoner</strong>.
                </p>
              </div>
            </section>

          </article>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24">

            <Card variant="outlined" className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                Överblick
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Bransch</dt>
                  <dd className="mt-0.5 text-text">Community & Hortikultur</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Plattformar</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["iOS", "Android", "Webb"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "React Native", "AI", "PostgreSQL"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="pt-1">
                  <a
                    href="https://minodling.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    minodling.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">App med AI och community?</p>
              <p className="body-md mt-3">
                Vi har specifik erfarenhet av tvärplattformsappar med social funktionalitet och
                praktisk AI-integration — från växtidentifiering till rekommendationsmotorer.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href="/boka-mote">Boka strategisamtal</LinkButton>
                <LinkButton href="/tjanster" variant="secondary">
                  Se våra tjänster
                </LinkButton>
              </div>
            </Card>

            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-brand"
            >
              ← Till alla case studies
            </Link>

          </aside>
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <Section>
        <CtaPanel
          eyebrow="Bygger ni en app med community-funktioner och AI?"
          title="Vi har specifik erfarenhet av tvärplattformsappar med social infrastruktur och praktisk AI."
          description="React Native, nordisk AI-modell, zon-baserad logik och community-feed-arkitektur — vi har löst det i produktion och kan göra det igen."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka strategisamtal →</LinkButton>
              <LinkButton href="/kontakt" variant="secondary">Skicka förfrågan</LinkButton>
            </>
          }
        />
      </Section>

      {/* ── Related cases ────────────────────────────────────────────────────── */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fler case</p>
            <h2 className="heading-lg mt-2">Andra projekt vi byggt</h2>
          </div>
          <Link
            href="/case-studies"
            className="shrink-0 text-sm font-medium text-brand transition hover:text-text"
          >
            Se alla →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <CaseStudyCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
