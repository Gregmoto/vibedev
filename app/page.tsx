import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PatternGrid } from "@/components/ui/pattern-grid";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HomePage() {
  return (
    <>
      <Section size="hero" className="page-hero">
        <div className="surface-elevated overflow-hidden px-6 py-16 sm:px-10">
          <div className="max-w-3xl space-y-6">
            <Badge tone="brand">Digital produktstudio</Badge>
            <h1 className="heading-xl max-w-3xl text-balance">
              Vi bygger nästa version av ditt företag.
            </h1>
            <p className="body-lg max-w-2xl">
              VibeDev hjälper startups och växande bolag att lansera appar, webbappar, AI-funktioner och
              MVP:er med hög kvalitet och tydligt affärsfokus.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/boka-mote" size="lg">
                Boka möte
              </LinkButton>
              <LinkButton href="/tjanster" variant="secondary" size="lg">
                Se våra tjänster
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      <Section size="tight">
        <SectionHeading
          eyebrow="Designsystem"
          title="VibeDev UI är byggt för mörk premiumkänsla, tydliga CTA:er och hög läsbarhet."
          description="Det här är grundlagret som resten av sajten kommer att använda: färgtokens, typografi, komponenter och interaktionsmönster."
        />
        <PatternGrid className="mt-10" columns="3">
          <Card>
            <Badge tone="accent">Färger</Badge>
            <h3 className="heading-md mt-5 text-2xl">Kontrast först</h3>
            <p className="body-md mt-3">
              Mörka paneler, kalla accenter och en varm mint-ton som primär CTA ger sajten en tydlig och
              teknisk identitet.
            </p>
          </Card>
          <Card>
            <Badge tone="success">Typografi</Badge>
            <h3 className="heading-md mt-5 text-2xl">Display + läsbar kroppstext</h3>
            <p className="body-md mt-3">
              Space Grotesk driver rubrikerna. Manrope håller copy ren, modern och lätt att skanna.
            </p>
          </Card>
          <Card>
            <Badge>Interaktion</Badge>
            <h3 className="heading-md mt-5 text-2xl">Subtila men tydliga states</h3>
            <p className="body-md mt-3">
              Hover lyfter komponenter lätt. Fokusmarkeringar är synliga och tillgängliga utan att kännas klumpiga.
            </p>
          </Card>
        </PatternGrid>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Primär CTA</Button>
          <Button variant="secondary">Sekundär CTA</Button>
          <Button variant="ghost">Ghost-knapp</Button>
        </div>
      </Section>
    </>
  );
}
