import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Resurser", "Gratis guider, checklistor och material för företag som bygger digitala produkter.", "/resurser");

export default function ResourcesPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Resurser</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Här samlar vi guider, checklistor och konkreta resurser som hjälper er fatta bättre produktbeslut.
      </p>
    </Section>
  );
}
