import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

type PodcastEpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PodcastEpisodePageProps): Promise<Metadata> {
  const { slug } = await params;

  return createMetadata("Podcastavsnitt", `Avsnittsmall för ${slug}.`, `/podcast/${slug}`);
}

export default async function PodcastEpisodePage({ params }: PodcastEpisodePageProps) {
  const { slug } = await params;

  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Podcastavsnitt</h1>
      <p className="mt-4 max-w-2xl text-muted">Dynamisk avsnittsmall för slug: {slug}</p>
    </Section>
  );
}
