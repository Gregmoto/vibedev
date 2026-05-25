import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/metadata";

/* ── Data ─────────────────────────────────────────────────────────────────── */

type ProjectStatus = "Lanserad" | "Kommande";

type Project = {
  status: ProjectStatus;
  industryTag: string;
  name: string;
  domain: string;
  description: string;
  tech: string[];
  caseHref: string;
  siteHref: string;
};

const PROJECTS: Project[] = [
  {
    status:      "Lanserad",
    industryTag: "E-HANDEL",
    name:        "CMS Online",
    domain:      "cmsonline.se",
    description:
      "Komplett CMS för e-handlare som tröttnat på att jonglera mellan Fortnox, Shopify, lagersystem och fraktbolag. Allt i en plattform — från order till bokföring.",
    tech:      ["Next.js", "Fortnox API", "Shopify", "Prisma"],
    caseHref:  "/case-studies/cms-online",
    siteHref:  "https://cmsonline.se",
  },
  {
    status:      "Lanserad",
    industryTag: "COMMUNITY",
    name:        "Bookiz",
    domain:      "bookiz.se",
    description:
      "Sveriges community för bokläsare, författare och förlag. Bygg ditt bibliotek, skapa bokklubbar, recensera böcker — eller nå läsare direkt som författare.",
    tech:      ["Next.js", "PostgreSQL", "Community-features"],
    caseHref:  "/case-studies/bookiz",
    siteHref:  "https://bookiz.se",
  },
  {
    status:      "Lanserad",
    industryTag: "LEGAL TECH",
    name:        "Mittbrottmål",
    domain:      "mittbrottmal.se",
    description:
      "Verktyg som hjälper privatpersoner förstå sitt brottmål — processen, rättigheterna och vad som väntar. Ersätter inte advokaten, men gör juridiken mer tillgänglig.",
    tech:      ["Next.js", "Strukturerad innehållsmotor", "Tailwind"],
    caseHref:  "/case-studies/mittbrottmal",
    siteHref:  "https://mittbrottmal.se",
  },
  {
    status:      "Lanserad",
    industryTag: "COMMUNITY",
    name:        "Min Odling",
    domain:      "minodling.se",
    description:
      "Community och verktyg för odlare med inbyggd växtidentifikation, personlig odlingskalender och socialt flöde. För hobbyodlare som vill ha allt på ett ställe.",
    tech:      ["Next.js", "React Native", "AI-bildigenkänning"],
    caseHref:  "/case-studies/min-odling",
    siteHref:  "https://minodling.se",
  },
  {
    status:      "Kommande",
    industryTag: "SAAS / EKONOMI",
    name:        "Endoo",
    domain:      "endoo.se",
    description:
      "Komplett SaaS för fakturering, order, inköp och bokföring — i en plattform istället för fem. För små och medelstora bolag som vill slippa licens-juggling. Beta 2026.",
    tech:      ["Next.js", "Prisma", "TypeScript", "PostgreSQL"],
    caseHref:  "/case-studies/endoo",
    siteHref:  "https://endoo.se",
  },
];

/* ── JSON-LD schemas ──────────────────────────────────────────────────────── */

function buildSchemas() {
  return PROJECTS.map((p) => ({
    "@context":   "https://schema.org",
    "@type":      "CreativeWork",
    name:          p.name,
    description:   p.description,
    url:           `${siteConfig.url}/case-studies/${p.caseHref.split("/").pop()}`,
    genre:         p.industryTag,
    author: {
      "@type": "Organization",
      name:    "VibeDev",
      url:     siteConfig.url,
    },
  }));
}

/* ── Status badge ─────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: ProjectStatus }) {
  const isLive = status === "Lanserad";
  return (
    <span
      className={[
        "absolute right-5 top-5 rounded-full px-2.5 py-1",
        "text-[11px] font-semibold uppercase tracking-[0.12em]",
        isLive
          ? "bg-green-100 text-green-700"
          : "animate-pulse bg-amber-100 text-amber-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

/* ── Single project card ──────────────────────────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg shadow-panel transition-all duration-200 hover:-translate-y-1 hover:shadow-lg-card">
      {/* Status badge — absolute top-right */}
      <StatusBadge status={project.status} />

      <div className="flex flex-1 flex-col p-6">

        {/* ── Top: tag + name + domain ─────────────────────────── */}
        <div className="space-y-1.5 pr-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            {project.industryTag}
          </p>
          <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-text">
            {project.name}
          </h3>
          <p className="text-xs text-muted">{project.domain}</p>
        </div>

        {/* ── Middle: description ───────────────────────────────── */}
        <p className="mt-4 text-[15px] leading-[1.65] text-muted line-clamp-4">
          {project.description}
        </p>

        {/* ── Tech tags ─────────────────────────────────────────── */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>

        {/* ── Bottom: links ─────────────────────────────────────── */}
        <div className="mt-6 flex items-center gap-1.5 border-t border-line pt-5 text-sm">
          {/*
            Stretch-link pattern:
            The case link stretches to fill the entire card via after:absolute after:inset-0,
            making the whole card clickable. The external link sits above it via relative z-10.
          */}
          <Link
            href={project.caseHref}
            className="font-medium text-brand transition-colors hover:text-text after:absolute after:inset-0 after:rounded-2xl"
          >
            Läs casen →
          </Link>
          <span className="text-muted/50" aria-hidden="true">·</span>
          <a
            href={project.siteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-muted transition-colors hover:text-brand"
          >
            Besök sajten ↗
          </a>
        </div>

      </div>
    </article>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export function ProjectShowcase() {
  const schemas = buildSchemas();

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <SectionHeading
        eyebrow="PROJEKT VI BYGGT"
        title="Riktiga produkter. Riktiga problem. Riktiga användare."
        description="Det här är några av plattformarna vi byggt de senaste åren — från community-appar till komplett ekonomi-SaaS. Klicka in för att läsa hur vi tänkte och vad vi lärde oss."
        align="center"
      />

      {/* ── 3-col grid ──────────────────────────────────────────────────── */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
      <div className="mt-10 flex justify-center">
        <LinkButton href="/case-studies" variant="secondary">
          Se alla case och läs hela historierna →
        </LinkButton>
      </div>
    </Section>
  );
}
