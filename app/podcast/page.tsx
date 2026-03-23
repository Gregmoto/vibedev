import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Podcast", "Podcast om vibecoding, produktbygge, AI och digital tillväxt.", "/podcast");

export default function PodcastPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Podcast</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Samtal om produktutveckling, teknik, AI och hur moderna bolag bygger med bättre fart.
      </p>
    </Section>
  );
}
