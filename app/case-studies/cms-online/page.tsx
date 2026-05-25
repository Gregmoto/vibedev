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
  "CMS Online — Hur vi byggde en allt-i-ett-plattform för svenska e-handlare | VibeDev",
  "Vi ersatte fem separata system med en samlad plattform: Fortnox, Shopify, lager, frakt och bokföring i ett. Läs hur vi tänkte och vad vi lärde oss.",
  "/case-studies/cms-online",
);


/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "CMS Online",   url: `${siteConfig.url}/case-studies/cms-online` },
  ]),
  getCaseStudySchema({
    slug:        "cms-online",
    projectName: "CMS Online",
    summary:
      "Komplett CMS för svenska e-handlare — Fortnox, Shopify, lager, frakt och bokföring i ett system.",
    industry:    "E-handel & SaaS",
    techStack:   ["Next.js", "TypeScript", "Prisma", "Fortnox API", "Shopify Admin API", "Starweb"],
    publishedAt: "2024-06-01",
  }),
];

/* ── Sub-components ───────────────────────────────────────────────────────── */

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

export default async function CmsOnlinePage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "cms-online").slice(0, 3);

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

            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-muted" aria-label="Brödsmulor">
              <Link href="/case-studies" className="transition hover:text-brand">Case studies</Link>
              <span aria-hidden="true">›</span>
              <span className="text-text">CMS Online</span>
            </nav>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                E-HANDEL
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Hur vi byggde en allt-i-ett-plattform som ersätter fem system
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              CMS Online är en plattform vi byggde för svenska e-handlare som tröttnat på att hoppa
              mellan fem olika system varje dag. Idag hanterar handlare hela kedjan — från inkommande
              order till bokförd faktura — i ett enda gränssnitt.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Prisma", "Fortnox API", "Shopify Admin API", "Starweb"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om liknande projekt</LinkButton>
              <a
                href="https://cmsonline.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök cmsonline.se ↗
              </a>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Article + Sidebar ────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* ── Main article ──────────────────────────────────────────── */}
          <article className="space-y-14">

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Genomsnittlig e-handlare jonglerar dagligen mellan fem system
              </h2>
              <Prose>
                <p>
                  Butikssystem, lagersystem, fraktbolagsportaler, bokföringsprogram och kundservice
                  — varje del lever i sitt eget universum. Konsekvensen är dubbla inmatningar,
                  manuell synkronisering och ständiga fel i lagersaldon.
                </p>
              </Prose>
              <div className="mt-6">
                <BulletList items={[
                  "Butikssystem (Shopify, Starweb, WooCommerce)",
                  "Lagersystem för flera lagerorter",
                  "Fraktbolagens egna portaler (DHL, Schenker, PostNord)",
                  "Bokföringsprogram (oftast Fortnox)",
                  "Mailutskick och kundservice",
                  "Returhantering i separata flöden",
                ]} />
              </div>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Resultatet:</strong>{" "}
                  dubbla inmatningar, manuell sync, ständiga fel i lagersaldon och timmar slösade
                  på administration. När butiken växer skalar problemet linjärt.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                En CMS-plattform där hela kedjan körs i ett gränssnitt
              </h2>

              {/* Sub-sections */}
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Order- och lagerhantering</h3>
                  <BulletList items={[
                    "Synkroniserad lagernivå över flera lagerorter",
                    "Automatisk reservation vid order",
                    "Realtidsuppdatering mot Shopify och Starweb",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Frakthantering</h3>
                  <BulletList items={[
                    "Direkt integration mot DHL, Schenker och PostNord",
                    "Fraktsedlar genererade och printade från plattformen",
                    "Spårningsnummer skickas automatiskt",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Kundkommunikation</h3>
                  <BulletList items={[
                    "SMS- och mailutskick direkt från order",
                    "Mallar för leveransbekräftelse, försenad order, retur",
                    "Allt loggat per kund",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Bokföring</h3>
                  <BulletList items={[
                    "Fortnox-integration: orderdata flyttas till fakturor automatiskt",
                    "Kreditfakturor vid retur",
                    "Avstämningsrapporter",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Returhantering</h3>
                  <BulletList items={[
                    "Användarvänligt returflöde",
                    "Automatiska kreditfakturor",
                    "Lagerjustering vid mottaget retur",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Hur vi tänkte tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Abstraktionslager som pratar med fem system utan att förlora data
              </h2>
              <Prose>
                <p>
                  Vi valde Next.js eftersom plattformen behöver vara snabb i admin-läget men
                  också ha SSR-kapacitet för publika delar. Prisma som ORM gjorde att vi kunde
                  modellera komplexa relationer — order → orderrad → produkt → lagerplats →
                  bokföringspost — på ett strukturerat sätt.
                </p>
                <p>
                  Den tuffaste delen var synkroniseringen mellan system. Shopify, Starweb och
                  Fortnox har alla olika syn på vad en "order" är, vilka statuslägen som finns
                  och hur data ska struktureras. Vi byggde ett abstraktionslager som översätter
                  mellan systemens egna språk till en gemensam intern modell.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss */}
            <section>
              <SectionLabel>Vad vi lärde oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter från ett projekt med fem integrationer
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num: "01",
                    title: "Synk-frekvens är en avvägning.",
                    body: "Realtid är dyrt och felkänsligt — schemalagd sync (var 5:e minut) löser 95% av casen utan att överbelasta API-erna.",
                  },
                  {
                    num: "02",
                    title: "Felhantering är funktionalitet, inte buggar.",
                    body: "När fem system kommunicerar går något fel varje dag. Plattformen visar tydliga, handfasta felmeddelanden — inte tekniska stack traces.",
                  },
                  {
                    num: "03",
                    title: "Bokföringskoppling är 80% av värdet.",
                    body: "Det är där handlare sparar mest tid. Fortnox-integrationen blev kärnan i hela plattformen.",
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
                Från 2–3 timmar admin per dag till 20–30 minuter
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  E-handlare som tidigare la <strong className="font-semibold text-text">2–3 timmar per dag</strong> på
                  administration gör nu samma sak på{" "}
                  <strong className="font-semibold text-text">20–30 minuter</strong>.
                  Lagernivåer är i sync, bokföringen sker automatiskt, och returer hanteras utan
                  manuella ingrepp.
                </p>
              </div>
            </section>

          </article>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24">

            {/* Project meta */}
            <Card variant="outlined" className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                Överblick
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Bransch</dt>
                  <dd className="mt-0.5 text-text">E-handel & SaaS</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och i drift</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "TypeScript", "Prisma", "Fortnox API", "Shopify API"].map((t) => (
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
                    href="https://cmsonline.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    cmsonline.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Liknande projekt?</p>
              <p className="body-md mt-3">
                Vi hjälper bolag som vill ersätta flera separata system med en samlad plattform — och
                som vill göra det utan att fastna i ett 18-månaders projekt.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href="/boka-mote">Boka strategisamtal</LinkButton>
                <LinkButton href="/tjanster" variant="secondary">
                  Se våra tjänster
                </LinkButton>
              </div>
            </Card>

            {/* Back link */}
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
          eyebrow="Vill ni bygga något liknande?"
          title="Vi hjälper bolag ersätta komplexa system-lapptäcken med en samlad plattform."
          description="Utan 18-månaders projekt. Utan onödig komplexitet. Utan säljsnack. Boka ett samtal så berättar vi vad som är rimligt för just er situation."
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
