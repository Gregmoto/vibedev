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
  "Mittbrottmål — Hur vi gjorde juridiken förståelig utan att ersätta advokaten | VibeDev",
  "Vi byggde Mittbrottmål: en legal tech-plattform som guidar privatpersoner genom brottmålsprocessen. Läs om innehållsmodellering, pedagogik som funktionalitet och design för stressade användare.",
  "/case-studies/mittbrottmal",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",            url: siteConfig.url },
    { name: "Case studies",   url: `${siteConfig.url}/case-studies` },
    { name: "Mittbrottmål",   url: `${siteConfig.url}/case-studies/mittbrottmal` },
  ]),
  getCaseStudySchema({
    slug:        "mittbrottmal",
    projectName: "Mittbrottmål",
    summary:
      "Legal tech-plattform som hjälper privatpersoner förstå sitt brottmål — processen, rättigheterna och vad som väntar.",
    industry:    "Legal Tech",
    techStack:   ["Next.js", "Tailwind", "Strukturerad innehållsmotor"],
    publishedAt: "2024-04-01",
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

export default async function MittbrottmalPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "mittbrottmal").slice(0, 3);

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
              <span className="text-text">Mittbrottmål</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                LEGAL TECH
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Hur vi gjorde juridiken förståelig — utan att ersätta advokaten
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              Mittbrottmål hjälper privatpersoner förstå sitt brottmål — processen, rättigheterna
              och vad som väntar. Den ersätter inte en advokat, men sänker tröskeln till juridisk
              grundförståelse markant.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "Tailwind", "Strukturerad innehållsmotor"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om legal tech</LinkButton>
              <a
                href="https://mittbrottmal.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök mittbrottmal.se ↗
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
                Brottmålsprocessen är obegriplig för de flesta
              </h2>
              <Prose>
                <p>
                  När en privatperson hamnar i ett brottmål — som misstänkt, målsägande eller
                  vittne — är processen ofta helt obegriplig. Advokattid är dyr, rådgivning
                  svår att hitta, och offentliga källor är skrivna för jurister, inte lekmän.
                </p>
              </Prose>
              <div className="mt-6">
                <BulletList items={[
                  "Vad innebär en kallelse?",
                  "Vilka rättigheter har jag?",
                  "Måste jag svara på frågor från polisen?",
                  "Vad är skillnaden mellan förundersökning och rättegång?",
                  "När behöver jag advokat — och hur hittar jag en?",
                ]} />
              </div>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Idén:</strong>{" "}
                  bygg en plattform som guidar användaren genom sitt eget ärende —
                  utan att låtsas vara juridisk rådgivning.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                Guidade flöden med tydliga gränser
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Guidade flöden</h3>
                  <BulletList items={[
                    "Användaren beskriver sin situation — typ av ärende, roll, fas",
                    "Plattformen visar relevant information för just det läget",
                    "Steg-för-steg-genomgång av vad som händer härnäst",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Tips och förklaringar på enkel svenska</h3>
                  <BulletList items={[
                    "Juridiska termer förklarade med vardagsspråk",
                    "Konkreta exempel på vanliga situationer",
                    "Tydliga \"vad du kan göra nu\"-rekommendationer",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Tydliga signaler om när advokat behövs</h3>
                  <BulletList items={[
                    "Vi är extremt noga med att inte ersätta juridisk rådgivning",
                    "Vid känsliga steg lyfter plattformen tydligt: \"Här behöver du advokat\"",
                    "Länkar till hur man ansöker om offentlig försvarare",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Anonymt och säkert</h3>
                  <BulletList items={[
                    "Ingen registrering krävs för att använda kärnflödena",
                    "Ingen data sparas om användaren inte själv väljer det",
                    "Stark integritetsmedvetenhet i hela designen",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Hur vi tänkte tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Innehållsmodellering som kärna — design som kommunikation
              </h2>
              <Prose>
                <p>
                  Den största delen av arbetet var innehållsmodelleringen. Juridik är inte en
                  linjär process — det är ett träd av beslut, beroenden och undantag. Vi byggde
                  en strukturerad innehållsmotor där varje "steg" är en innehållsnod med villkor,
                  nästa steg avgörs av användarens svar, och innehållet kan uppdateras utan
                  kod-deploys.
                </p>
                <p>
                  Designen är medvetet lugn och nedtonad. Användare av plattformen är ofta
                  stressade och oroliga. Ingen aggressiv färgsättning, inga animerade banners,
                  ingen "hej välkommen!"-ton. Vit yta och typogrfisk hierarki gör jobbet.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss */}
            <section>
              <SectionLabel>Vad vi lärde oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter från att bygga i en känslig bransch
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Pedagogik är funktionalitet i legal tech.",
                    body:  "Det räcker inte att ha rätt information — den måste presenteras så att en stressad person kl 23 på kvällen kan ta till sig den. Läsbarhet är en feature.",
                  },
                  {
                    num:   "02",
                    title: "Ansvarsfriskrivningar måste vara tydliga utan att skrämma.",
                    body:  "Vi testade många varianter innan vi hittade rätt ton: \"Det här ersätter inte juridisk rådgivning, men hjälper dig förstå vad som händer.\" Balansen mellan trygghet och ärlighet är svår att hitta.",
                  },
                  {
                    num:   "03",
                    title: "Tystnad och vit yta byggde förtroende.",
                    body:  "Tidiga utkast hade mer visuellt brus. Användartester visade att det skapade ångest istället för trygghet. Vi skar ner till det väsentliga — och konverteringen ökade.",
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
                Juridisk grundförståelse utan advokatarvode
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Mittbrottmål är idag en lågtröskel-tjänst som demokratiserar juridisk
                  grundförståelse. Den{" "}
                  <strong className="font-semibold text-text">ersätter inte advokaten</strong>{" "}
                  — men hjälper människor att förstå sin egen situation,
                  fatta välinformerade beslut och veta exakt{" "}
                  <strong className="font-semibold text-text">när det är dags att söka professionell hjälp</strong>.
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
                  <dd className="mt-0.5 text-text">Legal Tech</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "Tailwind", "Innehållsmotor"].map((t) => (
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
                    href="https://mittbrottmal.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    mittbrottmal.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Legal tech eller känslig bransch?</p>
              <p className="body-md mt-3">
                Vi har erfarenhet av plattformar där design och språk är lika viktigt som
                funktionalitet — och där förtroende byggs av detaljer som användaren aldrig
                medvetet lägger märke till.
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
          eyebrow="Bygger ni inom legal tech eller känsliga branscher?"
          title="Vi har erfarenhet av plattformar där förtroende och pedagogik är lika viktiga som kod."
          description="Design för stressade användare, tydliga ansvarsfriskrivningar och innehållsmodellering för komplexa regelverk — vi har gjort det förut."
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
