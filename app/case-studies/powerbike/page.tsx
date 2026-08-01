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
  "Powerbike — från WordPress till egen publiceringsplattform | VibeDev",
  "Vi flyttade Powerbike från WordPress till en egen plattform på Next.js och Cloudflare: artikelmotor, annonssystem, företagsregister och AI-stöd i redaktionen. Läs hela storyn.",
  "/case-studies/powerbike",
  {
    keywords: [
      "wordpress till next.js",
      "migrera från wordpress",
      "publiceringsplattform",
      "digitalt magasin",
      "annonssystem",
      "cms för media",
    ],
  },
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Powerbike",    url: `${siteConfig.url}/case-studies/powerbike` },
  ]),
  getCaseStudySchema({
    slug:        "powerbike",
    projectName: "Powerbike",
    summary:
      "Svenskt motormagasin flyttat från WordPress till en egen publiceringsplattform med annonssystem, företagsregister och AI-stöd i redaktionen.",
    industry:    "Media / Publishing",
    techStack:   ["Next.js 15", "React 19", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe"],
  }),
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

export default async function PowerbikePage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "powerbike").slice(0, 3);

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
              <span className="text-text">Powerbike</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                MEDIA / PUBLISHING
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Från WordPress till en plattform byggd för att tjäna pengar
            </h1>

            <p className="body-lg mt-5 max-w-3xl">
              Powerbike är ett svenskt magasin om MC, moped, ATV, snöskoter och cykel. Vi flyttade
              hela sajten från WordPress till en egen publiceringsplattform — med artikelmotor,
              annonssystem, betalt företagsregister och AI-stöd i redaktionen.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js 15", "React 19", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://powerbike.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök powerbike.nu →
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
              TODO: Ersätt platshållaren med en riktig skärmdump när den finns.
              Rekommenderat: 1280×800 PNG i /public/cases/powerbike.png.
            */}
            <div
              role="img"
              aria-label="Skärmdump av Powerbike — kommer snart"
              className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand/10 via-brand/5 to-transparent"
            >
              <span className="select-none text-sm font-medium text-muted/60">
                Skärmdump — Powerbike (kommer snart)
              </span>
            </div>

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                Annonsfinansierad sajt på en plattform som motarbetar annonser
              </h2>
              <Prose>
                <p>
                  Powerbike låg på WordPress och finansierades av annonser. Den kombinationen drar åt
                  två håll samtidigt: annonsskript och plugins gör sidorna långsammare, och en
                  långsam sajt tappar både läsare och annonsvärde. Ju hårdare man försöker tjäna
                  pengar, desto sämre blir produkten.
                </p>
                <p>
                  Ovanpå det saknades struktur för det som faktiskt genererar intäkter.
                  Annonsförsäljning, det betalda företagsregistret och affiliatelänkar sköttes vid
                  sidan av systemet — inte som funktioner i produkten.
                </p>
                <p>
                  Och en migrering från WordPress bär alltid en risk som är lätt att underskatta:
                  gamla länkar. En sajt med år av artiklar har rankning i Google och länkar utifrån
                  som pekar på gamla adresser. Bryts de, försvinner trafiken — och med den intäkten.
                </p>
              </Prose>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                Egen plattform där intäkterna är inbyggda
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Migrering utan att tappa en länk</h3>
                  <Prose className="mb-4">
                    <p>
                      Allt WordPress-innehåll flyttades över, och vi genererade{" "}
                      <strong className="font-medium text-text">399 permanenta omdirigeringar</strong>{" "}
                      så att varje gammal adress leder rätt i den nya strukturen. Uppslagningen sker
                      i utkanten av nätet med cache, så databasen belastas som mest en gång per
                      adress och timme.
                    </p>
                    <p>
                      Vi hämtade också hem samtliga <strong className="font-medium text-text">113
                      bilder</strong> från den gamla sajten och konverterade dem till moderna format
                      i tre storlekar. Annars hade bilderna slutat fungera i samma sekund som
                      domänen pekades om.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "399 permanenta omdirigeringar så att gamla länkar och Google-rankning behölls",
                    "113 bilder hämtade hem, konverterade till webp i tre storlekar",
                    "Omdirigeringsuppslag på edge med cache — minimal databasbelastning",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Redaktionsverktyg byggda för ändamålet</h3>
                  <Prose className="mb-4">
                    <p>
                      Artiklar byggs av block — text, bilder, citat, faktarutor, annonsplatser och
                      affiliatelänkar — i stället för som ett fält med fri HTML. Det gör att samma
                      artikel kan renderas olika på mobil och desktop, och att annonsplatser kan
                      placeras i texten utan att redaktionen klistrar in skript.
                    </p>
                    <p>
                      Tester har egen struktur med betygskriterier, pris och plus/minus-listor. Det
                      ger dels en enhetlig presentation, dels{" "}
                      <strong className="font-medium text-text">strukturerad data till Google</strong>{" "}
                      så att betygen kan visas direkt i sökresultaten.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Blockbaserad editor med text, bild, citat, faktaruta, annons och affiliatelänk",
                    "Testartiklar med betygskriterier som blir Product- och Review-schema för Google",
                    "Även statiska sidor ligger i databasen — redaktionen redigerar allt själv",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Annonser utan att förstöra sajten</h3>
                  <Prose className="mb-4">
                    <p>
                      Det här var kärnan i uppdraget. Sidorna cachas statiskt för snabbhet — men
                      annonser måste roteras per besökare, vilket normalt omöjliggör cache.
                    </p>
                    <p>
                      Vi löste det genom att lyfta ut annonsvalet till en egen, lätt förfrågan som
                      körs separat från sidan. Sidan förblir statiskt cachad; bara annonsen är
                      dynamisk. Annonsplatserna har dessutom fast höjd och laddas först när de
                      närmar sig synligt läge, vilket gör att{" "}
                      <strong className="font-medium text-text">innehållet aldrig hoppar</strong> när
                      annonsen dyker upp — ett av Googles direkta rankningsmått.
                    </p>
                    <p>
                      Egna annonser säljs och betalas med Stripe, med viktad rotation och
                      klickspårning. Saknas en såld kampanj på en position fylls den automatiskt med
                      AdSense. Ingen tredjepartscookie, inga personuppgifter — bara dagsstatistik.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Eget annonssystem med Stripe-betalning, viktad rotation och klickspårning",
                    "AdSense som automatisk fallback när egen kampanj saknas på positionen",
                    "Annonser bryter varken sidcachen eller layouten — noll innehållshopp",
                    "Cookiefri egen statistik, utan tredjepartsspårning",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">AI i redaktionen — med människa i varje steg</h3>
                  <Prose className="mb-4">
                    <p>
                      Redaktionen bevakar RSS-flöden. AI omvandlar ett uppslag till ett utkast på
                      svenska med källhänvisning — men{" "}
                      <strong className="font-medium text-text">ingenting publiceras automatiskt</strong>.
                      Varje utkast går till en granskningskö där en redaktör redigerar, väljer bild
                      och publicerar.
                    </p>
                    <p>
                      En detalj värd att lyfta: redaktionella regler ligger i koden, inte i en
                      redigerbar prompt. Den viktigaste är att aldrig räkna om utländska priser till
                      kronor — ett omräknat eurobelopp är inte det svenska priset, eftersom moms,
                      frakt och generalagentens påslag tillkommer. En sådan omräkning vore en
                      påhittad uppgift i en text som utger sig för att vara fakta.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "RSS-bevakning där AI skriver utkast som alltid granskas av en människa",
                    "Redaktionella regler i kod, så de inte kan redigeras bort av misstag",
                    "Kommentarsmoderering som vid tveksamhet skickar till manuell granskning",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Företagsregister som intäktsben</h3>
                  <Prose className="mb-4">
                    <p>
                      Handlare, verkstäder och klubbar kan betala för en plats i registret, med
                      logotyp, öppettider, karta och omdömen. Adresser geokodas automatiskt, och
                      medlemskapen förnyas via prenumeration i Stripe — med respitperiod om en
                      betalning misslyckas i stället för att profilen släcks direkt.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Betalt företagsregister med logotyp, öppettider, karta och omdömen",
                    "Automatisk geokodning av adresser via öppna kartdata",
                    "Prenumerationer i Stripe med respitperiod vid misslyckad betalning",
                  ]} />
                </div>

              </div>
            </section>

            {/* Tekniska val */}
            <section>
              <SectionLabel>Tekniska val</SectionLabel>
              <h2 className="heading-md mb-5">
                Snabbt av design, inte av optimering i efterhand
              </h2>
              <Prose>
                <p>
                  Plattformen är byggd i <strong className="font-medium text-text">Next.js 15 med
                  React 19</strong> och körs på <strong className="font-medium text-text">Cloudflare
                  Workers</strong>. Innehållet ligger i{" "}
                  <strong className="font-medium text-text">Supabase/PostgreSQL</strong> inom EU, med
                  behörighetsregler på radnivå i databasen.
                </p>
                <p>
                  Cachen har tre lager med semantiska etiketter: när en artikel publiceras
                  uppdateras exakt de sidor som berörs — artikeln, kategorin och sitemapen — i
                  stället för att hela sajten byggs om. Det gör publicering till en operation som
                  tar sekunder oavsett hur stort arkivet blir.
                </p>
                <p>
                  Beroendelistan hölls medvetet kort: nio produktionsberoenden totalt, inget
                  UI-bibliotek och inget färdigt CMS. Varje tillagt paket är något som måste
                  underhållas och som kan gå sönder — och för en sajt vars affär bygger på
                  laddtid är varje kilobyte en kostnad.
                </p>
              </Prose>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js 15 (App Router)",
                  "React 19",
                  "TypeScript",
                  "Supabase/PostgreSQL",
                  "Cloudflare Workers",
                  "Stripe",
                  "Resend",
                  "Claude (Anthropic)",
                ].map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Resultatet */}
            <section>
              <SectionLabel>Resultatet</SectionLabel>
              <h2 className="heading-md mb-5">
                Ett magasin med fyra egna intäktsflöden
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Powerbike är i produktion på egen plattform med{" "}
                  <strong className="font-semibold text-text">fyra intäktsflöden inbyggda</strong> —
                  egna annonser, AdSense, betalt företagsregister och affiliatelänkar. Migreringen
                  genomfördes utan att en enda gammal länk dog, och annonserna gör varken sidorna
                  långsammare eller layouten instabil. Redaktionen sköter allt själv, från artiklar
                  till statiska sidor.
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
                  <dd className="mt-0.5 text-text">Media / Publishing</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och i produktion</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Uppdrag</dt>
                  <dd className="mt-0.5 text-text">Migrering från WordPress</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js 15", "React 19", "Supabase", "Cloudflare Workers", "Stripe"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="pt-1">
                  <a
                    href="https://powerbike.nu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    powerbike.nu ↗
                  </a>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Sitter ni fast i WordPress?</p>
              <p className="body-md mt-3">
                Vi migrerar innehållstunga sajter till moderna plattformar utan att tappa
                Google-rankning — och bygger in annonser, medlemskap och betalflöden som
                riktiga funktioner.
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
          eyebrow="Ska ni lämna WordPress?"
          title="Migrering med bevarad rankning, egen publiceringsplattform och intäktsflöden inbyggda i produkten."
          description="Vi har flyttat innehållstunga sajter utan att tappa en länk — och byggt annonssystem som inte gör sajten långsammare. Boka ett samtal."
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
