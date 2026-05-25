import type { Metadata } from "next";
import { contactFaq, contactDetails } from "@/content/contact";
import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/kontakt",
    fallbackTitle: "Kontakta VibeDev — Begär offert eller boka samtal",
    fallbackDescription:
      "Berätta vad ni vill bygga, så återkommer vi inom 24 timmar med ett tydligt nästa steg. Telefon, e-post eller bokningskalender.",
    keywords: ["kontakt vibedev", "begär offert", "apputveckling offert", "boka samtal", "webbprojekt"],
  });
}

export default function ContactPage() {
  const schemas = [
    getFAQSchema(contactFaq.map((f) => ({ q: f.question, a: f.answer }))),
    getBreadcrumbSchema([
      { name: "Hem",     url: siteConfig.url },
      { name: "Kontakt", url: `${siteConfig.url}/kontakt` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <PageHeader
        eyebrow="Kontakt"
        title="Berätta vad ni vill bygga, så visar vi bästa vägen framåt."
        description="Oavsett om ni behöver en MVP, en ny plattform eller AI-funktioner hjälper vi er att definiera ett smart nästa steg."
      />

      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="surface-elevated p-6 sm:p-8">
            <SectionHeading
              eyebrow="Kontaktformulär"
              title="En enkel väg in till ett första relevant samtal."
              description="Skriv kort om ert behov så återkommer vi med ett tydligt nästa steg. Ni behöver inte ha allt klart för att höra av er."
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <Card variant="outlined" className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Kontaktuppgifter</p>
              <div className="mt-5 space-y-4">
                {contactDetails.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block text-sm font-medium text-text transition hover:text-brand"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-text">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Tryggt första steg</p>
              <p className="body-md mt-4">
                Vi håller första kontakten enkel och tydlig. Ni får raka rekommendationer, ingen byråjargong och
                ett ärligt svar på vad som är mest rimligt att göra härnäst.
              </p>
              <div className="mt-6">
                <LinkButton href="/boka-mote" variant="secondary">
                  Gå till offert / boka möte
                </LinkButton>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Vanliga frågor"
              title="Kort FAQ för företag som funderar på att höra av sig."
              description="Här är några vanliga frågor från team som står inför ett nytt digitalt projekt eller behöver hjälp att reda ut nästa steg."
            />
          </div>
          <FaqAccordion items={contactFaq} />
        </div>
      </Section>
    </>
  );
}
