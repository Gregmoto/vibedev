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
  "Omdio — köpverifierade omdömen för butiker och produkter | VibeDev",
  "Vi byggde Omdio: en köpverifierad omdömesplattform som knyter ihop företags- och produktomdömen. Läs hur vi löste kallstartsproblemet, byggde en plattformsneutral kärna och en 4 kB-widget i Shadow DOM.",
  "/case-studies/omdio",
);

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */

const schemas = [
  getBreadcrumbSchema([
    { name: "Hem",          url: siteConfig.url },
    { name: "Case studies", url: `${siteConfig.url}/case-studies` },
    { name: "Omdio",        url: `${siteConfig.url}/case-studies/omdio` },
  ]),
  getCaseStudySchema({
    slug:        "omdio",
    projectName: "Omdio",
    summary:
      "Köpverifierad omdömesplattform som samlar företags- och produktomdömen i en plattform — en lucka på svenska marknaden mellan Trustpilot och Prisjakt.",
    industry:    "Omdömesplattform / SaaS",
    techStack:   ["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"],
    publishedAt: "2026-06-01",
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

export default async function OmdioPage() {
  const allCases = await getPublishedCaseStudies();
  const related = allCases.filter((c) => c.slug !== "omdio").slice(0, 3);

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

            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-muted" aria-label="Brödsmulor">
              <Link href="/case-studies" className="transition hover:text-brand">Case studies</Link>
              <span aria-hidden="true">›</span>
              <span className="text-text">Omdio</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                OMDÖMESPLATTFORM
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                Lanserad
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mt-5 max-w-4xl text-balance">
              Köpverifierade omdömen för både butiker och produkter
            </h1>

            {/* Summary */}
            <p className="body-lg mt-5 max-w-3xl">
              Omdio är en köpverifierad omdömesplattform som samlar företags- och produktomdömen
              på ett och samma ställe. Det fyller en lucka på svenska marknaden mellan Trustpilot,
              som betygsätter företag, och Prisjakt, som jämför pris — men där ingen knyter ihop
              verifierat köp med både butiks- och produktomdöme.
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Supabase/PostgreSQL", "Cloudflare Workers", "Stripe", "Resend"].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/boka-mote">Boka samtal om en liknande plattform</LinkButton>
              <a
                href="https://omdio.se"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold"
              >
                Besök omdio.se ↗
              </a>
            </div>

          </div>
        </Container>
      </header>

      {/* ── Article + Sidebar ────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* ── Main article ──────────────────────────────────────────── */}
          <article className="space-y-14">

            {/* Utmaningen */}
            <section>
              <SectionLabel>Utmaningen</SectionLabel>
              <h2 className="heading-md mb-5">
                En omdömesplattform är värdelös utan trovärdiga omdömen
              </h2>
              <Prose>
                <p>
                  Omdömen styr köpbeslut, men marknaden är uppdelad. Trustpilot och Reco
                  betygsätter företag. Prisjakt jämför pris. Lipscore samlar produktomdömen åt
                  enskilda butiker. Ingen knyter ihop ett <strong className="font-medium text-text">verifierat
                  köp</strong> med både ett omdöme om butiken och ett omdöme om själva produkten —
                  och definitivt inte så att produktomdömet följer med över butiksgränser.
                </p>
                <p>
                  Två problem måste lösas samtidigt för att en sådan plattform ska ha ett
                  existensberättigande.
                </p>
              </Prose>
              <div className="mt-6 space-y-4">
                {[
                  {
                    role: "K",
                    title: "Kallstartsproblemet",
                    desc:  "En omdömesplattform utan omdömen är värdelös — och utan användare kommer inga omdömen. Insamlingen måste vara så friktionsfri att den sker av sig själv, direkt i butikernas befintliga köpflöde.",
                  },
                  {
                    role: "T",
                    title: "Trovärdighetsproblemet",
                    desc:  "Öppna omdömen manipuleras lätt — av konkurrenter, av butiken själv, av botar. Utan köpverifiering är ett betyg bara en åsikt från en okänd avsändare. Verifieringen är hela grunden för förtroende.",
                  },
                  {
                    role: "D",
                    title: "Differentieringsproblemet",
                    desc:  "Mot etablerade aktörer som Trustpilot, Reco och Lipscore räcker det inte att göra samma sak. Omdio måste äga en position de inte har: köpverifierat, butik och produkt i samma plattform, produktomdömen som lever över butiksgränser.",
                  },
                ].map(({ role, title, desc }) => (
                  <div key={role} className="flex gap-4 rounded-2xl border border-line bg-bg p-5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {role}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-brand/5 px-6 py-5">
                <p className="text-sm leading-7 text-muted">
                  <strong className="font-semibold text-text">Kärnan:</strong>{" "}
                  insamlingen måste vara nästan osynligt enkel för butiken, omdömena måste vara
                  bevisbart köpverifierade, och produktomdömen måste kunna kopplas samman över
                  butiksgränser. Allt tre på en gång — annars faller produkten.
                </p>
              </div>
            </section>

            {/* Vad vi byggde */}
            <section>
              <SectionLabel>Vad vi byggde</SectionLabel>
              <h2 className="heading-md mb-5">
                En plattformsneutral kärna med köpverifiering i centrum
              </h2>
              <div className="space-y-10">

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Plattformsneutral kärna med adaptrar</h3>
                  <Prose className="mb-4">
                    <p>
                      Vi byggde aldrig &quot;en Shopify-app&quot;. Kärnan är plattformsneutral och vet
                      ingenting om en specifik e-handel. Varje plattform — Shopify, WooCommerce —
                      kopplas in via en tunn adapter som översätter butikens ordrar till samma
                      interna modell. Att lägga till nästa plattform blir att skriva en ny adapter,
                      inte att skriva om kärnan.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Adaptrar för Shopify och WooCommerce mot en gemensam, neutral domänmodell",
                    "Köpdata normaliseras till samma format oavsett varifrån den kommer",
                    "Ny plattform = ny adapter, utan att röra kärnlogiken",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Inbäddbar widget — 4 kB, Shadow DOM, köpverifierad</h3>
                  <Prose className="mb-4">
                    <p>
                      Widgeten som butiker bäddar in är medvetet liten — runt 4 kB — och renderas i
                      en <strong className="font-medium text-text">Shadow DOM</strong> så att butikens
                      CSS aldrig krockar med widgeten och vice versa. Den drar inga tredjepartsresurser
                      och påverkar inte sidans laddtid märkbart. Köpverifieringen läses ut ur sidans
                      egen <strong className="font-medium text-text">JSON-LD</strong>, så att ett
                      omdöme kan knytas till ett faktiskt köp utan tung integration.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "~4 kB inbäddningsbar widget — minimal påverkan på butikens prestanda",
                    "Shadow DOM isolerar stilar helt åt båda håll",
                    "Köpverifiering via sidans JSON-LD i stället för skör scraping",
                    "Inga tredjepartsresurser — bättre integritet och färre beroenden",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">EAN-baserad produktmatchning över butiksgränser</h3>
                  <Prose className="mb-4">
                    <p>
                      Samma produkt säljs i många butiker. För att ett produktomdöme ska vara värt
                      något måste det följa produkten — inte butiken. Vi matchar produkter på
                      <strong className="font-medium text-text"> EAN</strong>, så att omdömen för en
                      vara samlas ihop oavsett var den köptes. Det är själva mekanismen som gör Omdio
                      till en produktomdömesplattform och inte bara ännu en butiksbetygssajt.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Produkter identifieras på EAN, inte på butiksspecifika artikelnummer",
                    "Omdömen för samma vara slås samman över alla anslutna butiker",
                    "Ett produktomdöme blir en tillgång för hela ekosystemet, inte en silo",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">Utskicksmotor med kvot, sampling och leveransbarhet</h3>
                  <Prose className="mb-4">
                    <p>
                      Omdömen samlas in genom utskick efter köp, och här ligger en stor del av det
                      seniora hantverket. Motorn styr <strong className="font-medium text-text">kvoter
                      och sampling</strong> så att kunder inte spammas och så att urvalet blir
                      representativt, och den är byggd för <strong className="font-medium text-text">leveransbarhet</strong> —
                      korrekt uppsatt SPF, DKIM och DMARC — eftersom ett utskick som hamnar i
                      skräpposten inte ger några omdömen alls.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "Kvot- och samplingslogik så att kunder inte överbelastas med förfrågningar",
                    "SPF, DKIM och DMARC korrekt konfigurerat för hög leveransbarhet",
                    "Utskick kopplade till verifierade köp — rätt person, rätt produkt, rätt tillfälle",
                  ]} />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-text">AI-moderering och GDPR-medveten arkitektur</h3>
                  <Prose className="mb-4">
                    <p>
                      Inkommande omdömen modereras med AI för att fånga spam, påhopp och olämpligt
                      innehåll innan publicering. Integritet är inbyggd, inte påklistrad: IP-adresser
                      <strong className="font-medium text-text"> hashas</strong>, EXIF-data
                      <strong className="font-medium text-text"> strippas</strong> ur uppladdade bilder,
                      och widgeten laddar <strong className="font-medium text-text">inga tredjepartsresurser</strong>{" "}
                      som kan läcka besökardata.
                    </p>
                  </Prose>
                  <BulletList items={[
                    "AI-moderering av omdömen innan publicering",
                    "IP-adresser hashas — ingen lagring av rå persondata i klartext",
                    "EXIF-data strippas automatiskt ur uppladdade bilder",
                    "Inga tredjepartsresurser i widgeten — ingen tyst dataläckage till externa parter",
                  ]} />
                </div>

              </div>
            </section>

            {/* Hur vi tänkte tekniskt */}
            <section>
              <SectionLabel>Hur vi tänkte tekniskt</SectionLabel>
              <h2 className="heading-md mb-5">
                Senior arkitektur, AI-accelererad exekvering
              </h2>
              <Prose>
                <p>
                  Omdio byggdes <strong className="font-medium text-text">AI-assisterat</strong> — det
                  är kärnan i hur vi på VibeDev arbetar. Men &quot;vibe-coding&quot; betyder inte att
                  låta en modell gissa sig fram. De svåra besluten är mänskliga och seniora: att göra
                  kärnan plattformsneutral i stället för att hårdkoda mot Shopify, att verifiera köp via
                  JSON-LD i stället för skör scraping, att isolera widgeten i Shadow DOM, och att bygga
                  integritet i botten snarare än som en efterhandsfix.
                </p>
                <p>
                  Tekniken valdes för att passa de besluten. Kärnan och de publika ytorna körs i{" "}
                  <strong className="font-medium text-text">Next.js med TypeScript</strong>.{" "}
                  <strong className="font-medium text-text">Supabase/PostgreSQL</strong> är den
                  gemensamma datakällan, med radnivåsäkerhet där data exponeras.{" "}
                  <strong className="font-medium text-text">Cloudflare Workers</strong> kör widget- och
                  edge-logik nära användaren så att den lilla widgeten förblir snabb globalt.{" "}
                  <strong className="font-medium text-text">Stripe</strong> hanterar betalningar och{" "}
                  <strong className="font-medium text-text">Resend</strong> driver utskicksmotorn.
                </p>
                <p>
                  AI accelererade exekveringen — boilerplate, adaptrar, tester, iteration — så att ett
                  litet team kunde leverera en komplett plattform med flera ytor på en bråkdel av den
                  tid det annars hade tagit. Senioriteten sitter i arkitekturen; hastigheten kommer
                  från verktygen.
                </p>
              </Prose>
            </section>

            {/* Vad vi lärde oss */}
            <section>
              <SectionLabel>Vad vi lärde oss</SectionLabel>
              <h2 className="heading-md mb-6">
                Tre insikter från att bygga en köpverifierad omdömesplattform
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num:   "01",
                    title: "Verifiering är produkten, inte en funktion.",
                    body:  "Det vore lätt att se köpverifiering som ett kryss i kanten. I själva verket är det hela värdeerbjudandet — det är skillnaden mellan ett omdöme någon litar på och en åsikt från en okänd avsändare. Allt annat byggdes runt den principen.",
                  },
                  {
                    num:   "02",
                    title: "Insamlingsfriktion avgör kallstarten.",
                    body:  "En omdömesplattform lever och dör på hur lätt omdömen kommer in. Därför la vi den tunga ingenjörskonsten på det till synes tråkiga — widgetstorlek, leveransbarhet, kvoter och sampling. Det är där kallstartsproblemet faktiskt löses.",
                  },
                  {
                    num:   "03",
                    title: "Plattformsneutralitet är billig att bygga in, dyr att lägga till.",
                    body:  "Att göra kärnan oberoende av en specifik e-handel från dag ett kostade lite extra tankearbete. Att göra det i efterhand hade krävt en omskrivning. Rätt arkitektur tidigt är den billigaste skalbarheten som finns.",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex gap-5 rounded-2xl border border-line bg-bg p-6"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {item.num}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resultatet */}
            <section>
              <SectionLabel>Resultatet</SectionLabel>
              <h2 className="heading-md mb-5">
                En komplett plattform i produktion
              </h2>
              <div className="rounded-2xl border border-brand/20 bg-brand/5 px-6 py-7">
                <p className="text-base leading-7 text-muted">
                  Omdio är byggt och i produktion som en{" "}
                  <strong className="font-semibold text-text">komplett plattform</strong>: en publik
                  sajt där besökare hittar köpverifierade omdömen om butiker och produkter, en{" "}
                  <strong className="font-semibold text-text">företagsportal</strong> där butiker
                  kopplar sin e-handel och följer sina omdömen, ett{" "}
                  <strong className="font-semibold text-text">admin- och modereringsgränssnitt</strong>,
                  ett <strong className="font-semibold text-text">betalflöde via Stripe</strong> och
                  färdiga <strong className="font-semibold text-text">integrationer mot Shopify och
                  WooCommerce</strong>. Grunden — neutral kärna, köpverifiering och EAN-matchning —
                  är på plats för att produktomdömen ska kunna växa över butiksgränser.
                </p>
              </div>
            </section>

          </article>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24">

            {/* Project meta */}
            <Card variant="outlined" className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                Överblick
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Bransch</dt>
                  <dd className="mt-0.5 text-text">Omdömesplattform / SaaS</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-text">Lanserad och i produktion</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted/70">Teknikstack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {["Next.js", "TypeScript", "Supabase", "Cloudflare Workers", "Stripe", "Resend"].map((t) => (
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
                    href="https://omdio.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-text"
                  >
                    omdio.se ↗
                  </a>
                </div>
              </dl>
            </Card>

            {/* CTA card */}
            <Card className="p-6">
              <p className="text-sm font-semibold text-text">Bygga en plattform med integrationer?</p>
              <p className="body-md mt-3">
                Vi har erfarenhet av plattformsneutrala arkitekturer, e-handelsintegrationer,
                inbäddbara widgets och GDPR-medveten datahantering — från idé till produktion.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href="/boka-mote">Boka strategisamtal</LinkButton>
                <LinkButton href="/tjanster" variant="secondary">
                  Se våra tjänster
                </LinkButton>
              </div>
            </Card>

            {/* Back link */}
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
          eyebrow="Vill ni bygga en plattform med integrationer?"
          title="Plattformsneutral kärna, e-handelsadaptrar, inbäddbara widgets och GDPR-medveten arkitektur — byggt för att skala från dag ett."
          description="Vi kombinerar senior arkitektur med AI-accelererad exekvering, så att en komplett produkt kan nå produktion på en bråkdel av den vanliga tiden. Boka ett samtal."
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
