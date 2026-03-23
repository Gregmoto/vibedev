import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceIntro, services } from "@/content/services";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/tjanster",
    fallbackTitle: "Tjänster",
    fallbackDescription: "Tjänster inom apputveckling, webbappar, AI och produktutveckling.",
    keywords: ["tjänster", "apputveckling", "webbapputveckling", "ai-lösningar", "produktstrategi"],
  });
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tjänster"
        title="Utveckling och produktstöd för företag som vill bygga rätt från början."
        description="Här samlar vi VibeDevs erbjudanden inom apputveckling, webbappar, AI, design och produktstrategi."
        actions={
          <>
            <LinkButton href="/boka-mote">Boka möte</LinkButton>
            <LinkButton href="/kontakt" variant="secondary">
              Kontakta oss
            </LinkButton>
          </>
        }
      />

      <Section size="tight">
        <div className="grid-content">
          <div>
            <SectionHeading eyebrow="Vad ni får" title={serviceIntro.title} description={serviceIntro.description} />
          </div>
          <Card variant="outlined" className="p-8">
            <div className="space-y-4">
              {serviceIntro.points.map((point) => (
                <div key={point} className="flex gap-3 text-sm text-muted sm:text-base">
                  <span className="mt-2 h-2 w-2 rounded-full bg-brand" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          {services.map((service, index) => (
            <Card
              key={service.slug}
              className="overflow-hidden p-0"
              variant={index % 2 === 0 ? "elevated" : "default"}
            >
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="border-b border-white/5 p-8 lg:border-b-0 lg:border-r">
                  <Badge tone={index % 3 === 0 ? "brand" : index % 3 === 1 ? "accent" : "success"}>
                    {service.title}
                  </Badge>
                  <h2 className="heading-md mt-5 text-3xl">{service.title}</h2>
                  <p className="body-lg mt-4">{service.pitch}</p>

                  <div className="mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Problem vi löser</p>
                    <p className="body-md mt-3">{service.problem}</p>
                  </div>

                  <div className="mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Vad kunden får</p>
                    <ul className="mt-4 space-y-3">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-muted sm:text-base">
                          <span className="mt-2 h-2 w-2 rounded-full bg-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Process</p>
                  <div className="mt-5 space-y-5">
                    {service.process.map((step, stepIndex) => (
                      <div key={step} className="flex gap-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-sm font-semibold text-brand">
                          {stepIndex + 1}
                        </span>
                        <p className="body-md">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <LinkButton href={service.cta.href}>{service.cta.label}</LinkButton>
                    <Link
                      href="/case-studies"
                      className="button-secondary px-5 py-3 text-sm"
                    >
                      Se relaterade case
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="surface-elevated px-6 py-12 sm:px-10">
          <SectionHeading
            eyebrow="Nästa steg"
            title="Behöver ni hjälp att välja rätt spår för ert projekt."
            description="Vi hjälper er gärna att definiera vad som ska byggas, hur omfattningen bör se ut och vilken teknisk väg som är mest rimlig för ert läge."
            actions={
              <>
                <LinkButton href="/boka-mote">Boka möte</LinkButton>
                <LinkButton href="/kontakt" variant="secondary">
                  Skicka förfrågan
                </LinkButton>
              </>
            }
          />
        </div>
      </Section>
    </>
  );
}
