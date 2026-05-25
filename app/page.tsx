import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users, Zap } from "lucide-react";
import { LogoBar } from "@/components/home/logo-bar";
import { PackagesSection } from "@/components/home/packages-section";
import { TeamSection } from "@/components/home/team-section";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { PatternGrid } from "@/components/ui/pattern-grid";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  freeResources,
  homeCases,
  homeFaq,
  homeReasons,
  testimonials,
} from "@/content/home";
import {
  createMetadataForStandardPage,
  getPublishedBlogPosts,
  getPublishedPodcastEpisodes,
} from "@/lib/cms-public";
import { getFAQSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";
import { LeadMagnet } from "@/components/conversion/lead-magnet";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/",
    fallbackTitle: "Apputveckling, AI & MVP i Stockholm | VibeDev",
    fallbackDescription:
      "Seniort produktteam i Stockholm som bygger appar, webbappar och AI-lösningar — enklare, snabbare och utan onödig byråtröghet. Boka kostnadsfritt strategisamtal.",
    keywords: ["apputveckling stockholm", "webbapp", "ai-lösningar", "mvp", "produktutveckling", "VibeDev"],
  });
}

export default async function HomePage() {
  const [latestArticles, podcastHighlights] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedPodcastEpisodes(),
  ]);

  const faqSchema = getFAQSchema(homeFaq.map((f) => ({ q: f.question, a: f.answer })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg to-[#EFF6FF]">
        {/* Decorative blur orbs — rendered via CSS so no layout shift */}
        <div
          className="pointer-events-none absolute -left-48 -top-36 h-[680px] w-[680px] rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-36 -right-48 h-[680px] w-[680px] rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-shell relative px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-[7.5rem] lg:px-8">
          <div className="mx-auto max-w-[920px] text-center">

            {/* Pre-title badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-brandDeep px-4 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                För founders och produktteam i Norden
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-balance font-display text-[2.25rem] font-bold leading-[1.08] tracking-[-0.02em] text-text sm:text-[2.75rem] lg:text-[4rem]">
              Lansera en app, webbapp eller AI-funktion&nbsp;— utan byråtröghet.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-[640px] text-[1.0625rem] leading-[1.75] text-muted sm:text-lg">
              VibeDev är ett seniort produktteam i Stockholm. Vi tar er från idé till lanserad produkt
              med strategi, design och utveckling&nbsp;— allt i samma team. Snabbare, enklare och utan
              onödig komplexitet.
            </p>

            {/* CTA row */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <LinkButton href="/boka-mote" size="lg">
                Boka kostnadsfritt strategisamtal&nbsp;→
              </LinkButton>
              <Link
                href="/tjanster"
                className="group inline-flex items-center gap-1.5 text-base font-medium text-muted transition duration-200 hover:text-text"
              >
                Se hur vi jobbar
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* Trust row */}
            <p className="mt-8 text-sm text-muted/70">
              Svar inom 24 timmar&nbsp;·&nbsp;Inga säljpitchar&nbsp;·&nbsp;Fast pris på fast scope
            </p>

            {/* TODO: Lägg till antal levererade projekt när siffran är bekräftad */}
          </div>
        </div>
      </section>

      {/* ── Logo bar ─────────────────────────────────────────────────────────── */}
      <LogoBar />

      {/* ── Värdeprop — 3 kolumner ───────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-8 sm:grid-cols-3">
          {([
            {
              icon:  Zap,
              title: "Lansering på 6–12 veckor",
              text:  "Vi bygger MVP:er och produkter som faktiskt går live — inte presentationer som hamnar i en låda.",
            },
            {
              icon:  Users,
              title: "Seniort team från dag ett",
              text:  "Fyra utvecklare med många års erfarenhet. Ingen junior-experimentering på er bekostnad.",
            },
            {
              icon:  Sparkles,
              title: "AI där det skapar värde",
              text:  "Vi vet när AI tillför nytta i en produkt — och när det bara blir en dyr demoeffekt.",
            },
          ] as const).map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              </div>
              <h3 className="font-semibold leading-snug text-text">{title}</h3>
              <p className="text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section size="tight" id="sa-jobbar-vi">
        <SectionHeading
          eyebrow="Om VibeDev"
          title="Vi är teamet för bolag som vill bygga snabbare — utan att tumma på kvalitet."
          description="VibeDev kombinerar strategi, design och utveckling för team som vill skapa moderna digitala produkter med tydligt affärsvärde. Vi tror att programmering inte ska behöva vara dyrt eller komplicerat — och vi bygger som om vi vore en del av ert eget team."
        />
        <div className="grid-content mt-10">
          <Card className="p-8 sm:p-10">
            <p className="heading-md text-2xl">Vi bygger digitala produkter som faktiskt löser problem.</p>
            <p className="body-md mt-4">
              Oavsett om ni behöver en helt ny produkt eller AI-funktioner i en befintlig — vi hjälper er kapa
              onödiga omvägar och komma till rätt lösning snabbare.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                "Lansera en ny app eller webbapp",
                "Bygga en MVP med rätt scope och tempo",
                "Integrera AI i befintlig produkt",
                "Förbättra konvertering och användarupplevelse",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge tone="brand">Apputveckling</Badge>
              <Badge tone="accent">Webbappar</Badge>
              <Badge tone="success">AI-lösningar</Badge>
              <Badge>Produktdesign</Badge>
            </div>
          </Card>
          <Card variant="outlined" className="p-8">
            <p className="heading-md text-xl">Tre steg från idé till lanserad produkt.</p>
            <p className="body-md mt-2">
              Vi gör processen så enkel som möjligt — inga onödiga workshops eller långa upptaktsmöten.
            </p>
            <div className="mt-6 space-y-5">
              {([
                {
                  label: "01 — Strategi",
                  meta:  "vecka 1",
                  desc:  "Vi definierar mål, målgrupp och vad som faktiskt måste byggas först. Inga generiska kravspecar — bara det som flyttar nålen.",
                },
                {
                  label: "02 — Design & utveckling",
                  meta:  "vecka 2–8",
                  desc:  "Vi designar och bygger parallellt. Ni får demo varje vecka — inga överraskningar vid leverans.",
                },
                {
                  label: "03 — Lansering & iteration",
                  meta:  "vecka 9+",
                  desc:  "Vi lanserar, mäter och hjälper er prioritera nästa steg baserat på riktiga användare — inte gissningar.",
                },
              ] as const).map((step, index) => (
                <div key={step.label} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-sm font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {step.label}{" "}
                      <span className="font-normal text-muted">({step.meta})</span>
                    </p>
                    <p className="body-md mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* ── Paket / tre sätt att starta ──────────────────────────────────────── */}
      <PackagesSection />

      <Section>
        <SectionHeading
          eyebrow="Varför välja oss"
          title="Det här skiljer oss från andra byråer."
          description="VibeDev är byggt för bolag som vill ha mer fart, mindre friktion och bättre produktbeslut."
        />
        <PatternGrid className="mt-10" columns="4">
          {homeReasons.map((reason) => (
            <Card key={reason.title} variant="outlined" className="p-7">
              <h3 className="text-xl font-semibold text-text">{reason.title}</h3>
              <p className="body-md mt-3">{reason.description}</p>
            </Card>
          ))}
        </PatternGrid>
      </Section>

      {/* ── Vi som bygger ────────────────────────────────────────────────────── */}
      <TeamSection />

      <Section>
        <SectionHeading
          eyebrow="Case studies"
          title="Plattformar och produkter vi byggt."
          description="Riktiga projekt där strategi, design och utveckling skapade fungerande produkter — inte presentationer."
          actions={<LinkButton href="/case-studies" variant="secondary">Se alla case →</LinkButton>}
        />
        <PatternGrid className="mt-10" columns="3">
          {homeCases.map((item) => (
            <Card key={item.title} className="p-7">
              <Badge tone="accent">Resultat: {item.result}</Badge>
              <h3 className="heading-md mt-5 text-2xl">{item.title}</h3>
              <p className="body-md mt-3">{item.summary}</p>
              <p className="mt-5 text-sm text-muted">{item.tech}</p>
              <Link href={item.href} className="mt-6 inline-flex text-sm font-medium text-brand transition hover:text-text">
                Se case
              </Link>
            </Card>
          ))}
        </PatternGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Senaste från bloggen"
          title="Vi skriver om vibecoding, AI och hur moderna team bygger."
          description="Bloggen är vår plats att dela hur vi tänker kring scope, AI-integration och vad som faktiskt fungerar — och inte fungerar — i moderna produktteam."
          actions={<LinkButton href="/blogg" variant="secondary">Till bloggen</LinkButton>}
        />
        <PatternGrid className="mt-10" columns="3">
          {latestArticles.slice(0, 3).map((article) => (
            <Card key={article.title} variant="outlined" className="p-7">
              <Badge>{article.category}</Badge>
              <h3 className="heading-md mt-5 text-2xl">{article.title}</h3>
              <p className="body-md mt-3">{article.excerpt}</p>
              <Link href={`/blogg/${article.slug}`} className="mt-6 inline-flex text-sm font-medium text-brand transition hover:text-text">
                Läs artikeln
              </Link>
            </Card>
          ))}
        </PatternGrid>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Podcast"
              title="Podden för founders och team som bygger snabbare."
              description="Samtal om vibecoding, AI och hur moderna produktteam kapar onödig komplexitet. Korta avsnitt, raka åsikter."
              actions={<LinkButton href="/podcast" variant="secondary">Lyssna på podcast</LinkButton>}
            />
          </div>
          <div className="grid gap-6">
            {podcastHighlights.slice(0, 2).map((episode, index) => (
              <Card key={episode.title} className="p-7">
                <p className="eyebrow">Avsnitt {index + 1} · {new Date(episode.publishedAt).toLocaleDateString("sv-SE")}</p>
                <h3 className="heading-md mt-4 text-2xl">{episode.title}</h3>
                <p className="body-md mt-3">{episode.excerpt}</p>
                <Link href={`/podcast/${episode.slug}`} className="mt-6 inline-flex text-sm font-medium text-brand transition hover:text-text">
                  Visa avsnitt
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Gratis resurser"
          title="Gratis material för team som vill bygga med mer klarhet."
          description="Checklistor, guider och mallar som hjälper er definiera scope, prioritera bättre och undvika de vanligaste misstagen."
          actions={<LinkButton href="/resurser" variant="secondary">Alla resurser</LinkButton>}
        />
        <PatternGrid className="mt-10" columns="3">
          {freeResources.map((resource) => (
            <Card key={resource.title} variant="outlined" className="p-7">
              <h3 className="heading-md text-2xl">{resource.title}</h3>
              <p className="body-md mt-3">{resource.description}</p>
              <Link href={resource.href} className="mt-6 inline-flex text-sm font-medium text-brand transition hover:text-text">
                Hämta resurs
              </Link>
            </Card>
          ))}
        </PatternGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Kundröster"
          title="Förtroende byggs bäst genom resultat och upplevelse."
          description="Så här beskriver kunder och produktteam samarbetet med VibeDev."
          align="center"
        />
        <PatternGrid className="mt-10" columns="3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-7">
              <p className="text-base leading-8 text-text">“{testimonial.quote}”</p>
              <div className="mt-6 border-t border-line pt-5">
                <p className="font-semibold text-text">{testimonial.name}</p>
                <p className="text-sm text-muted">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </PatternGrid>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title="Vanliga frågor från bolag som funderar på att bygga med oss."
            />
          </div>
          <FaqAccordion items={homeFaq} />
        </div>
      </Section>

      {/* ── Lead magnet ─────────────────────────────────────────────────────── */}
      <Section>
        <LeadMagnet />
      </Section>

      <Section>
        <div className="surface-elevated px-6 py-12 sm:px-10 sm:py-14">
          <div className="max-w-3xl space-y-6">
            <p className="eyebrow">Nästa steg</p>
            <h2 className="heading-lg text-balance">
              Har ni en idé, ett projekt eller ett produktproblem ni vill lösa snabbare?
            </h2>
            <p className="body-lg">
              Boka ett första samtal med VibeDev så går vi igenom nuläget, målbilden och vad som är smartast att
              bygga först. Helt kostnadsfritt och utan press.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton href="/boka-mote" size="lg">
                Boka strategisamtal&nbsp;→
              </LinkButton>
              <Link
                href="/kontakt"
                className="text-sm font-medium text-muted transition-colors hover:text-text"
              >
                Skicka förfrågan istället&nbsp;→
              </Link>
            </div>
            <p className="text-sm text-muted/70">Svar inom 24 timmar&nbsp;·&nbsp;Inga säljpitchar</p>
          </div>
        </div>
      </Section>
    </>
  );
}
