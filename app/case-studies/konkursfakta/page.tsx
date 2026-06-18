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
  "Konkursfakta — öppet, sökbart register över svenska konkurser | VibeDev",
  "Vi byggde Konkursfakta: ett reklamfritt register som samlar konkursdata från Bolagsverket, PoIT och tingsrätter. Läs hur vi byggde SSR-säkra bolagssidor med rik SEO för ~13 400 bolag.",
  "/case-studies/konkursfakta",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",           url: siteConfig.url },
    { name: "Case studies",  url: `${siteConfig.url}/case-studies` },
    { name: "Konkursfakta",  url: `${siteConfig.url}/case-studies/konkursfakta` },
  ]),
  getCaseStudySchema({
    slug:        "konkursfakta",
    projectName: "Konkursfakta",
    summary:
      "Öppet, sökbart register över svenska bolag i konkurs — datan från Bolagsverket, PoIT och tingsrätter samlad på ett ställe.",
    industry:    "Register / Offentlig data",
    techStack:   ["React 19", "TanStack Start", "Tailwind v4", "shadcn/ui", "Supabase", "Cloudflare Workers", "SSR", "SEO"],
    publishedAt: "2026-06-15",
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

export default async function KonkursfaktaPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "konkursfakta").slice(0, 3);

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
              <span className="text-text">Konkursfakta</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                REGISTER / OFFENTLIG DATA
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Ett öppet register över svenska konkurser — på ett ställe
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              Konkursfakta är ett öppet, sökbart register över svenska bolag i konkurs. Datan
              från Bolagsverket, Post- och Inrikes Tidningar och landets tingsrätter samlas på
              ett reklamfritt ställe — fokuserat enbart på konkurser, till skillnad från de
              breda och kommersiella tjänsterna.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["React 19", "TanStack Start", "Tailwind v4", "shadcn/ui", "Supabase", "Cloudflare Workers", "SSR", "SEO"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om en liknande plattform</LinkButton>
              <a
                href="https://konkursfakta.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök konkursfakta.se ↗
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
                Konkursdata ligger utspridd hos flera myndigheter
              </h2>
              <Prose>
                <p>
                  Uppgifter om svenska bolag i konkurs ligger utspridda hos Bolagsverket,
                  Post- och Inrikes Tidningar och landets tingsrätter. Den som behöver en samlad
                  bild tvingas leta på flera ställen och pussla ihop informationen själv.
                </p>
                <p>
                  Flera olika grupper har samma grundproblem — men inget renodlat, reklamfritt
                  register som täcker just konkurser. Allabolag och ratsit är breda och
                  kommersiella; ingen tjänst fokuserar enbart på det här.
                </p>
              </Prose>
              <div className="mt-6 space-y-4">
                {[
                  {
                    role: "L",
                    title: "Leverantörer",
                    desc:  "Bevakar fordringar och behöver veta när en motpart gått i konkurs — och hos vilken förvaltare och tingsrätt ärendet ligger.",
                  },
                  {
                    role: "A",
                    title: "Anställda",
                    desc:  "Berörs av lönegaranti och behöver förstå vad som gäller när arbetsgivaren försatts i konkurs.",
                  },
                  {
                    role: "K",
                    title: "Kreditbeslutsfattare",
                    desc:  "Bedömer motpartsrisk och vill snabbt kunna slå upp ett bolags status och historik.",
                  },
                  {
                    role: "J",
                    title: "Journalister",
                    desc:  "Behöver verifierbara, källnära uppgifter om enskilda konkurser utan att navigera flera myndighetssystem.",
                  },
                ].map(({ role, title, desc }) => (
                  <div key={role} className="flex gap-4 rounded-2xl border border-line bg-bg p-5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {role}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Kärnan:</strong>{" "}
                  uppgifterna finns redan offentligt — men inte samlade, sökbara och fria från
                  kommersiellt brus. Värdet ligger i att föra ihop dem på ett ställe.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Lösningen</SectionLabel>
              <h2 className="heading-md mb-5">
                En öppen, sökbar plattform med en sida per konkurs
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">En egen sida per bolag</h3>
                  <Prose className="mb-4">
                    <p>
                      Varje konkurs får en egen bolagssida som samlar de uppgifter som annars är
                      utspridda — strukturerat och läsbart, så att en besökare får hela bilden på
                      ett ställe.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Organisationsnummer, bransch, ort och konkursdatum",
                    "Förvaltare, tingsrätt och adress",
                    "SNI-koder och juridisk form",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Sök och senast inkomna</h3>
                  <Prose className="mb-4">
                    <p>
                      Besökare söker på bolagsnamn eller organisationsnummer och får träffarna
                      direkt. På startsidan listas de senast inkomna konkurserna, så att den som
                      bevakar löpande snabbt ser vad som tillkommit.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Sök på bolagsnamn eller organisationsnummer",
                    "Lista över de senast inkomna konkurserna",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Guidande innehåll</h3>
                  <Prose className="mb-4">
                    <p>
                      En blogg med tio guideartiklar förklarar konkursprocessen för den som är ny i
                      ämnet — från vad en konkurs innebär till hur lönegaranti och fordringar
                      hanteras.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Tio guideartiklar som förklarar konkursprocessen steg för steg",
                    "Skrivet för den som möter ämnet för första gången",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Redaktionellt admin-gränssnitt</h3>
                  <Prose className="mb-4">
                    <p>
                      Ett inloggat admin-gränssnitt låter redaktionen lägga till och redigera bolag,
                      med rollbaserad åtkomst så att rätt personer kan göra rätt saker.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Lägg till och redigera bolag direkt i gränssnittet",
                    "Rollbaserad åtkomst för redaktionen",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Teknik</SectionLabel>
              <h2 className="heading-md mb-5">
                SSR och SEO i centrum för ett register med tusentals sidor
              </h2>
              <Prose>
                <p>
                  Frontend är byggd i <strong className="font-medium text-text">React 19</strong> med{" "}
                  <strong className="font-medium text-text">TanStack Start</strong> och TanStack Router
                  — filbaserad routing och server-side rendering — tillsammans med{" "}
                  <strong className="font-medium text-text">Tailwind v4</strong>,{" "}
                  <strong className="font-medium text-text">shadcn/ui</strong> och Framer Motion.
                </p>
                <p>
                  Backend körs som TanStack server functions och server routes på{" "}
                  <strong className="font-medium text-text">Cloudflare Workers</strong>-runtime, nära
                  användaren. Databas och autentisering hanteras via{" "}
                  <strong className="font-medium text-text">Supabase</strong> med radnivåsäkerhet
                  (RLS) och rollbaserad åtkomst. Allt hostas på egen domän.
                </p>
                <p>
                  Eftersom ett register med tusentals bolag står och faller med upptäckbarhet låg
                  fokus på SSR och SEO: varje bolagssida renderas på servern med dynamisk{" "}
                  <code className="rounded bg-line/40 px-1.5 py-0.5 text-sm text-text">head()</code> och
                  egen JSON-LD, och en dynamiskt genererad sitemap listar tusentals bolags- och
                  bloggsidor så att de hittas och indexeras.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss / Höjdpunkter */}
            <section>
              <SectionLabel>Resultat &amp; höjdpunkter</SectionLabel>
              <h2 className="heading-md mb-6">
                Ett register byggt för att hittas och läsas
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Cirka 13 400 bolag i databasen.",
                    body:  "Registret samlar runt 13 400 bolag, med konkursdata som annars ligger utspridd hos Bolagsverket, PoIT och tingsrätter — nu på ett ställe.",
                  },
                  {
                    num:   "02",
                    title: "SSR-säkra bolagssidor med rik SEO.",
                    body:  "Varje bolagssida renderas på servern med dynamisk head() och JSON-LD per bolag, så att uppgifterna blir både läsbara för besökare och indexerbara för sökmotorer.",
                  },
                  {
                    num:   "03",
                    title: "Dynamisk sitemap och stabila URL:er.",
                    body:  "En dynamiskt genererad sitemap listar tusentals bolags- och bloggsidor, och läsbara, stabila URL:er byggs från slug på org.nr och bolagsnamn.",
                  },
                  {
                    num:   "04",
                    title: "Förberedd för automatisk berikning.",
                    body:  "Integration mot bolagsapi.se är förberedd för att automatiskt berika förvaltar- och tingsrättsdata allteftersom registret växer.",
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

            {/* Design */}
            <section>
              <SectionLabel>Design</SectionLabel>
              <h2 className="heading-md mb-5">
                Editoriell och lugn — medvetet långt från kreditupplysning
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Tonen är{" "}
                  <strong className="font-semibold text-text">editoriell och lugn</strong>, medvetet
                  långt ifrån den kommersiella kreditupplysningens uttryck. Display-typsnittet{" "}
                  <strong className="font-semibold text-text">Fraunces</strong> med kursiva accenter
                  kombineras med <strong className="font-semibold text-text">Inter</strong> i brödtext,
                  i en varm beige- och amber-palett mot ljus bakgrund med generöst negativt utrymme.
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
                  <dd className="mt-0.5 text-text">Register / Offentlig data</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och i produktion</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["React 19", "TanStack Start", "Tailwind v4", "shadcn/ui", "Supabase", "Cloudflare Workers"].map((t) => (
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
                    href="https://konkursfakta.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    konkursfakta.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Bygga ett sökbart register?</p>
              <p className="body-md mt-3">
                Vi har erfarenhet av datadrivna plattformar med tusentals sidor — SSR, strukturerad
                SEO, sökbara register och redaktionella admin-gränssnitt, från idé till produktion.
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
          eyebrow="Vill ni bygga ett datadrivet register?"
          title="Sökbara plattformar med tusentals sidor, SSR och strukturerad SEO — byggt för att hittas och hålla över tid."
          description="Från offentlig data till en samlad, indexerbar produkt med redaktionellt gränssnitt. Boka ett samtal."
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
