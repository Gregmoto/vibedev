import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { CtaPanel } from "@/components/ui/cta-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { caseStudies } from "@/content/cases";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema, getCaseStudySchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/case-studies",
    fallbackTitle: "Case studies — Plattformar och produkter vi byggt | VibeDev",
    fallbackDescription:
      "Konkreta exempel: CMS Online, Bookiz, Mittbrottmål, Min Odling. Se hur strategi, design och utveckling skapar riktiga produkter.",
    keywords: ["case studies", "produktexempel", "mvp", "apputveckling", "webbapp", "ai-lösning"],
  });
}

/* ── Image placeholder ───────────────────────────────────────────────────── */

function ScreenshotPlaceholder({ name }: { name: string }) {
  /* TODO: Replace with a real screenshot once available.
     Recommended: 1280×800 PNG exported from Figma or a browser capture.
     Place in /public/cases/<slug>.png and swap the div for:
       <Image src={`/cases/${slug}.png`} alt={`${name} skärmdump`} fill className="object-cover" />
  */
  return (
    <div
      className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand/10 via-brand/5 to-transparent"
      aria-hidden="true"
    >
      <span className="select-none text-xs font-medium text-muted/60">
        Skärmdump — {name} (kommer snart)
      </span>
    </div>
  );
}

/* ── Case card ───────────────────────────────────────────────────────────── */

function CaseCard({ cs, index }: { cs: (typeof caseStudies)[number]; index: number }) {
  const isOngoing = cs.status === "ongoing";

  /* alternate subtle elevation so adjacent cards feel distinct */
  const cardBase =
    "overflow-hidden rounded-2xl border border-line bg-bg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl";
  const cardVariant = index % 2 === 0 ? "shadow-sm" : "";

  return (
    <article className={`${cardBase} ${cardVariant} flex flex-col`}>
      {/* Screenshot placeholder */}
      <div className="shrink-0 overflow-hidden rounded-t-2xl border-b border-line">
        <ScreenshotPlaceholder name={cs.projectName} />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-8">
        {/* Status + industry badges */}
        <div className="flex flex-wrap gap-2">
          <Badge tone={isOngoing ? "neutral" : "success"}>
            {isOngoing ? "Pågående — lansering 2026" : "Lanserad"}
          </Badge>
          <Badge tone="accent">{cs.industry}</Badge>
        </div>

        {/* Title + tagline */}
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-text">
          {cs.projectName}
        </h2>
        <p className="mt-1.5 text-base font-medium text-muted">{cs.summary}</p>

        {/* Problem */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
            Utmaningen
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{cs.customerProblem}</p>
        </div>

        {/* Deliverables */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
            {isOngoing ? "Vad vi bygger" : "Vad vi byggde"}
          </p>
          <ul className="mt-3 space-y-2">
            {cs.process.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Result highlight */}
        <div className="mt-6 rounded-xl bg-brand/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
            {isOngoing ? "Status idag" : "Resultat"}
          </p>
          <p className="mt-1 text-sm text-muted">{cs.results[0]}</p>
        </div>

        {/* Tech stack */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {cs.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer: external URL + internal case link */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
          {cs.websiteUrl && (
            <a
              href={cs.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand transition hover:text-text"
            >
              {cs.websiteUrl.replace("https://", "")} ↗
            </a>
          )}
          <Link
            href={`/case-studies/${cs.slug}`}
            className="ml-auto text-sm text-muted transition hover:text-text"
          >
            Läs hela storyn →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function CaseStudiesPage() {
  const schemas = [
    getBreadcrumbSchema([
      { name: "Hem",          url: siteConfig.url },
      { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    ]),
    ...caseStudies
      .filter((cs) => cs.status === "published")
      .map((cs) => getCaseStudySchema(cs)),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="CASE STUDIES"
        title="Plattformar och produkter vi har byggt."
        description="Riktiga projekt där strategi, design och utveckling skapade fungerande digitala produkter — inte presentationer."
        actions={
          <>
            <LinkButton href="/boka-mote">Boka samtal</LinkButton>
            <LinkButton href="/tjanster" variant="secondary">
              Se våra tjänster
            </LinkButton>
          </>
        }
      />

      {/* ── Case grid ───────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="PROJEKT"
          title="Sex lanserade produkter + ett pågående."
          description="Oavsett bransch är mönstret detsamma: rätt scope, rätt teknik och ett team som tar ägarskap hela vägen till lansering."
          className="mb-10"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {caseStudies.map((cs, i) => (
            <CaseCard key={cs.slug} cs={cs} index={i} />
          ))}
        </div>
      </Section>

      {/* ── End CTA ─────────────────────────────────────────────────────── */}
      <Section>
        <CtaPanel
          eyebrow="Har ni ett liknande case?"
          title="Oavsett om ni vill bygga en ny plattform, en MVP, en community-app eller integrera AI — vi hjälper er definiera rätt scope och bygga nästa steg."
          description="Vi tar ett samtal, lyssnar på er situation och berättar vad som är rimligt för just er. Utan säljsnack."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka samtal</LinkButton>
              <LinkButton href="/tjanster" variant="secondary">
                Se våra tjänster
              </LinkButton>
            </>
          }
        />
      </Section>
    </>
  );
}
