import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RentalForm } from "@/components/forms/rental-form";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { createMetadata, siteConfig } from "@/lib/metadata";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = createMetadata(
  "Hyra hemsida — fast månadsavgift med drift och support | VibeDev",
  "Hyr din hemsida i stället för att köpa den. Startavgift 4 999 kr och en månadsavgift som sätts efter projektets omfattning. Hosting, SSL, drift, backup och support ingår. Ingen bindningstid.",
  "/hyr",
  {
    keywords: [
      "hyra hemsida",
      "hyr hemsida",
      "hemsida abonnemang",
      "hemsida månadskostnad",
      "webbyrå abonnemang",
      "hyra webbshop",
    ],
  },
);

/* ── Innehåll ─────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    num: "01",
    title: "Du skickar en offertförfrågan",
    body: "Berätta kort vad du behöver — en enkel företagssida, en webbshop eller ett större system.",
  },
  {
    num: "02",
    title: "Vi räknar ut din månadskostnad",
    body: "Månadsavgiften bestäms av projektets omfattning och anges i offerten. Inga överraskningar efteråt.",
  },
  {
    num: "03",
    title: "Vi bygger och driftar",
    body: "Du fokuserar på din kärnverksamhet. Vi sköter tekniken, driften och det löpande underhållet.",
  },
];

const INCLUDED = [
  "Hosting",
  "SSL",
  "Drift och löpande underhåll",
  "Backup",
  "Support",
  "Avtalat antal timmar ändringar per månad (antalet fastställs i offerten)",
];

const ADDITIONAL = [
  "Domän",
  "Tredjepartstjänster som kräver egna abonnemang, till exempel AI-konton och SMS-utskick",
];

const TERMS = [
  "Ingen bindningstid. 3 månaders uppsägningstid.",
  "Vi äger lösningen så länge du hyr den.",
  "Utköp är möjligt — villkor anges i offerten.",
];

const FAQS = [
  {
    q: "Vem äger hemsidan?",
    a: "Vi äger lösningen så länge du hyr den. Du äger ditt innehåll, din data och din domän.",
  },
  {
    q: "Kan jag köpa ut hemsidan?",
    a: "Ja. Villkor och pris för utköp anges i offerten.",
  },
  {
    q: "Är jag bunden till något?",
    a: "Nej, ingen bindningstid. Det som gäller är 3 månaders uppsägningstid.",
  },
  {
    q: "Vad kostar det per månad?",
    a: "Månadsavgiften bestäms av projektets omfattning och anges i offerten. Startavgiften är 4 999 kr.",
  },
  {
    q: "Vad ingår i månadsavgiften?",
    a: "Hosting, SSL, drift, backup, support och det antal timmar ändringar per månad som vi kommer överens om i offerten.",
  },
  {
    q: "Tillkommer några kostnader?",
    a: "Domän kan tillkomma. Detsamma gäller tjänster som kräver egna abonnemang, till exempel AI-konton eller SMS-utskick.",
  },
  {
    q: "Hur lång tid tar det att komma igång?",
    a: "1–2 veckor.",
  },
  {
    q: "Kan jag bygga ut sidan senare?",
    a: "Ja. Vid större ingrepp avtalar vi om arbetet och justerar månadskostnaden.",
  },
  {
    q: "Vad händer om jag säger upp avtalet?",
    a: "Uppsägningstiden är 3 månader. Du behåller domän, innehåll och data.",
  },
];

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",            url: siteConfig.url },
    { name: "Hyr din hemsida", url: `${siteConfig.url}/hyr` },
  ]),
  getFAQSchema(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hyr din hemsida",
    serviceType: "Hyrmodell för hemsida, webbshop och system",
    description:
      "Hyr din hemsida i stället för att köpa den. Startavgift 4 999 kr och en månadsavgift som bestäms av projektets omfattning. Hosting, SSL, drift, backup, support och avtalat antal ändringstimmar ingår.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: { "@type": "Country", name: "Sverige" },
    url: `${siteConfig.url}/hyr`,
    offers: {
      "@type": "Offer",
      name: "Startavgift",
      price: "4999",
      priceCurrency: "SEK",
      description:
        "Startavgift 4 999 kr. Månadsavgiften bestäms av projektets omfattning och anges i offerten.",
    },
  },
];

/* ── Sida ─────────────────────────────────────────────────────────────────── */

export default function HyrPage() {
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
              Hyrmodell
            </span>

            <h1 className="heading-xl mt-5 text-balance">Hyr din hemsida</h1>

            <p className="body-lg mt-6">
              Varför lägga massa pengar på en hemsida eller ett system? Hyr istället.
            </p>

            <div className="mt-9">
              <LinkButton href="#offert">Skicka offertförfrågan</LinkButton>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Så funkar det ───────────────────────────────────────────────── */}
      <Section id="sa-funkar-det">
        <SectionHeading
          eyebrow="SÅ FUNKAR DET"
          title="Tre steg till en färdig lösning"
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

      {/* ── Pris ────────────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="surface-elevated max-w-3xl px-7 py-10 sm:px-10">
          <p className="eyebrow">PRIS</p>
          <h2 className="heading-md mt-2">Startavgift och en månadsavgift</h2>

          <dl className="mt-7 divide-y divide-line border-y border-line">
            <div className="flex flex-wrap items-baseline justify-between gap-2 py-5">
              <dt className="text-base font-medium text-text">Startavgift</dt>
              <dd className="font-display text-2xl font-bold tracking-tight text-text">
                4 999 kr
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 py-5">
              <dt className="text-base font-medium text-text">Månadsavgift</dt>
              <dd className="text-sm leading-6 text-muted sm:text-base">
                Bestäms av projektets storlek och anges i offerten
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ── Omfattning ──────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="max-w-3xl">
          <p className="eyebrow">OMFATTNING</p>
          <h2 className="heading-md mt-2">
            Allt från enkel sida till stora komplexa system
          </h2>
          <p className="mt-5 text-base leading-[1.85] text-muted">
            Vi bygger allt från en enkel företagssida till större skräddarsydda system. Du
            bestämmer omfattningen — och den avgör i sin tur månadskostnaden. Läs mer om{" "}
            <Link
              href="/tjanster"
              className="text-brand underline decoration-line underline-offset-4 transition hover:decoration-brand"
            >
              vad vi bygger
            </Link>{" "}
            eller titta på{" "}
            <Link
              href="/case-studies"
              className="text-brand underline decoration-line underline-offset-4 transition hover:decoration-brand"
            >
              projekt vi levererat
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* ── Ingår / tillkommer ──────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-bg p-7">
            <h2 className="text-lg font-semibold text-text">
              Det här ingår i månadsavgiften
            </h2>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {INCLUDED.map((item) => (
                <li key={item} className="py-3.5 text-sm leading-6 text-muted sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-bg p-7">
            <h2 className="text-lg font-semibold text-text">Det här kan tillkomma</h2>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {ADDITIONAL.map((item) => (
                <li key={item} className="py-3.5 text-sm leading-6 text-muted sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Uppgraderingar + villkor + leveranstid ──────────────────────── */}
      <Section size="tight">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-text">Uppgraderingar</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Vi uppdaterar och underhåller systemet löpande. Vill du göra större ingrepp
              eller bygga ut avtalar vi om det och justerar månadskostnaden.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text">Villkor</h2>
            <ul className="mt-3 space-y-2.5">
              {TERMS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text">Leveranstid</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              1–2 veckor från att vi kommit överens om omfattningen.
            </p>
          </div>
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <Section size="tight">
        <SectionHeading eyebrow="FAQ" title="Vanliga frågor" className="mb-10" />
        <FaqAccordion
          className="max-w-3xl"
          items={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
        />
      </Section>

      {/* ── Offertformulär ──────────────────────────────────────────────── */}
      <Section id="offert">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="eyebrow">OFFERT</p>
            <h2 className="heading-lg mt-2">Skicka offertförfrågan</h2>
            <p className="body-md mt-5 max-w-md">
              Berätta kort om projektet så räknar vi ut din månadskostnad och återkommer med
              en offert. Helt förutsättningslöst.
            </p>

            <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 px-6 py-5">
              <p className="text-sm leading-7 text-muted">
                <strong className="font-semibold text-text">Kom ihåg:</strong> ingen
                bindningstid och 3 månaders uppsägningstid. Startavgiften är 4 999 kr och
                månadsavgiften sätts efter omfattningen.
              </p>
            </div>

            <p className="mt-6 text-sm leading-7 text-muted">
              Vill du hellre köpa lösningen?{" "}
              <Link
                href="/kontakt"
                className="text-brand underline decoration-line underline-offset-4 transition hover:decoration-brand"
              >
                Kontakta oss
              </Link>{" "}
              så tittar vi på det i stället.
            </p>
          </div>

          <div className="surface-elevated px-6 py-8 sm:px-8">
            <RentalForm />
          </div>
        </div>
      </Section>
    </>
  );
}
