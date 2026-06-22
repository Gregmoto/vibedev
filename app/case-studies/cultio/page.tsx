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

/* ── Cultio-länk med UTM (öppnas i ny flik) ───────────────────────────────── */

const CULTIO_URL =
  "https://cultio.se?utm_source=vibedev&utm_medium=case-study&utm_campaign=cultio";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = createMetadata(
  "Cultio — Web-to-print-plattform för tryckerier | VibeDev",
  "Cultio är en web-to-print-SaaS där nordiska tryckerier säljer tryck online — med priskalkylator, preflight, korrektur, white-label och återförsäljarnätverk. Se hur vi byggde den.",
  "/case-studies/cultio",
  {
    keywords: [
      "web-to-print",
      "web to print sverige",
      "webshop för tryckeri",
      "system för tryckeri",
      "SaaS för tryckerier",
      "print shop software",
    ],
  },
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Cultio",       url: `${siteConfig.url}/case-studies/cultio` },
  ]),
  getCaseStudySchema({
    slug:        "cultio",
    projectName: "Cultio",
    summary:
      "Web-to-print-plattform där nordiska tryckerier får en färdig webbutik för att sälja tryck online — med priskalkylator, preflight, korrektur, white-label och återförsäljarnätverk.",
    industry:    "SaaS / Web-to-Print",
  }),
  {
    "@context":          "https://schema.org",
    "@type":             "SoftwareApplication",
    name:                "Cultio",
    applicationCategory: "BusinessApplication",
    operatingSystem:     "Web",
    url:                 "https://cultio.se",
    description:
      "Web-to-print-SaaS där nordiska tryckerier får en färdig, white-label webbutik för att sälja tryck online — med priskalkylator, preflight, korrektur och B2B-prislistor.",
  },
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

export default async function CultioPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "cultio").slice(0, 3);

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
              <span className="text-text">Cultio</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                SAAS / WEB-TO-PRINT
              </span>
              <span className="animate-pulse rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                Pågående — lansering 2026
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              En färdig webbutik för tryckerier som vill sälja tryck online
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              Cultio är en web-to-print-plattform vi bygger för nordiska tryckerier. I stället för
              ordrar via mejl, tryckfiler via WeTransfer och korrektur via telefon får tryckeriet en
              komplett webbutik där trycklogiken är inbyggd — från priskalkylator till preflight.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CULTIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök cultio.se →
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
              TODO: Ersätt platshållaren med en riktig skärmdump av Cultio när den finns.
              Rekommenderat: 1280×800 PNG i /public/cases/cultio.png och byt diven mot:
                <Image src="/cases/cultio.png" alt="Cultio web-to-print-plattform — produktkonfigurator med realtidspris" fill className="object-cover" />
            */}
            <div
              role="img"
              aria-label="Skärmdump av Cultios web-to-print-plattform — kommer snart"
              className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand/10 via-brand/5 to-transparent"
            >
              <span className="select-none text-sm font-medium text-muted/60">
                Skärmdump — Cultio (kommer snart)
              </span>
            </div>

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Tryckerier fastnar i manuella flöden — och generella system klarar inte trycket
              </h2>
              <Prose>
                <p>
                  Många tryckerier sitter fast i manuella flöden: ordrar via mejl, tryckfiler via
                  WeTransfer, korrektur via telefon och fakturor för hand. Befintliga
                  web-to-print-system är gamla och röriga.
                </p>
                <p>
                  Generella e-handelsplattformar som Shopify, WooCommerce och PrestaShop klarar inte
                  trycklogiken: upplagor, kvadratmeterpris, bleed och preflight, korrekturflöden
                  eller kundspecifika B2B-prislistor. Det blir alltid en kompromiss — en butik man
                  försöker böja till tryck.
                </p>
              </Prose>
            </section>

            {/* Vad vi bygger */}
            <section>
              <SectionLabel>Vad vi bygger</SectionLabel>
              <h2 className="heading-md mb-5">
                Hela trycket inbyggt — från konfigurator till orderflöde
              </h2>
              <BulletList items={[
                "Produktkonfigurator med realtidspris — kvantitetstrappor och m²-pris för storformat",
                "Filuppladdning med automatisk preflight (bleed, DPI, CMYK) och digitalt godkänt korrektur",
                "Kundspecifika prislistor och B2B-flöden (faktura, förskott, rabattsatser)",
                "Multi-tenant med white-label: varje tryckeri får egen butik på egen domän",
                "Återförsäljarnätverk — tryckerier ger sina partners egna white-label-butiker med vinstvy",
                "Kundportal, viktbaserad frakt, nyhetsbrev och ett tvåaxlat orderflöde (produktion + betalning)",
              ]} />
            </section>

            {/* Differentiering */}
            <section>
              <SectionLabel>Differentiering</SectionLabel>
              <h2 className="heading-md mb-5">
                Specialiserad tryckmjukvara — inte en generell butik
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Cultio kräver{" "}
                  <strong className="font-semibold text-text">inga tredjepartsmoduler, ingen
                  kodning och ingen specialanpassning</strong> — allt tryck behöver är inbyggt. Det
                  är specialiserad tryckmjukvara, inte en generell butik man försöker böja till
                  tryck.
                </p>
              </div>
            </section>

            {/* Tekniska val */}
            <section>
              <SectionLabel>Tekniska val</SectionLabel>
              <h2 className="heading-md mb-5">
                En isolerad prismotor och ett ordersystem som state machine
              </h2>
              <Prose>
                <p>
                  Plattformen byggs i Next.js med App Router och TypeScript. Data och autentisering
                  ligger i Supabase/PostgreSQL med Row Level Security, vilket gör multi-tenant och
                  white-label säkert på databasnivå — varje tryckeri ser bara sitt. Körningen sker på
                  Cloudflare Workers via OpenNext, med Stripe för betalning och Resend för utskick.
                </p>
                <p>
                  Två designbeslut bär robustheten: prismotorn är byggd som en isolerad domänmotor,
                  så att trycklogiken kan testas och resoneras kring för sig, och ordersystemet är en
                  state machine — varje order har ett tydligt, spårbart tillstånd genom både
                  produktion och betalning.
                </p>
              </Prose>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js (App Router)",
                  "TypeScript",
                  "Supabase/PostgreSQL (RLS)",
                  "Cloudflare Workers (OpenNext)",
                  "Stripe",
                  "Resend",
                ].map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Status idag */}
            <section>
              <SectionLabel>Status idag</SectionLabel>
              <h2 className="heading-md mb-5">
                Aktiv utveckling — lansering 2026
              </h2>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-7">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-amber-900">Pågående utveckling</p>
                    <p className="mt-1 text-sm leading-7 text-amber-800">
                      Cultio byggs på en delad commerce-kärna med tryck som första vertikal.{" "}
                      <strong>Lansering planerad till 2026.</strong> Följ utvecklingen på{" "}
                      <a
                        href={CULTIO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-2 transition hover:opacity-80"
                      >
                        cultio.se
                      </a>
                      .
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
                  <dd className="mt-0.5 text-text">SaaS / Web-to-Print</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    <span className="text-text">Pågående — lansering 2026</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "TypeScript", "Supabase", "Cloudflare Workers", "Stripe", "Resend"].map((t) => (
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
                    href={CULTIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    cultio.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Vill du bygga något liknande?</p>
              <p className="body-md mt-3">
                Vi bygger specialiserade SaaS-plattformar med multi-tenant, white-label och
                domänspecifik logik — från konfigurator och prismotor till orderflöden.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href="/kontakt">Kontakta VibeDev</LinkButton>
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
          eyebrow="Vill du bygga något liknande?"
          title="Vi bygger specialiserad SaaS där domänlogiken är inbyggd — inte en generell plattform man försöker böja till sitt syfte."
          description="Multi-tenant, white-label, isolerade domänmotorer och robusta orderflöden — samma grund som Cultio byggs på. Kontakta VibeDev så tittar vi på ert projekt."
          actions={
            <>
              <LinkButton href="/kontakt">Kontakta VibeDev →</LinkButton>
              <LinkButton href="/tjanster" variant="secondary">Se våra tjänster</LinkButton>
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
