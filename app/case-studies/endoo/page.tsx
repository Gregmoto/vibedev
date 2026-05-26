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
  "Endoo — Komplett SaaS för fakturering, order, inköp och bokföring | VibeDev",
  "Vi bygger Endoo: ett ekonomisystem som ersätter Fortnox + fem andra verktyg med en plattform. Läs om datamodellering, Peppol-integration och varför färre system är rätt svar.",
  "/case-studies/endoo",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Endoo",        url: `${siteConfig.url}/case-studies/endoo` },
  ]),
  getCaseStudySchema({
    slug:        "endoo",
    projectName: "Endoo",
    summary:
      "Komplett SaaS för fakturering, order, inköp och bokföring i en plattform — ersätter 4–6 separata system för svenska SMB.",
    industry:    "SaaS & Ekonomi",
    techStack:   ["Next.js", "Prisma", "TypeScript", "PostgreSQL"],
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

export default async function EndooPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "endoo").slice(0, 3);

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
              <span className="text-text">Endoo</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                SAAS / EKONOMI
              </span>
              <span className="animate-pulse rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                Pågående — Beta Q3 2026
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Vad om hela ekonomin fanns i ett system?
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              Endoo är en pågående produkt vi bygger för bolag som tröttnat på att splittra
              ekonomin mellan fem system. Fakturering, order, inköp, leverantörsfakturor och
              bokföring — i en plattform, med en inloggning, en databas.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "Prisma", "TypeScript", "PostgreSQL"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://endoo.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Anmäl intresse på Endoo →
              </a>
              <LinkButton href="/boka-mote" variant="secondary">
                Boka samtal om SaaS-projekt
              </LinkButton>
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
                Genomsnittlig svensk SMB betalar för 4–6 separata system
              </h2>
              <Prose>
                <p>
                  Faktureringsverktyg, bokföringsprogram, order- och offertsystem,
                  inköpshantering, leverantörsfaktura-portal, tidrapportering — alla i var sitt
                  universum. Resultatet är dubbla inmatningar, integrationer som bryts och en
                  ekonomiavdelning som spenderar halva tiden på att stämma av mellan system
                  istället för att tolka siffror.
                </p>
              </Prose>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  "Faktureringsverktyg",
                  "Bokföringsprogram",
                  "Order & offert",
                  "Inköpshantering",
                  "Leverantörsfakturor",
                  "Tidrapportering",
                ].map((system) => (
                  <div
                    key={system}
                    className="flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger/60" />
                    <span className="text-xs text-muted">{system}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Marknadens svar:</strong> fler integrationer.{" "}
                  <strong className="font-semibold text-text">Vårt svar:</strong> färre system.
                </p>
              </div>
            </section>

            {/* Vad vi bygger */}
            <section>
              <SectionLabel>Vad vi bygger</SectionLabel>
              <h2 className="heading-md mb-5">
                Fem moduler, ett system, en sanning
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Fakturering</h3>
                  <BulletList items={[
                    "Kompletta svenska standardregler: moms, ROT/RUT, omvänd skattskyldighet",
                    "Återkommande fakturor med automatisk hantering",
                    "E-faktura (Peppol) och PDF som standard",
                    "Påminnelse- och inkassoflöden",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Orderhantering</h3>
                  <BulletList items={[
                    "Offerter, ordrar och leveranser i ett flöde",
                    "Koppling till lagernivåer utan separat lagersystem",
                    "Automatisk fakturering vid leverans",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Inköp</h3>
                  <BulletList items={[
                    "Inköpsorder mot leverantörer",
                    "Leverantörsfakturor: manuell inmatning och Peppol-import",
                    "Attest- och betalflöden med spårbarhet",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Bokföring</h3>
                  <BulletList items={[
                    "Full BAS-kontoplan med svenska standarder",
                    "Automatiska konteringar baserade på affärshändelser",
                    "Avstämning, momsdeklaration, periodisering, årsbokslut",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">En sanning, en databas</h3>
                  <BulletList items={[
                    "Alla moduler delar samma underliggande data",
                    "En kundkontakt är samma kontakt i offert, order, faktura och bokföring",
                    "Inga import/export-flöden mellan moduler — ingen data förloras i transition",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänker tekniskt */}
            <section>
              <SectionLabel>Hur vi tänker tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Datamodellering som kärna — AI och Peppol som standard
              </h2>
              <Prose>
                <p>
                  Att bygga en ekonomi-SaaS från grunden 2026 är möjligt på ett sätt det inte
                  var för tio år sedan. Modern stack — Next.js, Prisma, PostgreSQL — gör att
                  vi kan modellera komplexa affärsregler utan att fastna i legacy-arkitektur
                  från dag ett.
                </p>
                <p>
                  Vi bygger in AI där det skapar faktiskt värde: OCR av leverantörsfakturor,
                  smart konteringsförslag baserat på historik, anomalidetektion i bokföringen.
                  Inte AI för AI:s skull — AI som sparar ekonomiavdelningen tid varje dag.
                </p>
                <p>
                  Peppol-stöd byggs in som default, inte som plugin. Sverige rör sig mot
                  e-faktura som standard — vi bygger för det från start istället för att
                  retrofita det senare.
                </p>
                <p>
                  Den största designutmaningen är datamodelleringen. När faktura, order,
                  bokföring och inköp delar samma databas måste varje förändring förstås i
                  alla kontext. Vi lägger oproportionerligt mycket tid på databas-design i
                  tidig fas — för det blir extremt dyrt att rätta till sent.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärt oss */}
            <section>
              <SectionLabel>Vad vi redan lärt oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter från att bygga ett ekonomisystem från grunden
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Domänkunskap är 50% av jobbet.",
                    body:  "Svensk bokföring är full av undantag och regler som inte syns i internationella system. Vi har tillbringat hundratals timmar med ekonomer för att förstå hur verkligheten ser ut — inte hur vi tror att den ser ut.",
                  },
                  {
                    num:   "02",
                    title: "Migrera-från-Fortnox är USP nummer ett.",
                    body:  "Vi bygger import-verktyg som tar Fortnox-data och skapar motsvarande i Endoo. Utan det är tröskeln att byta för hög — oavsett hur bra produkten är.",
                  },
                  {
                    num:   "03",
                    title: "Hastighet i UI är icke-förhandlingsbart.",
                    body:  "Ekonomipersonal använder systemet hela dagarna. Varje sekund av latens är en sekund för mycket. Vi prestanda-budgeterar varje vy och sätter gränsen vid 100ms för interaktioner.",
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

            {/* Status */}
            <section>
              <SectionLabel>Status idag</SectionLabel>
              <h2 className="heading-md mb-5">
                Aktiv utveckling — beta sommaren 2026
              </h2>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-7">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-amber-900">Pågående utveckling</p>
                    <p className="mt-1 text-sm leading-7 text-amber-800">
                      Privat beta planerad till{" "}
                      <strong>sommaren 2026</strong>, publik lansering{" "}
                      <strong>Q4 2026</strong>. Anmäl intresse på{" "}
                      <a
                        href="https://endoo.se"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-2 transition hover:opacity-80"
                      >
                        endoo.se
                      </a>{" "}
                      för att vara med i betan.
                    </p>
                  </div>
                </div>
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
                  <dd className="mt-0.5 text-text">SaaS & Ekonomi</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    <span className="text-text">Beta Q3 2026</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "Prisma", "TypeScript", "PostgreSQL"].map((t) => (
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
                    href="https://endoo.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    endoo.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Bygger ni en SaaS-produkt?</p>
              <p className="body-md mt-3">
                Vi har specifik erfarenhet av att bygga komplexa SaaS-plattformar med fokus
                på datamodellering, prestanda och svenska affärsregler.
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
          eyebrow="Bygger ni en SaaS-produkt från grunden?"
          title="Vi har specifik erfarenhet av komplexa SaaS-plattformar med svenska affärsregler och hög prestanda."
          description="Datamodellering, Peppol-integration, migrationsverktyg och prestanda-budgetering — vi bygger det dagligen i Endoo och kan tillämpa samma erfarenhet på er produkt."
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
