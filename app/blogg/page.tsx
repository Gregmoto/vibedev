import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Blogg", "Artiklar om apputveckling, MVP, AI och modern produktutveckling.", "/blogg");

export default function BlogPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Blogg</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Kunskap, perspektiv och konkreta guider för företag som bygger digitala produkter.
      </p>
    </Section>
  );
}
