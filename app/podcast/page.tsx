import type { Metadata } from "next";
import { PodcastCard } from "@/components/cards/podcast-card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { PatternGrid } from "@/components/ui/pattern-grid";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage, getPublishedPodcastEpisodes } from "@/lib/cms-public";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/podcast",
    fallbackTitle: "Podcast",
    fallbackDescription: "Podcast om vibecoding, produktbygge, AI och digital tillväxt.",
    keywords: ["podcast", "ai", "vibecoding", "produktutveckling"],
  });
}

export default async function PodcastPage() {
  const episodes = await getPublishedPodcastEpisodes();

  return (
    <>
      <PageHeader
        eyebrow="Podcast"
        title="Samtal om vibecoding, produktutveckling, AI och digital tillväxt."
        description="Intervjuer, perspektiv och praktiska resonemang för founders, produktägare och team som bygger digitala produkter."
      />

      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-elevated p-6 sm:p-8">
            <SectionHeading
              eyebrow="Podcastöversikt"
              title="Ett format för idéer, insikter och resonemang som hjälper team att bygga smartare."
              description="Här publicerar vi avsnitt om produktutveckling, AI, vibecoding, UX och hur moderna företag skapar digitala produkter med mer skärpa."
            />
          </div>
          <div className="surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Format</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge tone="neutral">Intervjuer</Badge>
              <Badge tone="neutral">Perspektiv</Badge>
              <Badge tone="neutral">Produkt</Badge>
              <Badge tone="neutral">AI</Badge>
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-text">Vad ni får</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>Konkreta resonemang om produktbeslut och prioritering</p>
              <p>Perspektiv från gäster med erfarenhet av riktiga produktteam</p>
              <p>Insikter som kan omsättas till bättre strategi och execution</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Senaste avsnitten"
          title="Fyra avsnitt för team som vill tänka bättre kring teknik, produkt och tillväxt."
          description="Varje avsnitt är skrivet för att vara relevant för bolag som bygger appar, webbappar eller AI-funktioner."
        />
        <PatternGrid className="mt-10" columns="3">
          {episodes.map((episode) => (
            <PodcastCard key={episode.slug} episode={episode} />
          ))}
        </PatternGrid>
      </Section>
    </>
  );
}
