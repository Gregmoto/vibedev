import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Om oss", "Lär känna VibeDev och hur vi jobbar med moderna digitala produkter.", "/om-oss");

export default function AboutPage() {
  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Om oss</h1>
      <p className="mt-4 max-w-2xl text-muted">
        VibeDev är ett modernt produktteam för företag som vill kombinera snabb execution med stark teknisk grund.
      </p>
    </Section>
  );
}
