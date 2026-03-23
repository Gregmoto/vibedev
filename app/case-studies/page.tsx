import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage, getPublishedCaseStudies } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/case-studies",
    fallbackTitle: "Case studies",
    fallbackDescription: "Exempel på digitala produkter, MVP:er och plattformar byggda av VibeDev.",
    keywords: ["case studies", "mvp", "apputveckling", "webbapp", "ai"],
  });
}

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Så omsätter vi produktidéer till tydliga affärsresultat."
        description="Här visar vi hur strategi, design och utveckling blir lanserade produkter, effektivare flöden och bättre användarupplevelser."
        actions={
          <>
            <LinkButton href="/boka-mote">Boka möte</LinkButton>
            <LinkButton href="/kontakt" variant="secondary">
              Kontakta oss
            </LinkButton>
          </>
        }
      />

      <Section size="tight">
        <SectionHeading
          eyebrow="Utvalda case"
          title="Tre exempel på hur rätt produktarbete ger affärseffekt."
          description="Case studies är ofta det tydligaste sättet att visa hur strategi, design och utveckling fungerar tillsammans i praktiken."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((item) => (
            <CaseStudyCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          {caseStudies.map((item, index) => (
            <Card key={item.slug} className="overflow-hidden p-0" variant={index % 2 === 0 ? "elevated" : "default"}>
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-white/5 p-8 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={index % 3 === 0 ? "brand" : index % 3 === 1 ? "accent" : "success"}>
                      {item.industry}
                    </Badge>
                  </div>
                  <h2 className="heading-md mt-5 text-3xl">{item.projectName}</h2>
                  <p className="body-lg mt-4">{item.summary}</p>

                  <div className="mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Kundproblem</p>
                    <p className="body-md mt-3">{item.customerProblem}</p>
                  </div>

                  <div className="mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Lösning</p>
                    <p className="body-md mt-3">{item.solution}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Process</p>
                    <div className="mt-5 space-y-5">
                      {item.process.map((step, stepIndex) => (
                        <div key={step} className="flex gap-4">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-sm font-semibold text-brand">
                            {stepIndex + 1}
                          </span>
                          <p className="body-md">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Resultat</p>
                    <ul className="mt-4 space-y-3">
                      {item.results.map((result) => (
                        <li key={result} className="flex gap-3 text-sm text-muted sm:text-base">
                          <span className="mt-2 h-2 w-2 rounded-full bg-brand" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Teknikstack</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.techStack.map((tech) => (
                        <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <LinkButton href={`/case-studies/${item.slug}`}>Läs hela case study</LinkButton>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Har ni ett liknande case?"
          title="Vi hjälper gärna er att definiera rätt produktspår och bygga nästa steg."
          description="Oavsett om ni behöver en ny plattform, en MVP eller AI-funktioner kan vi hjälpa er att ta projektet från idé till konkret resultat."
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
    </>
  );
}
