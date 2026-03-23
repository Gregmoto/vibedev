import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Case studies", "Exempel på digitala produkter, MVP:er och plattformar byggda av VibeDev.", "/case-studies");

export default function CaseStudiesPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Case studies</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Här visar vi hur strategi, design och utveckling blir mätbara resultat för våra kunder.
      </p>
    </Section>
  );
}
