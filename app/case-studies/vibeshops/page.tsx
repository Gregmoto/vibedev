import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Section } from "@/components/ui/section";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { getBreadcrumbSchema, getCaseStudySchema } from "@/lib/seo/jsonld";
import { getPublishedCaseStudies } from "@/lib/cms-public";
import { siteConfig, createMetadata } from "@/lib/metadata";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = createMetadata(
  "VIBESHOPS — multi-tenant e-handelsplattform | Case study | VibeDev",
  "VibeDev bygger VIBESHOPS: en komplett svensk e-handelsplattform med multishop, Swish/Klarna-kassa, lager i realtid, AI-produkttexter och SEO ur lådan. Läs hela storyn.",
  "/case-studies/vibeshops",
  {
    keywords: [
      "e-handelsplattform",
      "multi-tenant saas",
      "svensk e-handel",
      "shopify-alternativ",
      "webbutik",
      "headless commerce",
    ],
  },
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "VIBESHOPS",    url: `${siteConfig.url}/case-studies/vibeshops` },
  ]),
  getCaseStudySchema({
    slug:        "vibeshops",
    projectName: "VIBESHOPS",
    summary:
      "Multi-tenant e-handelsplattform där svenska handlare får en komplett webbutik — med multishop, svensk kassa, moms som stämmer, lager i realtid och SEO ur lådan, utan provision.",
    industry:    "SaaS / E-handel",
    techStack:   ["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Cloudflare for SaaS", "Stripe", "Resend"],
  }),
  {
    "@context":          "https://schema.org",
    "@type":             "SoftwareApplication",
    name:                "VIBESHOPS",
    applicationCategory: "BusinessApplication",
    operatingSystem:     "Web",
    url:                 "https://vibeshops.se",
    description:
      "Multi-tenant e-handelsplattform för svenska handlare med multishop, Swish/Klarna/Qliro-kassa, destinationsmoms, lager i realtid, AI-produkttexter och SEO ur lådan — utan provision på försäljningen.",
  },
];

/* ── Shared micro-components ──────────────────────────────────────────────── */

function TechPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 text-base leading-[1.85] text-muted ${className}`}>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted sm:text-base">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function VibeshopsPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "vibeshops").slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="page-hero border-b border-line/50">
        <Container className="pb-12 pt-20 sm:pb-16 sm:pt-28">
          <div className="surface-elevated max-w-5xl px-6 py-10 sm:px-10 sm:py-14">

            <nav className="mb-6 flex items-center gap-2 text-xs text-muted" aria-label="Brödsmulor">
              <Link href="/case-studies" className="transition hover:text-brand">Case studies</Link>
              <span aria-hidden="true">›</span>
              <span className="text-text">VIBESHOPS</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                SAAS / E-HANDEL
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad — vidare utveckling pågår
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              En komplett svensk webbutik — utan provision och utan inlåsning
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              VIBESHOPS är en multi-tenant e-handelsplattform vi byggt för svenska handlare. Svensk
              handel — moms, Swish, Fortnox, Omnibus och hämta i butik — är inbyggt från grunden,
              inte påklistrat i efterhand. En handlare kan driva flera butiker på flera marknader
              från ett konto, utan provision på försäljningen.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://vibeshops.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök vibeshops.se →
              </a>
              <a
                href="https://demo.vibeshops.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Se demo-butiken ↗
              </a>
              <LinkButton href="/boka-mote" variant="secondary">
                Boka samtal om liknande projekt
              </LinkButton>
            </div>

          </div>
        </Container>
      </header>

      {/* ── Article + Sidebar ────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          <article className="space-y-14">

            {/* Skärmdump-platshållare */}
            {/*
              TODO: Ersätt platshållaren med en riktig skärmdump av VIBESHOPS när den finns.
              Rekommenderat: 1280×800 PNG i /public/cases/vibeshops.png och byt diven mot:
                <Image src="/cases/vibeshops.png" alt="VIBESHOPS e-handelsplattform — butik med svensk kassa" fill className="object-cover" />
            */}
            <div
              role="img"
              aria-label="Skärmdump av VIBESHOPS e-handelsplattform — kommer snart"
              className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand/10 via-brand/5 to-transparent"
            >
              <span className="select-none text-sm font-medium text-muted/60">
                Skärmdump — VIBESHOPS (kommer snart)
              </span>
            </div>

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Handlare tvingas välja mellan provision och ett system från ett annat årtionde
              </h2>
              <Prose>
                <p>
                  Svenska handlare som vill sälja online har i praktiken två val: en internationell
                  plattform som Shopify, där du betalar provision på varje order och tvingas in i
                  deras kassa och deras appekosystem — eller en äldre svensk lösning som visserligen
                  förstår Swish, moms och Fortnox, men som känns byggd för ett annat årtionde.
                </p>
                <p>
                  Ingen av dem löser problemet fullt ut. Den internationella plattformen förstår inte
                  svensk verklighet: <strong className="font-medium text-text">Omnibus-direktivet,
                  kassaregister, hämta i butik, moms vid EU-försäljning</strong>. Den äldre svenska
                  lösningen förstår regelverket men saknar den snabbhet, den designfrihet och den
                  AI-kapacitet som handlare förväntar sig idag. Och båda lägger vanligtvis till en
                  avgift på varje krona du säljer.
                </p>
                <p>
                  Utmaningen var alltså inte att bygga &quot;ännu en webbutik&quot; — utan att bygga
                  en plattform där svensk regelefterlevnad, modern prestanda och ärlig prissättning
                  finns i samma produkt, och där en handlare kan driva flera butiker på flera
                  marknader utan att något av det blir en integrationsövning.
                </p>
              </Prose>
            </section>

            {/* Vad vi bygger */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                Svensk e-handel inbyggd från grunden — inte påklistrad
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Multi-tenant kärna och multishop</h3>
                  <Prose className="mb-4">
                    <p>
                      Varje butik lever i samma kodbas men är fullständigt avskild på databasnivå —{" "}
                      <strong className="font-medium text-text">Row Level Security på samtliga
                      tabeller</strong>, verifierat med skarpa isolationstester i CI. Ovanpå det
                      ligger multishop: flera butiker, marknader, språk och valutor från ett konto,
                      med delad katalog och delat lager men eget sortiment och egen design per butik.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Vattentät tenant-isolering med RLS på varje tabell, verifierad i CI",
                    "Flera butiker, marknader, språk och valutor från ett enda konto",
                    "Delad katalog och delat lager — men eget sortiment och egen design per butik",
                    "Egen domän per butik: subdomän direkt, eller kundens egen domän via Cloudflare for SaaS",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Svensk kassa och moms som faktiskt stämmer</h3>
                  <Prose className="mb-4">
                    <p>
                      Kassan hanterar <strong className="font-medium text-text">Swish, Klarna, kort
                      och Qliro</strong>, med serverside-beräkning av alla belopp i heltal öre och
                      kortdata som aldrig rör våra servrar. Momsen räknas rätt för svensk verklighet:
                      destinationsmoms för EU-B2C via OSS, omvänd skattskyldighet mot VAT-validerade
                      företag och nollmoms vid export.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Swish, Klarna, kort och Qliro med serverside-beräkning i heltal öre",
                    "Kortdata rör aldrig våra servrar",
                    "Destinationsmoms för EU-B2C (OSS), omvänd skattskyldighet och nollmoms vid export",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Lager i realtid och en katalog byggd för verkligheten</h3>
                  <Prose className="mb-4">
                    <p>
                      Flera namngivna lagerställen med <strong className="font-medium text-text">atomisk
                      reservation vid köp</strong>, lagerbevakning och hämta i butik med upphämtningstid
                      per lager. Katalogen hanterar varianter, attribut och filter, flera kategorier per
                      produkt, banderoller, storleksguider och en fordonsväljare för branscher där
                      passform avgör.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Flera lagerställen med atomisk reservation vid köp och lagerbevakning",
                    "Hämta i butik med upphämtningstid per lager",
                    "Varianter, attribut, filter och flera kategorier per produkt",
                    "Banderoller, storleksguider och fordonsväljare för passform-styrda branscher",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Marknadsföring, AI och integrationer</h3>
                  <Prose className="mb-4">
                    <p>
                      Nyhetsbrev, SMS, popups, rabattkoder, presentkort, kundsegmentering och
                      övergivna varukorgar är inbyggt. <strong className="font-medium text-text">AI
                      genererar produkttexter och översättningar på svenska</strong> — med
                      förhandsgranskning innan de sparas — och plattformen kopplar mot Fortnox för
                      bokföring, Google Shopping och Meta för annonsering, Omdio för köpverifierade
                      omdömen och fraktbokning mot flera transportörer.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Nyhetsbrev, SMS, popups, rabattkoder, presentkort och kundsegmentering",
                    "Övergivna varukorgar med automatiska påminnelser",
                    "AI-genererade produkttexter och översättningar på svenska med förhandsgranskning",
                    "Fortnox, Google Shopping, Meta, Omdio och fraktbokning mot flera transportörer",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Omnibus, GDPR och SEO ur lådan</h3>
                  <Prose className="mb-4">
                    <p>
                      Regelefterlevnad är inbyggd, inte en efterhandsfix:{" "}
                      <strong className="font-medium text-text">prishistorik loggas från dag ett</strong>{" "}
                      för Omnibus, och cookie-samtycke gatar all spårning. SEO är byggt på riktigt —
                      serverside-rendering, strukturerad data med ProductGroup för variantprodukter,
                      automatiska sitemaps och hreflang för flerspråkiga butiker.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Prishistorik från dag ett för Omnibus-direktivet",
                    "Cookie-samtycke som gatar all spårning innan den aktiveras",
                    "SSR, ProductGroup-strukturdata, automatiska sitemaps och hreflang",
                  ]} />
                </div>

              </div>
            </section>

            {/* Differentiering */}
            <section>
              <SectionLabel>Differentiering</SectionLabel>
              <h2 className="heading-md mb-5">
                Byggd för svensk handel — inte anpassad i efterhand
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Skillnaden mot en internationell plattform är att svensk verklighet finns i botten:
                  moms, Swish, Fortnox, Omnibus och hämta i butik är{" "}
                  <strong className="font-semibold text-text">inbyggt, inte påklistrat</strong>.
                  Skillnaden mot en äldre svensk lösning är prestandan, designfriheten och AI-kapaciteten.
                  Och till skillnad från båda tar VIBESHOPS{" "}
                  <strong className="font-semibold text-text">ingen provision på handlarens
                  försäljning</strong> — med full dataportabilitet, utan inlåsning.
                </p>
              </div>
            </section>

            {/* Tekniska val */}
            <section>
              <SectionLabel>Hur vi tänker tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Multi-tenant med säkerhet på databasnivå, byggt för global prestanda
              </h2>
              <Prose>
                <p>
                  Plattformen byggs i <strong className="font-medium text-text">Next.js med App
                  Router och TypeScript</strong>. Data och autentisering ligger i{" "}
                  <strong className="font-medium text-text">Supabase/PostgreSQL med Row Level
                  Security</strong>, vilket gör multi-tenant säkert på databasnivå — varje butik ser
                  bara sitt, och isoleringen är verifierad genom skarpa cross-tenant-tester i CI.
                  Körningen sker på <strong className="font-medium text-text">Cloudflare Workers</strong>,
                  och egen domän per butik löses via <strong className="font-medium text-text">Cloudflare
                  for SaaS</strong>. Stripe hanterar betalningsinfrastruktur och Resend driver utskick.
                </p>
                <p>
                  De svåra besluten är mänskliga och seniora: att isolera tenants på databasnivå från
                  dag ett, att beräkna alla belopp serverside i heltal öre, att bygga momslogiken för
                  svensk och europeisk verklighet, och att låta AI accelerera exekveringen —
                  produkttexter, översättningar, boilerplate och tester — utan att gissa sig fram i
                  arkitekturen. Senioriteten sitter i besluten; hastigheten kommer från verktygen.
                </p>
              </Prose>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js (App Router)",
                  "TypeScript",
                  "Supabase/PostgreSQL (RLS)",
                  "Cloudflare Workers",
                  "Cloudflare for SaaS",
                  "Stripe",
                  "Resend",
                  "Claude (Anthropic)",
                ].map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Status idag */}
            <section>
              <SectionLabel>Status idag</SectionLabel>
              <h2 className="heading-md mb-5">
                Lanserad — och vidareutvecklingen fortsätter
              </h2>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-7">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-green-900">Lanserad och i drift</p>
                    <p className="mt-1 text-sm leading-7 text-green-800">
                      Plattformen är i drift med <strong>GregMoto som första tenant</strong>, och en
                      publik demo-butik finns på{" "}
                      <a
                        href="https://demo.vibeshops.se"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-2 transition hover:opacity-80"
                      >
                        demo.vibeshops.se
                      </a>
                      . Tenant-isoleringen är verifierad genom skarpa cross-tenant-tester i CI, och en
                      fullständig säkerhetsgranskning av kassa, webhooks och behörigheter är genomförd.{" "}
                      <strong>Vidareutvecklingen pågår</strong> med nya funktioner och fler butiker.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Resultatet */}
            <section>
              <SectionLabel>Resultatet</SectionLabel>
              <h2 className="heading-md mb-5">
                Svensk handel inbyggd från grunden — utan provision
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  En komplett e-handelsplattform där svensk handel — moms, Swish, Fortnox, Omnibus och
                  hämta i butik — är{" "}
                  <strong className="font-semibold text-text">inbyggt från grunden, inte påklistrat i
                  efterhand</strong>. Ingen provision på handlarens försäljning, och full
                  dataportabilitet.
                </p>
              </div>
            </section>

          </article>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24">

            <Card variant="outlined" className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                Överblick
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Bransch</dt>
                  <dd className="mt-0.5 text-text">SaaS / E-handel</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad — vidare utveckling pågår</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "TypeScript", "Supabase", "Cloudflare Workers", "Cloudflare for SaaS", "Stripe"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="pt-1 space-y-1.5">
                  <a
                    href="https://vibeshops.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    vibeshops.se ↗
                  </a>
                  <a
                    href="https://demo.vibeshops.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-text"
                  >
                    demo.vibeshops.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Vill du bygga något liknande?</p>
              <p className="body-md mt-3">
                Vi bygger multi-tenant SaaS med tenant-isolering på databasnivå, svenska betal- och
                momsflöden, lagerlogik och white-label — från arkitektur till produktion.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href="/boka-mote">Boka strategisamtal</LinkButton>
                <LinkButton href="/tjanster" variant="secondary">
                  Se våra tjänster
                </LinkButton>
              </div>
            </Card>

            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-brand"
            >
              ← Till alla case studies
            </Link>

          </aside>
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <Section>
        <CtaPanel
          eyebrow="Vill ni bygga en e-handelsplattform?"
          title="Multi-tenant, svensk kassa och moms, lager i realtid och SEO ur lådan — samma grund som VIBESHOPS byggs på."
          description="Vi kombinerar senior arkitektur med AI-accelererad exekvering, så att en komplett plattform kan nå produktion på en bråkdel av den vanliga tiden. Boka ett samtal."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka strategisamtal →</LinkButton>
              <LinkButton href="/kontakt" variant="secondary">Skicka förfrågan</LinkButton>
            </>
          }
        />
      </Section>

      {/* ── Related cases ────────────────────────────────────────────────────── */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fler case</p>
            <h2 className="heading-lg mt-2">Andra projekt vi byggt</h2>
          </div>
          <Link
            href="/case-studies"
            className="shrink-0 text-sm font-medium text-brand transition hover:text-text"
          >
            Se alla →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <CaseStudyCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
