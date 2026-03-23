import type { Metadata } from "next";
import { ProjectInquiryForm } from "@/components/forms/project-inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/boka-mote",
    fallbackTitle: "Offert och boka möte",
    fallbackDescription: "Boka ett möte med VibeDev eller skicka en offertförfrågan för ert nästa projekt.",
    keywords: ["boka möte", "offert", "projektförfrågan", "mvp", "apputveckling"],
  });
}

export default function BookMeetingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Boka möte"
        title="Få ett tydligare nästa steg för ert projekt."
        description="Skicka en projektförfrågan så återkommer vi med en första rekommendation kring scope, upplägg, budgetnivå och vad som är rimligt att göra först."
        actions={<Badge tone="brand">Svar inom 24 timmar</Badge>}
      />

      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Offert / projektförfrågan"
              title="För team som vill komma vidare utan fler otydliga diskussioner."
              description="Beskriv projektet så konkret ni kan. Ju tydligare input, desto mer relevant första återkoppling kan vi ge."
            />
            <Card variant="outlined" className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Det här hjälper vi er reda ut</p>
              <div className="mt-5 space-y-4 text-sm text-muted">
                <p>Vilken typ av lösning som är mest rimlig att bygga nu</p>
                <p>Hur projektet bör scopeas för att undvika onödig kostnad och tid</p>
                <p>Om ni bör börja med MVP, förstudie, designspår eller direkt utveckling</p>
              </div>
            </Card>
          </div>

          <div className="surface-elevated p-6 sm:p-8">
            <ProjectInquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
