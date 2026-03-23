import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/om-oss",
    fallbackTitle: "Om oss",
    fallbackDescription: "Lär känna VibeDev och hur vi jobbar med moderna digitala produkter.",
    keywords: ["om oss", "vibedev", "produktteam", "design", "utveckling"],
  });
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Om VibeDev"
        title="Ett modernt produktteam för bolag som vill bygga med mer skärpa."
        description="VibeDev kombinerar strategi, design och utveckling för företag som vill röra sig snabbare utan att tumma på kvalitet."
      />
      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-elevated p-6 sm:p-8">
            <SectionHeading
              eyebrow="Vår syn"
              title="Vi tror att starka digitala produkter byggs när affär, design och teknik hänger ihop från början."
              description="Därför arbetar vi i ett mer integrerat format än klassiska byråupplägg. Vi vill att rätt saker byggs, inte bara att mycket byggs."
            />
          </div>
          <Card variant="outlined" className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Det som präglar oss</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge tone="brand">Senior nivå</Badge>
              <Badge tone="accent">Tydlig kommunikation</Badge>
              <Badge tone="success">Produktfokus</Badge>
              <Badge tone="neutral">Hög execution</Badge>
            </div>
          </Card>
        </div>
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Strategisk skärpa",
              text: "Vi hjälper företag reda ut vad som faktiskt ska byggas, vad som kan vänta och hur produkten ska stötta affären.",
            },
            {
              title: "Design som skapar förtroende",
              text: "Bra UX och tydlig struktur gör produkter enklare att sälja, enklare att använda och enklare att vidareutveckla.",
            },
            {
              title: "Teknik som håller",
              text: "Vi bygger med fart, men utan att lämna efter oss onödig teknisk skuld eller svajiga beslut.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-7">
              <h2 className="heading-md text-2xl">{item.title}</h2>
              <p className="body-md mt-3">{item.text}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <LinkButton href="/boka-mote">Prata med VibeDev</LinkButton>
        </div>
      </Section>
    </>
  );
}
