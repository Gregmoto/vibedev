import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { resources } from "@/content/resources";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/resurser",
    fallbackTitle: "Resurser",
    fallbackDescription: "Gratis guider, checklistor och material för företag som bygger digitala produkter.",
    keywords: ["resurser", "checklistor", "guider", "mvp", "produktutveckling"],
  });
}

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resurser"
        title="Guider, checklistor och material för team som bygger digitala produkter."
        description="Här samlar vi praktiska resurser som hjälper er att planera, prioritera och bygga smartare."
      />
      <Section size="tight">
        <SectionHeading
          eyebrow="Gratis material"
          title="Resurser som hjälper er fatta bättre beslut innan ni bygger."
          description="Materialet är skrivet för founders, produktägare och team som vill gå in i utveckling med tydligare prioritering och mindre osäkerhet."
          actions={<LinkButton href="/boka-mote" variant="secondary">Behöver ni mer stöd?</LinkButton>}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.title} className="p-7">
              <Badge tone="accent">{resource.format}</Badge>
              <h2 className="heading-md mt-5 text-2xl">{resource.title}</h2>
              <p className="body-md mt-3">{resource.description}</p>
              <div className="mt-6 flex gap-3">
                <LinkButton href="/kontakt" size="sm">
                  Be om material
                </LinkButton>
                <LinkButton href="/blogg" variant="secondary" size="sm">
                  Läs bloggen
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
