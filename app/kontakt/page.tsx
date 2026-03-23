import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Kontakt", "Kontakta VibeDev för nya digitala satsningar, appar, AI-lösningar och webbprojekt.", "/kontakt");

export default function ContactPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Kontakt</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Berätta vad ni vill bygga, så återkommer vi med ett tydligt nästa steg.
      </p>
    </Section>
  );
}
