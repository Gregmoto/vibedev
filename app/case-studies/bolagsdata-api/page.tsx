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
  "Bolagsdata API — sökbar databas över Sveriges företag | VibeDev",
  "Vi byggde Bolagsdata API: 3,5 miljoner svenska företag och 360 000+ årsredovisningar, sökbara på under en sekund och tillgängliga via ett gratis API. Läs hur.",
  "/case-studies/bolagsdata-api",
  {
    keywords: [
      "bolagsdata",
      "företagsdatabas",
      "öppna data",
      "bolagsverket api",
      "företags-api sverige",
      "ixbrl årsredovisning",
    ],
  },
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",             url: siteConfig.url },
    { name: "Case studies",    url: `${siteConfig.url}/case-studies` },
    { name: "Bolagsdata API",  url: `${siteConfig.url}/case-studies/bolagsdata-api` },
  ]),
  getCaseStudySchema({
    slug:        "bolagsdata-api",
    projectName: "Bolagsdata API",
    summary:
      "Sökbar databas över Sveriges 3,5 miljoner företag med öppet API, byggd på avgiftsfria offentliga datakällor från Bolagsverket och SCB.",
    industry:    "Data / API",
    techStack:   ["Next.js 15", "React 19", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Pages"],
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

export default async function BolagsdataApiPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "bolagsdata-api").slice(0, 3);

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
              <span className="text-text">Bolagsdata API</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                DATA / API
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Sveriges företagsdata — utan betalvägg
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              Bolagsdata API är en sökbar databas över Sveriges 3,5 miljoner företag, med
              360 000+ årsredovisningar och ett öppet API. Allt byggt på offentliga,
              avgiftsfria datakällor — och gratis att använda.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js 15", "React 19", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Pages"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://bolagsdataapi.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök bolagsdataapi.se →
              </a>
              <LinkButton href="/boka-mote" variant="secondary">
                Boka samtal om liknande projekt
              </LinkButton>
            </div>

          </div>
        </Container>
      </header>

      {/* ── Article + Sidebar ────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          <article className="space-y-14">

            {/* Skärmdump-platshållare */}
            {/*
              TODO: Ersätt platshållaren med en riktig skärmdump när den finns.
              Rekommenderat: 1280×800 PNG i /public/cases/bolagsdata-api.png.
            */}
            <div
              role="img"
              aria-label="Skärmdump av Bolagsdata API — kommer snart"
              className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand/10 via-brand/5 to-transparent"
            >
              <span className="select-none text-sm font-medium text-muted/60">
                Skärmdump — Bolagsdata API (kommer snart)
              </span>
            </div>

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Offentlig data bakom betalvägg och säljsamtal
              </h2>
              <Prose>
                <p>
                  Grunddatan om svenska företag är offentlig och avgiftsfri. Bolagsverket och SCB
                  publicerar den öppet. Ändå möts den som vill använda den nästan alltid av samma
                  sak: registrera dig, prata med en säljare, teckna ett avtal.
                </p>
                <p>
                  Det drabbar fyra grupper med samma behov men olika ärenden — journalisten som
                  granskar, säljaren som prospekterar, utvecklaren som bygger något ovanpå, och
                  privatpersonen som vill kolla upp en motpart innan en affär.
                </p>
                <p>
                  Anledningen att ingen bara &quot;laddar ner datan&quot; är att den är obekväm. Den
                  kommer i stora bulkfiler, i flera olika format, med olika teckenkodning — och
                  årsredovisningarna ligger som <strong className="font-medium text-text">iXBRL</strong>,
                  ett maskinläsbart men otympligt format där varje bolags bokslut ligger i en egen
                  fil, paketerad i tusentals zip-arkiv.
                </p>
              </Prose>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                En sökmotor och ett API ovanpå öppna data
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Importpipeline som tål verkligheten</h3>
                  <Prose className="mb-4">
                    <p>
                      Vi byggde en pipeline som streamar bulkfilerna rakt ur zip-arkiven utan att
                      packa upp dem till disk, och som hanterar XML, CSV, TSV och NDJSON genom samma
                      kodväg. Den upptäcker avgränsare automatiskt och hanterar att Bolagsverket
                      levererar UTF-8 medan SCB levererar Latin-1.
                    </p>
                    <p>
                      Importerna är <strong className="font-medium text-text">idempotenta och
                      återupptagbara</strong>: de skriver i batchar med exponentiell backoff, och
                      efter ett avbrott spolar de förbi det som redan är inläst i stället för att
                      börja om. För årsredovisningarna bokförs varje färdig bulkfil, så att en
                      import som kraschar vid fil 600 av 787 fortsätter där den slutade.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Streamande parser som hanterar fyra filformat och två teckenkodningar",
                    "360 000+ årsredovisningar tolkade ur iXBRL, med 32 taxonomibegrepp mappade till nyckeltal",
                    "Idempotenta batchskrivningar med backoff — importen tål avbrott och kan återupptas",
                    "Postnummer berikade till län och kommun via öppna geodata",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Sökningen — där arbetet faktiskt låg</h3>
                  <Prose className="mb-4">
                    <p>
                      Att söka i 3,5 miljoner rader är lätt att göra långsamt. Den naiva lösningen
                      fungerar fint i utveckling och kollapsar i produktion: en sökning på ett
                      vanligt ord som &quot;bygg&quot; matchar över 200 000 bolag, och databasen
                      lägger all tid på att ranka träffar ingen kommer att titta på.
                    </p>
                    <p>
                      Vi byggde sökningen som en trappa i fyra steg. Ser frågan ut som ett
                      organisationsnummer görs en direktträff. Annars filtrering på indexerade
                      kolumner, därefter fulltextsökning med svensk språkstämning — och först om
                      den ger för få träffar kopplas en långsammare fuzzy-matchning in, och bara på
                      första sidan.
                    </p>
                    <p>
                      Effekten var dramatisk. Tunga frågor gick från{" "}
                      <strong className="font-medium text-text">50 sekunder till 1 sekund</strong>,
                      branschsidor från 69 sekunder till 0,2, och startsidans svarstid från 31
                      sekunder till 0,06.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Fyrstegssökning: organisationsnummer → filter → fulltext → fuzzy som sista utväg",
                    "Tak på antal kandidater vid rankning, så breda sökord inte fäller databasen",
                    "Tidsbudget mot databasen på startsidan — hellre en tom kolumn än en sida som hänger",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Ett API som är gratis på riktigt</h3>
                  <Prose className="mb-4">
                    <p>
                      API:et har tre endpoints: sök, hämta enskilt bolag, och bulkexport med
                      keyset-paginering för den som vill synka hela registret. Nycklar skapas
                      självbetjänat och ger 500 anrop per dygn.
                    </p>
                    <p>
                      Kvoten räknas ner <strong className="font-medium text-text">atomiskt i
                      databasen</strong> — i en enda operation som både läser och skriver. Det låter
                      som en detalj, men det är skillnaden mellan en kvot som håller och en som går
                      att kringgå genom att skicka många anrop samtidigt.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Tre endpoints: sök, enskilt bolag och bulkexport med keyset-paginering",
                    "500 anrop per dygn och nyckel, med kvotinformation i svarsheaders",
                    "Atomisk kvotmätning som inte går att kringgå med parallella anrop",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Integritet i ett register med personuppgifter</h3>
                  <Prose className="mb-4">
                    <p>
                      Här finns en fälla som är lätt att missa: för enskilda näringsidkare{" "}
                      <strong className="font-medium text-text">är organisationsnumret ett
                      personnummer</strong>. Ett register över svenska företag är därmed också ett
                      register över drygt en miljon personnummer.
                    </p>
                    <p>
                      Vi maskerar personnumren i alla publika svar, och länkar till enskilda firmor
                      via en slumpad token i stället för numret — så att en URL går att dela utan
                      att exponera en personuppgift. Åtkomsten är dessutom begränsad på
                      kolumnnivå i databasen, inte bara i applikationskoden.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Personnummer maskeras i samtliga publika svar och i API:et",
                    "Opaka tokens i URL:er och sitemaps i stället för organisationsnummer",
                    "Behörighet på kolumnnivå i databasen — inte enbart i applikationslagret",
                  ]} />
                </div>

              </div>
            </section>

            {/* Tekniska val */}
            <section>
              <SectionLabel>Tekniska val</SectionLabel>
              <h2 className="heading-md mb-5">
                Allt på edge, logiken i databasen
              </h2>
              <Prose>
                <p>
                  Sajten är byggd i <strong className="font-medium text-text">Next.js 15 med React
                  19</strong> och körs i sin helhet på <strong className="font-medium text-text">Cloudflare
                  Pages edge-runtime</strong> — varje sida och varje API-route. Data ligger i{" "}
                  <strong className="font-medium text-text">Supabase/PostgreSQL</strong>.
                </p>
                <p>
                  Vi valde medvetet bort ORM. Sökningen, kvothanteringen och sitemap-genereringen är
                  skrivna som databasfunktioner i ren SQL, eftersom det är där prestandan avgörs —
                  och för att en sökning i miljontals rader inte är något man vill att ett
                  abstraktionslager ska formulera åt en.
                </p>
                <p>
                  Att indexera miljontals bolagssidor krävde en egen lösning: sitemapen genereras i
                  databasen och radantalet uppskattas ur Postgres statistik i stället för att räknas,
                  eftersom en exakt räkning över 3,5 miljoner rader tar längre tid än vad en
                  sökmotor väntar.
                </p>
              </Prose>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js 15 (App Router)",
                  "React 19",
                  "TypeScript",
                  "Supabase/PostgreSQL",
                  "Cloudflare Pages (edge)",
                  "Node-pipeline",
                ].map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Resultatet */}
            <section>
              <SectionLabel>Resultatet</SectionLabel>
              <h2 className="heading-md mb-5">
                Ett öppet register i produktion
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Bolagsdata API är live med{" "}
                  <strong className="font-semibold text-text">3,5 miljoner företag</strong> och{" "}
                  <strong className="font-semibold text-text">360 000+ årsredovisningar</strong> med
                  nyckeltal. Sök och API är gratis, utan betalvägg och utan säljsamtal — tjänsten
                  finansieras av annonsering och företag som väljer att uppgradera sin profil.
                  Sökningar som tidigare tog nästan en minut svarar i dag på under en sekund.
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
                  <dd className="mt-0.5 text-text">Data / API</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och i produktion</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Omfattning</dt>
                  <dd className="mt-0.5 text-text">3,5 M företag · 360 000+ bokslut</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js 15", "React 19", "Supabase", "Cloudflare Pages", "TypeScript"].map((t) => (
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
                    href="https://bolagsdataapi.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    bolagsdataapi.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Sitter ni på data som borde vara sökbar?</p>
              <p className="body-md mt-3">
                Vi bygger sökbara plattformar ovanpå stora datamängder — importpipelines,
                prestandaoptimerad sökning, publika API:er och integritetssäker datahantering.
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
          eyebrow="Har ni en datamängd som ingen kommer åt?"
          title="Importpipelines, sökning som skalar och publika API:er — byggt för miljontals rader."
          description="Vi har tagit öppna bulkfiler hela vägen till en sökbar produkt i produktion. Boka ett samtal så tittar vi på er data."
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
