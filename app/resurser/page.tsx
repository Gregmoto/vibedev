import type { Metadata } from "next";
import { ResourceDownloadModal } from "@/components/conversion/resource-download-modal";
import { NewsletterSignup } from "@/components/conversion/newsletter-signup";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { resources } from "@/content/resources";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/resurser",
    fallbackTitle: "Gratis resurser — Guider, mallar och checklistor | VibeDev",
    fallbackDescription:
      "Praktiska resurser för founders och produktteam: MVP-checklista, AI-guide, kravspec-mall och mer.",
    keywords: ["mvp checklista", "ai guide", "kravspec mall", "produktutveckling resurser", "gratis guider"],
  });
}

/* ── PDF icon ────────────────────────────────────────────────────────────── */

function IconPdf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",     url: siteConfig.url },
    { name: "Resurser", url: `${siteConfig.url}/resurser` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="GRATIS RESURSER"
        title="Praktiska guider för team som vill bygga med mer klarhet."
        description="Allt vi delar här är skrivet av oss som faktiskt bygger produkter — inte av marketing. Ladda ned, använd, dela vidare."
      />

      {/* ── Resource grid ─────────────────────────────────────────────────── */}
      <Section size="tight">
        <SectionHeading
          eyebrow="GUIDER & CHECKLISTOR"
          title="Tre resurser — inga formulär, bara innehåll."
          description="Ange din e-post och få PDF:en direkt i inboxen. Vi skickar inga säljmail."
          className="mb-10"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.source}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-bg shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Card header — format + page count */}
              <div className="border-b border-line/60 bg-brand/5 px-7 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                    <IconPdf className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                      {resource.format}
                    </p>
                    <p className="text-xs text-muted">{resource.pageCount} sidor</p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-display text-xl font-bold tracking-tight text-text">
                  {resource.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                  {resource.description}
                </p>

                {/* CTA — triggers modal */}
                <div className="mt-8">
                  <ResourceDownloadModal resource={resource} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Newsletter section ─────────────────────────────────────────────── */}
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <SectionHeading
            eyebrow="NYHETSBREV"
            title="Få nya guider direkt i inboxen."
            description="Vi skickar ett mejl ungefär en gång i månaden — alltid med en konkret guide eller insikt, aldrig säljpitchar."
            align="center"
            className="mb-8"
          />
          <div className="mx-auto max-w-sm">
            <NewsletterSignup />
          </div>
        </div>
      </Section>
    </>
  );
}
