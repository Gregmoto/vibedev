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
  "Bookiz — Hur vi byggde en bok-community där tre användartyper möts | VibeDev",
  "Vi byggde Bookiz: en community-plattform för svenska bokmarknaden där läsare, författare och förlag samexisterar i ett flöde. Läs hur vi löste multi-role-arkitektur och fan-out feeds.",
  "/case-studies/bookiz",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Bookiz",       url: `${siteConfig.url}/case-studies/bookiz` },
  ]),
  getCaseStudySchema({
    slug:        "bookiz",
    projectName: "Bookiz",
    summary:
      "Community-plattform för svenska bokmarknaden där läsare, författare och förlag möts i samma flöde.",
    industry:    "Community & Bok",
    techStack:   ["Next.js", "PostgreSQL", "Tailwind", "Notifikationer", "Feeds"],
    publishedAt: "2024-09-01",
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

export default async function BookizPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "bookiz").slice(0, 3);

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
              <span className="text-text">Bookiz</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                COMMUNITY
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Hur vi byggde en bok-community där tre användartyper möts
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              Bookiz är en community-plattform där läsare, författare och förlag möts i samma flöde.
              Användare bygger personliga bibliotek, startar bokklubbar och recenserar — samtidigt
              som författare och förlag når läsare direkt.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "PostgreSQL", "Tailwind", "Notifikationer", "Feeds"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om community-projekt</LinkButton>
              <a
                href="https://bookiz.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök bookiz.se ↗
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
                Svenska bokmarknaden saknar en samlad digital plats
              </h2>
              <Prose>
                <p>
                  Goodreads dominerar internationellt men har dåligt svenskt urval. Förlag har
                  sina egna splittrade sajter. Författare når sällan sina läsare direkt. Det
                  saknades ett ställe att ta allt detta till.
                </p>
              </Prose>
              <div className="mt-6 space-y-4">
                {[
                  {
                    role:  "Läsare",
                    desc:  "Behöver ett ställe att organisera sina bibliotek, hitta nya svenska tips och engagera sig i bokklubbar.",
                  },
                  {
                    role:  "Författare",
                    desc:  "Saknar en direktkanal till läsare utan att gå via förlaget.",
                  },
                  {
                    role:  "Förlag",
                    desc:  "Vill nå rätt målgrupp och presentera sin katalog utan att bygga egna sajter per titel.",
                  },
                ].map(({ role, desc }) => (
                  <div key={role} className="flex gap-4 rounded-2xl border border-line bg-bg p-5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {role[0]}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{role}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Kärnproblemet:</strong>{" "}
                  tre helt olika användartyper med fundamentalt olika behov — men samma plattform
                  måste fungera naturligt för alla tre utan att kännas splittrad.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                Tre distinkta upplevelser i en gemensam plattform
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">För läsare</h3>
                  <BulletList items={[
                    "Personligt bibliotek med tre hyllor: läst, läser, vill läsa",
                    "Bokklubbar med diskussionstrådar och läsutmaningar",
                    "Recensions- och betygssystem",
                    "Personliga rekommendationer baserade på läsbeteende",
                    "Sociala flöden — följ andra läsare och se deras aktivitet",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">För författare</h3>
                  <BulletList items={[
                    "Egna profilsidor med biografi och bok-katalog",
                    "Direktdialog med läsare via kommentarer och meddelanden",
                    "Statistik över läsning, recensioner och intresse",
                    "Möjlighet att notifiera följare vid ny bok eller nyhet",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">För förlag</h3>
                  <BulletList items={[
                    "Förlagsprofiler med hela utgivningskatalogen",
                    "Författar-länkning — varje bok kopplad till rätt förlag",
                    "Möjlighet att lyfta nyutgivningar i relevanta flöden",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Gemensam infrastruktur</h3>
                  <BulletList items={[
                    "Sök och upptäcktsflöden med filter på genre, betyg och era",
                    "Intelligent notifieringsmotor med gruppering",
                    "Mobilvänligt gränssnitt — native-känsla utan native-app",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Hur vi tänkte tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Multi-role-arkitektur och fan-out feeds
              </h2>
              <Prose>
                <p>
                  Den största designutmaningen var rättigheter och kontextväxling. En användare
                  kan vara läsare på sitt egna konto, men samtidigt vara administratör för ett
                  förlag eller registrerad som författare. UI:n behöver kunna växla kontext
                  utan förvirring — likt Slack-workspaces.
                </p>
                <p>
                  Vi byggde det med en användartabell som tillåter flera roller per användare,
                  en kontextväxlare i top-bar och behörighetschecks på server-action-nivå för
                  att förhindra att en roll utför handlingar som tillhör en annan.
                </p>
                <p>
                  Feed-arkitekturen är <strong className="font-medium text-text">fan-out-on-write</strong>:
                  när någon postar en recension distribueras den till följares feeds direkt vid
                  skrivtillfället. Det ger snabbare läsning på bekostnad av lite extra skrivarbete
                  — rätt avvägning för en community där läsfrekvens är mycket högre än skrivfrekvens.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss */}
            <section>
              <SectionLabel>Vad vi lärde oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter från ett multi-role community-projekt
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Multi-role-användare är värt komplexiteten.",
                    body:  "Många plattformar tvingar användare skapa separata konton för olika roller. Vi valde motsatsen och det är vad community-användare faktiskt uppskattar — en inloggning, all kontext.",
                  },
                  {
                    num:   "02",
                    title: "Sökmotor är hjärtat i en bok-community.",
                    body:  "Vi la mer tid på sökfunktionen än vi planerat. Sökresultat ska filtreras på genre, författare, förlag, betyg och era — och resultaten ska vara relevanta, inte bara exakta.",
                  },
                  {
                    num:   "03",
                    title: "Notifieringar måste vara dämpade.",
                    body:  "En aktiv läsare följer kanske 30 personer och vill inte ha en notis per aktivitet. Vi byggde intelligent gruppering — \"3 nya recensioner från personer du följer\" — istället för individuella pingar.",
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
                Tre användartyper som hittar varandra naturligt
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Bookiz har idag en aktiv community där tre användartyper hittar varandra
                  naturligt.{" "}
                  <strong className="font-semibold text-text">Författare når läsare</strong>{" "}
                  utan förlagens mellanhand,{" "}
                  <strong className="font-semibold text-text">läsare hittar smala svenska titlar</strong>{" "}
                  de inte annars sett, och{" "}
                  <strong className="font-semibold text-text">förlag får direktkontakt</strong>{" "}
                  med en engagerad publik.
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
                  <dd className="mt-0.5 text-text">Community & Bok</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och aktiv</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "PostgreSQL", "Tailwind", "Feeds"].map((t) => (
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
                    href="https://bookiz.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    bookiz.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Bygga en community-plattform?</p>
              <p className="body-md mt-3">
                Vi har erfarenhet av plattformar där flera användartyper måste samexistera —
                från early-stage MVP till skalad produkt med aktiv community.
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
          eyebrow="Vill ni bygga en community-plattform?"
          title="Vi har erfarenheten av att låta flera användartyper samexistera i en och samma produkt."
          description="Multi-role-arkitektur, feed-system och social infrastruktur — utan att det tar 18 månader att bygga. Boka ett samtal."
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
