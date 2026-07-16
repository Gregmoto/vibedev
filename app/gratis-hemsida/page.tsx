import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FreeWebsiteForm } from "@/components/forms/free-website-form";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { createMetadata, siteConfig } from "@/lib/metadata";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = createMetadata(
  "Vi bygger din hemsida gratis – betala bara om du är nöjd",
  "VibeDev bygger din nya hemsida helt utan risk. Du ser den färdiga sidan först – är du inte nöjd betalar du ingenting. Är du nöjd betalar du det pris vi kom överens om. 100% riskfritt.",
  "/gratis-hemsida",
  {
    keywords: [
      "hemsida gratis",
      "bygga hemsida",
      "webbyrå",
      "hemsida utan risk",
      "fast pris hemsida",
      "webbdesign sverige",
    ],
  },
);

/* ── Innehåll ─────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    num: "01",
    title: "Berätta vad du behöver",
    body: "Fyll i formuläret och beskriv din verksamhet och vad du vill att sidan ska göra. Vi återkommer inom 24 timmar med ett fast pris.",
  },
  {
    num: "02",
    title: "Vi bygger – du väntar",
    body: "Vi bygger hela sidan klart, utan att du betalar en krona. Du ser resultatet live på en förhandslänk.",
  },
  {
    num: "03",
    title: "Nöjd? Då betalar du. Annars inte.",
    body: "Gillar du sidan betalar du det överenskomna fasta priset och sidan är din. Gillar du den inte går vi skilda vägar – helt kostnadsfritt.",
  },
];

const INCLUDED = [
  "Modern, snabb hemsida byggd med senaste tekniken",
  "Mobilanpassad design",
  "Grundläggande SEO – titlar, beskrivningar, strukturerad data",
  "Kontaktformulär eller bokning",
  "Fast pris – överenskommet innan vi börjar, aldrig mer",
  "Du äger allt: kod, design och domän",
];

const FAQS = [
  {
    q: "Är det verkligen gratis om jag inte är nöjd?",
    a: "Ja. Betalar gör du bara om du väljer att behålla sidan. Säger du nej tackar vi för oss – ingen faktura, inget tjat.",
  },
  {
    q: "Vad kostar det om jag är nöjd?",
    a: "Vi kommer överens om ett fast pris innan vi börjar bygga, baserat på vad du behöver. Priset ändras aldrig efteråt.",
  },
  {
    q: "Hur lång tid tar det?",
    a: "De flesta sidor är klara för granskning inom 1–2 veckor.",
  },
  {
    q: "Kan ni bygga mer än hemsidor?",
    a: "Ja – webbshoppar, bokningssystem och skräddarsydda webbappar. Beskriv vad du behöver i formuläret så återkommer vi.",
  },
];

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem", url: siteConfig.url },
    { name: "Gratis hemsida", url: `${siteConfig.url}/gratis-hemsida` },
  ]),
  getFAQSchema(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hemsida utan risk – betala bara om du är nöjd",
    description:
      "Vi bygger din hemsida klart innan du betalar. Är du inte nöjd kostar det ingenting. Är du nöjd betalar du det fasta pris vi kom överens om.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: { "@type": "Country", name: "Sverige" },
    url: `${siteConfig.url}/gratis-hemsida`,
  },
];

/* ── Sida ─────────────────────────────────────────────────────────────────── */

export default function GratisHemsidaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="page-hero border-b border-line/50">
        <Container className="pb-14 pt-20 sm:pb-20 sm:pt-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              100% riskfritt
            </span>

            <h1 className="heading-xl mt-5 text-balance">
              Vi bygger din hemsida. Gratis – tills du är nöjd.
            </h1>

            <p className="body-lg mt-6">
              Du betalar ingenting i förskott. Vi bygger klart din sida, du granskar den i
              lugn och ro. Är du inte nöjd? Då kostar det dig noll kronor. Är du nöjd? Då
              betalar du det pris vi kom överens om. Inga bindningar, inga dolda avgifter.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4">
              <LinkButton href="#kontakt">Berätta om ditt projekt</LinkButton>
              <Link
                href="#sa-fungerar-det"
                className="text-sm font-medium text-muted transition hover:text-brand"
              >
                Se hur det fungerar ↓
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Så fungerar det ─────────────────────────────────────────────── */}
      <Section id="sa-fungerar-det">
        <SectionHeading
          eyebrow="PROCESSEN"
          title="Så fungerar det"
          description="Tre steg. Du tar ingen risk i något av dem."
          className="mb-12"
        />

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="flex flex-col rounded-2xl border border-line bg-bg p-7"
            >
              <span className="font-display text-2xl font-bold tracking-tight text-brand">
                {step.num}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-text">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-7 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Hur kan det vara gratis? ────────────────────────────────────── */}
      <Section size="tight">
        <div className="surface-elevated max-w-3xl px-7 py-10 sm:px-10">
          <p className="eyebrow">RIMLIG FRÅGA</p>
          <h2 className="heading-md mt-2">Hur kan det vara gratis?</h2>
          <p className="mt-5 text-base leading-[1.85] text-muted">
            Enkelt: vi är säkra på vårt hantverk. Vi bygger snabbt och modernt, och vi vet
            att de flesta som ser sin färdiga sida vill behålla den. Därför tar vi hela
            risken – inte du. Du behöver aldrig chansa på en byrå igen.
          </p>
        </div>
      </Section>

      {/* ── Det här ingår alltid ────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="INGÅR"
          title="Det här ingår alltid"
          description="Inga tillägg, inga överraskningar på fakturan."
          className="mb-10"
        />

        <ul className="max-w-3xl divide-y divide-line border-y border-line">
          {INCLUDED.map((item) => (
            <li key={item} className="py-5 text-base leading-7 text-text">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <Section size="tight">
        <SectionHeading eyebrow="FAQ" title="Vanliga frågor" className="mb-10" />

        <FaqAccordion
          className="max-w-3xl"
          items={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
        />
      </Section>

      {/* ── Kontaktformulär ─────────────────────────────────────────────── */}
      <Section id="kontakt">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="eyebrow">KOM IGÅNG</p>
            <h2 className="heading-lg mt-2">Berätta om ditt projekt</h2>
            <p className="body-md mt-5 max-w-md">
              Fyll i formuläret så återkommer vi inom 24 timmar med ett fast pris. Helt
              förutsättningslöst.
            </p>

            <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 px-6 py-5">
              <p className="text-sm leading-7 text-muted">
                <strong className="font-semibold text-text">Kom ihåg:</strong> du betalar
                först när sidan är klar och du är nöjd. Säger du nej kostar det dig noll
                kronor.
              </p>
            </div>
          </div>

          <div className="surface-elevated px-6 py-8 sm:px-8">
            <FreeWebsiteForm />
          </div>
        </div>
      </Section>
    </>
  );
}
