import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PackagesSection } from "@/components/home/packages-section";
import { serviceIntro, services } from "@/content/services";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/tjanster",
    fallbackTitle: "Tjänster — Apputveckling, webbappar & AI-lösningar | VibeDev",
    fallbackDescription:
      "Vi bygger appar, webbappar, AI-funktioner och MVP:er. Tre tydliga sätt att starta: AI Sprint, MVP-utveckling och Produktpartnerskap. Få offert.",
    keywords: ["apputveckling", "webbapputveckling", "ai-lösningar", "mvp-utveckling", "produktstrategi", "ui ux design"],
  });
}

export default function ServicesPage() {
  const schemas = [
    getBreadcrumbSchema([
      { name: "Hem",      url: siteConfig.url },
      { name: "Tjänster", url: `${siteConfig.url}/tjanster` },
    ]),
    ...services.map((s) => getServiceSchema(s)),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="TJÄNSTER"
        title="Utveckling och produktstöd som faktiskt levererar — inte bara dokumenterar."
        description="Vi hjälper founders, scaleups och produktteam att bygga appar, webbappar och AI-lösningar med rätt scope, rätt tempo och ett team som förstår affären."
        actions={
          <>
            <LinkButton href="/boka-mote">Boka samtal</LinkButton>
            <LinkButton href="/kontakt" variant="secondary">
              Skicka förfrågan
            </LinkButton>
          </>
        }
      />

      {/* ── Overview ──────────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid-content">
          <div>
            <SectionHeading
              eyebrow="VAD NI FÅR"
              title={serviceIntro.title}
              description={serviceIntro.description}
            />
          </div>
          <Card variant="outlined" className="p-8">
            <div className="space-y-4">
              {serviceIntro.points.map((point) => (
                <div key={point} className="flex gap-3 text-sm text-muted sm:text-base">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* ── Packages ──────────────────────────────────────────────────────── */}
      <PackagesSection />

      {/* ── Service cards ─────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="ALLA TJÄNSTER"
          title="Välj det som passar er situation."
          description="Oavsett om ni har ett tydligt scope eller behöver hjälp att definiera det — vi tar ett samtal och berättar vad som är rimligt för just er."
          className="mb-10"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.slug} id={service.slug}>
            <Card
              variant="elevated"
              className="flex h-full flex-col p-8"
            >
              {/* Title + subtitle */}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-text">
                  {service.title}
                </h3>
                {"subtitle" in service && service.subtitle && (
                  <p className="mt-0.5 text-sm font-medium text-brand">
                    {service.subtitle as string}
                  </p>
                )}
              </div>

              {/* Problem */}
              <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
                {service.problem}
              </p>

              {/* Deliverables */}
              <ul className="mt-6 space-y-2.5">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8 pt-2">
                <LinkButton href={service.cta.href} variant="secondary" className="w-full justify-center sm:w-auto">
                  {service.cta.label}
                </LinkButton>
              </div>
            </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* ── End CTA ───────────────────────────────────────────────────────── */}
      <Section>
        <div className="surface-elevated px-6 py-12 sm:px-10">
          <SectionHeading
            eyebrow="NÄSTA STEG"
            title="Behöver ni hjälp att välja rätt spår?"
            description="Vi tar ett samtal, lyssnar på er situation och hjälper er förstå vad som är rätt nästa steg. Utan säljsnack — bara ett ärligt samtal om vad som är rimligt för just er."
            actions={
              <>
                <LinkButton href="/boka-mote">Boka strategisamtal →</LinkButton>
                <LinkButton href="/kontakt" variant="secondary">
                  Skicka förfrågan istället →
                </LinkButton>
              </>
            }
          />
        </div>
      </Section>
    </>
  );
}
