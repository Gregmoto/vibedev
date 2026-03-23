import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Tjänster", "Tjänster inom apputveckling, webbappar, AI och produktutveckling.", "/tjanster");

export default function ServicesPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Tjänster</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Här samlar vi VibeDevs erbjudanden inom utveckling, design och produktstrategi.
      </p>
    </Section>
  );
}
