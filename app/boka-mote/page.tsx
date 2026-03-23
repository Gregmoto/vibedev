import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Offert och boka möte", "Boka ett möte med VibeDev eller skicka en offertförfrågan för ert nästa projekt.", "/boka-mote");

export default function BookMeetingPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Offert och boka möte</h1>
      <p className="mt-4 max-w-2xl text-muted">
        En snabb väg till rätt scope, rätt prioritering och rätt teknisk riktning för ert projekt.
      </p>
    </Section>
  );
}
