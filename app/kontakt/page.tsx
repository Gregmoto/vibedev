import type { Metadata } from "next";
import { contactFaq } from "@/content/contact";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";
import { CONTACT } from "@/lib/config/contact";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/kontakt",
    fallbackTitle: "Kontakta VibeDev — Begär offert eller boka samtal",
    fallbackDescription:
      "Berätta vad ni vill bygga, så återkommer vi inom 24 timmar med ett tydligt nästa steg. Telefon, e-post eller bokningskalender.",
    keywords: ["kontakt vibedev", "begär offert", "apputveckling offert", "boka samtal", "webbprojekt"],
  });
}

/* ── Inline SVG icons ────────────────────────────────────────────────────── */

type IconProps = { className?: string };

function IconCalendar({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconMail({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconPhone({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.8 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 14.92z" />
    </svg>
  );
}

function IconShield({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ── Contact option card ─────────────────────────────────────────────────── */

function ContactCard({
  Icon,
  title,
  description,
  action,
}: {
  Icon: (props: IconProps) => React.ReactElement;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-6 transition-shadow hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <h3 className="mt-4 text-base font-bold tracking-tight text-text">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

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

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="KONTAKT"
        title="Berätta vad ni vill bygga — vi hör av oss inom 24 timmar."
        description="Oavsett om ni har en färdig brief eller bara en idé i huvudet, hjälper vi er definiera ett smart nästa steg. Inga säljpitchar — bara raka rekommendationer."
      />

      {/* ── Main 2-column layout ────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ── Left: form ────────────────────────────────────────────── */}
          <div className="surface-elevated p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              Skicka en förfrågan
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Skriv kort vad ni vill ha hjälp med så återkommer vi inom 24 timmar med ett
              tydligt nästa steg. Ni behöver inte ha allt klart.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
            <p className="mt-4 text-xs text-muted">
              Vi besvarar inom 24 timmar, måndag–fredag.
            </p>
          </div>

          {/* ── Right: contact cards ──────────────────────────────────── */}
          <div className="space-y-5">
            <ContactCard
              Icon={IconCalendar}
              title="Boka samtal direkt"
              description="Föredrar ni att prata istället? Boka 20 minuter direkt i kalendern."
              action={
                <LinkButton href="/boka-mote" variant="secondary" className="w-full justify-center">
                  Öppna bokningskalender →
                </LinkButton>
              }
            />

            <ContactCard
              Icon={IconMail}
              title="Maila oss"
              description="Vi svarar inom en arbetsdag."
              action={
                <a
                  href={CONTACT.emailHref}
                  className="text-sm font-semibold text-brand transition hover:text-text"
                >
                  {CONTACT.email}
                </a>
              }
            />

            <ContactCard
              Icon={IconPhone}
              title="Ring oss"
              description="Måndag–fredag, 09–17."
              action={
                <a
                  href={CONTACT.phoneHref}
                  className="text-sm font-semibold text-brand transition hover:text-text"
                >
                  {CONTACT.phone}
                </a>
              }
            />
          </div>
        </div>

        {/* ── Trust banner (full-width below grid) ──────────────────────── */}
        <div className="mt-8 flex gap-5 rounded-2xl border border-brand/20 bg-brand/5 px-8 py-7 sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15">
            <IconShield className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-text">Tryggt och utan press</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Första kontakten är enkel: ni får raka rekommendationer, ingen byråjargong och ett
              ärligt svar på vad som är mest rimligt att göra härnäst. Vi signerar NDA om ni
              vill innan vi diskuterar detaljer.
            </p>
          </div>
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="VANLIGA FRÅGOR"
          title="Vanliga frågor från företag som funderar på att höra av sig."
          description="Här är några vanliga frågor från team som står inför ett nytt digitalt projekt."
          className="mb-10"
        />
        <FaqAccordion items={contactFaq} />
      </Section>
    </>
  );
}
