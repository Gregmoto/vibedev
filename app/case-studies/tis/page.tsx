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
  "TIS — digital teoriplattform för B-körkortet på 11 språk | VibeDev",
  "Vi byggde TIS: en teoriplattform för svenska B-körkortet med övningsprov, AI-förklaringar, AI-tutor och flerspråkigt stöd på 11 språk. Läs hur vi byggde den.",
  "/case-studies/tis",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "TIS",          url: `${siteConfig.url}/case-studies/tis` },
  ]),
  getCaseStudySchema({
    slug:        "tis",
    projectName: "TIS",
    summary:
      "Digital teoriplattform för svenska B-körkortet — övningsprov, AI-förklaringar och flerspråkigt stöd på 11 språk.",
    industry:    "EdTech / Körkort",
    techStack:   ["React 18", "Vite", "TypeScript", "Tailwind", "Supabase", "Edge Functions", "Gemini 2.5 Flash", "ElevenLabs"],
    publishedAt: "2026-06-18",
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

export default async function TisPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "tis").slice(0, 3);

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
              <span className="text-text">TIS</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                EDTECH / KÖRKORT
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Teoriplattform för B-körkortet — på 11 språk
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              TIS är en digital teoriplattform för svenska B-körkortet. Eleven får övningsprov,
              AI-genererade förklaringar och flerspråkigt stöd på 11 språk — byggt särskilt för
              den som ska lära sig både trafikregler och ett nytt språk samtidigt.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["React 18", "Vite", "TypeScript", "Tailwind", "Supabase", "Edge Functions", "Gemini 2.5 Flash", "ElevenLabs"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om en liknande plattform</LinkButton>
              <a
                href="https://tisonline.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök tisonline.se ↗
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
                Teoriplugg är torrt — och svårt på ett nytt språk
              </h2>
              <Prose>
                <p>
                  Att plugga inför teoriprovet för B-körkort är torrt, och svårtillgängligt för
                  den som inte har svenska som modersmål. Befintliga tjänster erbjuder ofta bara
                  frågor utan förklaring och saknar stöd för flerspråkiga elever.
                </p>
                <p>
                  Tröskeln blir hög för nyanlända som ska lära sig både trafikregler och ett nytt
                  språk samtidigt — att svara rätt eller fel räcker inte när man inte förstår varför.
                </p>
              </Prose>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Kärnan:</strong>{" "}
                  eleven behöver inte fler frågor, utan att förstå svaren — på sitt eget språk,
                  med förklaringar som går att läsa och lyssna på.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                En inlärningsplattform — inte bara en frågebank
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Öva och simulera prov</h3>
                  <BulletList items={[
                    "Övningsprov och tidsbegränsade, simulerade riktiga prov",
                    "Frågebank med AI-genererade pedagogiska förklaringar, optimerade för uppläsning",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">AI-stöd för förståelse</h3>
                  <BulletList items={[
                    "”Trafiktutor” — en flerspråkig AI-chatt för trafikfrågor",
                    "Bildanalys av parkeringsskyltar — ladda upp ett foto och få en förklaring",
                    "Premium Learning Support: veckovisa fokusområden baserade på elevens svaga ämnen",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Innehåll och vägledning</h3>
                  <BulletList items={[
                    "Vägmärkesguide med 610 svenska vägmärken i 20 kategorier",
                    "Teorilektioner, blogg, dagliga trafikfakta och mål/badges",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Redaktionellt admin</h3>
                  <BulletList items={[
                    "Fullt admin med frågebank, taggar, ämnen, kluster och översättningshantering",
                  ]} />
                </div>

              </div>
            </section>

            {/* Teknik */}
            <section>
              <SectionLabel>Teknik</SectionLabel>
              <h2 className="heading-md mb-5">
                React, Supabase och AI för förklaringar och röst
              </h2>
              <Prose>
                <p>
                  Frontend är byggd i <strong className="font-medium text-text">React 18</strong> med{" "}
                  <strong className="font-medium text-text">Vite</strong>, TypeScript,{" "}
                  <strong className="font-medium text-text">Tailwind</strong> och shadcn/ui, med
                  flerspråkighet via react-i18next.
                </p>
                <p>
                  Backend körs på <strong className="font-medium text-text">Supabase</strong> med
                  Postgres, radnivåsäkerhet (RLS) och <strong className="font-medium text-text">Edge
                  Functions</strong> i Deno. AI-förklaringar och bildanalys hanteras via{" "}
                  <strong className="font-medium text-text">Gemini 2.5 Flash</strong>, text-till-tal
                  via <strong className="font-medium text-text">ElevenLabs</strong> och e-post via Resend.
                </p>
              </Prose>
            </section>

            {/* Höjdpunkter */}
            <section>
              <SectionLabel>Höjdpunkter</SectionLabel>
              <h2 className="heading-md mb-6">
                Fem saker som gör TIS annorlunda
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Stöd för 11 språk.",
                    body:  "Inklusive arabiska, somaliska, turkiska, kurdiska och thai, med svenska som källspråk och diff-baserad översättningssynk så att översättningarna hålls i takt med originalet.",
                  },
                  {
                    num:   "02",
                    title: "AI-röst som en vänlig svensk körlärare.",
                    body:  "Förklaringarna skrivs som hela meningar, optimerade för uppläsning, så att eleven kan lyssna i stället för att läsa.",
                  },
                  {
                    num:   "03",
                    title: "610 vägmärken serverade statiskt.",
                    body:  "Vägmärkesguiden serveras statiskt för snabb och stabil rendering, oavsett belastning.",
                  },
                  {
                    num:   "04",
                    title: "Säker rollhantering.",
                    body:  "Roller hanteras via en separat user_roles-tabell och en security-definer-funktion, så att behörigheter hålls åtskilda från användardatan.",
                  },
                  {
                    num:   "05",
                    title: "Soft delete med papperskorg.",
                    body:  "Borttaget innehåll sparas som papperskorg-snapshots i stället för att raderas permanent, så att inget försvinner av misstag.",
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
                En plattform där eleven förstår — inte bara gissar
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  TIS är en{" "}
                  <strong className="font-semibold text-text">komplett inlärningsplattform i
                  produktion</strong> där eleven kan plugga på{" "}
                  <strong className="font-semibold text-text">11 språk</strong>, få förklaringar{" "}
                  <strong className="font-semibold text-text">upplästa</strong> och ställa frågor
                  till en <strong className="font-semibold text-text">AI-tutor</strong> — inte bara
                  svara rätt eller fel.
                </p>
              </div>
            </section>

            {/* Design */}
            <section>
              <SectionLabel>Design</SectionLabel>
              <h2 className="heading-md mb-5">
                Ljus och vänlig — byggd för att sänka tröskeln
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Tonen är ljus och vänlig med{" "}
                  <strong className="font-semibold text-text">Plus Jakarta Sans</strong>, mjuka
                  gradienter och rundade hörn — en bil-ikon som varumärkesmarkör och en samlad
                  kontomeny. TIS skiljer sig från konkurrenterna genom brett språkstöd, AI-tutor,
                  bildanalys av skyltar och transparens kring vad AI:n grundar sina råd på.
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
                  <dd className="mt-0.5 text-text">EdTech / Körkort</dd>
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
                    {["React 18", "Vite", "TypeScript", "Tailwind", "Supabase", "Gemini 2.5 Flash", "ElevenLabs"].map((t) => (
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
                    href="https://tisonline.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    tisonline.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Bygga en inlärningsplattform?</p>
              <p className="body-md mt-3">
                Vi har erfarenhet av flerspråkiga, AI-stödda produkter — från översättningssynk och
                text-till-tal till bildanalys och säker rollhantering, från idé till produktion.
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
          eyebrow="Vill ni bygga en AI-stödd inlärningsplattform?"
          title="Flerspråkigt stöd, AI-förklaringar, text-till-tal och bildanalys — byggt för att sänka tröskeln för riktiga användare."
          description="Från frågebank och översättningssynk till AI-tutor och säker rollhantering. Boka ett samtal."
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
