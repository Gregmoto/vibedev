import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Section } from "@/components/ui/section";
import {
  createMetadataForContent,
  getPublishedCaseStudies,
  getPublishedCaseStudyBySlug,
  getRelatedPublicCaseStudies,
} from "@/lib/cms-public";

export const dynamic = "force-dynamic";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const caseStudies = await getPublishedCaseStudies();

  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudyBySlug(slug);

  if (!caseStudy) {
    return createMetadataForContent({
      title: "Case study",
      description: "Case study kunde inte hittas.",
      path: `/case-studies/${slug}`,
      type: "article",
    });
  }

  return createMetadataForContent({
    title: caseStudy.projectName,
    description: caseStudy.summary,
    path: `/case-studies/${slug}`,
    seo: caseStudy.seo,
    keywords: [caseStudy.industry, ...caseStudy.techStack],
    publishedTime: caseStudy.publishedAt,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedCases = await getRelatedPublicCaseStudies(caseStudy);

  return (
    <>
      <Section size="hero" className="page-hero">
        <div className="surface-elevated max-w-5xl px-6 py-12 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">{caseStudy.industry}</Badge>
            {caseStudy.clientName ? <span className="text-sm text-muted">{caseStudy.clientName}</span> : null}
            {caseStudy.publishedAt ? (
              <span className="text-sm text-muted">{new Date(caseStudy.publishedAt).toLocaleDateString("sv-SE")}</span>
            ) : null}
          </div>
          <h1 className="heading-xl mt-6 max-w-4xl text-balance">{caseStudy.projectName}</h1>
          <p className="body-lg mt-5 max-w-3xl">{caseStudy.summary}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {caseStudy.techStack.map((tech) => (
              <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section size="tight" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="surface p-6 sm:p-10">
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="heading-md text-3xl">Kundproblem</h2>
              <p className="body-lg">{caseStudy.customerProblem}</p>
            </section>

            <section className="space-y-4">
              <h2 className="heading-md text-3xl">Lösning</h2>
              <p className="body-lg">{caseStudy.solution}</p>
            </section>

            <section className="space-y-5">
              <h2 className="heading-md text-3xl">Process</h2>
              {caseStudy.process.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-sm font-semibold text-brand">
                    {index + 1}
                  </span>
                  <p className="body-md">{step}</p>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="heading-md text-3xl">Resultat</h2>
              <ul className="space-y-3">
                {caseStudy.results.map((result) => (
                  <li key={result} className="flex gap-3 text-sm text-muted sm:text-base">
                    <span className="mt-2 h-2 w-2 rounded-full bg-brand" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <aside className="space-y-6">
          <Card variant="outlined" className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Överblick</p>
            <div className="mt-5 space-y-3 text-sm text-muted">
              <p>Bransch: {caseStudy.industry}</p>
              {caseStudy.clientName ? <p>Kund: {caseStudy.clientName}</p> : null}
              <p>Teknikstack: {caseStudy.techStack.join(", ")}</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Liknande projekt?</p>
            <p className="body-md mt-4">
              Vi hjälper bolag att definiera rätt scope, bygga skalbara lösningar och skapa tydliga resultat från första release.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <LinkButton href="/boka-mote">Boka möte</LinkButton>
              <LinkButton href="/kontakt" variant="secondary">
                Kontakta oss
              </LinkButton>
            </div>
          </Card>
        </aside>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Nästa steg"
          title="Vill ni bygga något liknande med rätt produktspår från start?"
          description="Vi hjälper team att omsätta affärsbehov till tydlig roadmap, design och teknik som går att lansera och vidareutveckla."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka möte</LinkButton>
              <LinkButton href="/tjanster" variant="secondary">
                Se våra tjänster
              </LinkButton>
            </>
          }
        />
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fler case</p>
            <h2 className="heading-lg mt-4">Relaterade case studies</h2>
          </div>
          <Link href="/case-studies" className="text-sm font-medium text-brand transition hover:text-text">
            Till översikten
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedCases.map((item) => (
            <CaseStudyCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
