import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage } from "@/lib/cms-public";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";
import { CONTACT } from "@/lib/config/contact";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/om-oss",
    fallbackTitle: "Om VibeDev — Seniort utvecklarteam i Stockholm",
    fallbackDescription:
      "Fyra erfarna utvecklare som tröttnade på att kod skulle vara dyrt och komplicerat. Lär känna oss och hur vi jobbar.",
    keywords: ["om vibedev", "produktteam stockholm", "senior utvecklare", "design och utveckling"],
  });
}

/* ── Inline SVG icons ────────────────────────────────────────────────────── */

type IconProps = { className?: string };

function IconCode({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconLayout({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function IconBrain({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",    url: siteConfig.url },
    { name: "Om oss", url: `${siteConfig.url}/om-oss` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="OM VIBEDEV"
        title="Fyra utvecklare som tröttnade på att kod skulle vara dyrt och komplicerat."
        description="Vi startade VibeDev för att bygga digitala produkter på ett enklare, snabbare och ärligare sätt — med strategi, design och utveckling i samma team."
      />

      {/* ── Vår syn ───────────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">

          {/* Left: copy */}
          <div className="surface-elevated p-8 sm:p-10">
            <SectionHeading
              eyebrow="VARFÖR VI FINNS"
              title="Vi tror att starka digitala produkter byggs när affär, design och teknik hänger ihop från början."
            />
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.75] text-muted">
              <p>
                Efter många år i branschen har vi sett samma mönster om och om igen: bolag
                betalar alldeles för mycket för utveckling som tar alldeles för lång tid. Stora
                byråer har långa upptaktsfaser, frilansare saknar struktur, och produktägare
                hamnar i kläm däremellan.
              </p>
              <p>
                Vi gör det annorlunda. Vi är ett litet seniort team som väljer projekt vi tror
                på och bygger som om vi vore en del av ert eget team. Inga onödiga möten, ingen
                byråjargong — bara rakt arbete mot ett tydligt mål.
              </p>
            </div>
          </div>

          {/* Right: trait pills */}
          <Card variant="outlined" className="flex flex-col justify-center p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
              Det som präglar oss
            </p>
            <p className="mt-3 text-sm text-muted">
              Seniort team · Tydlig kommunikation · Produktfokus · Hög leveranskapacitet
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="brand">Seniort team</Badge>
              <Badge tone="accent">Tydlig kommunikation</Badge>
              <Badge tone="success">Produktfokus</Badge>
              <Badge tone="neutral">Hög leveranskapacitet</Badge>
            </div>
          </Card>

        </div>
      </Section>

      {/* ── Det som präglar oss (4 H3 cards) ─────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="SÅ ARBETAR VI"
          title="Fyra saker som alltid gäller."
          className="mb-10"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Strategisk skärpa",
              text:  "Vi hjälper bolag reda ut vad som faktiskt ska byggas, vad som kan vänta och hur produkten ska stötta affären. Vi säger hellre nej till fel scope än ja till alla features.",
            },
            {
              title: "Design som skapar förtroende",
              text:  "Bra UX och tydlig struktur gör produkter enklare att sälja, enklare att använda och enklare att vidareutveckla. Vi designar inte bara för att det ska se snyggt ut — vi designar för att fungera.",
            },
            {
              title: "Teknik som håller",
              text:  "Vi bygger med fart, men utan att lämna efter oss onödig teknisk skuld eller svajiga beslut. Ni ska kunna utveckla vidare själva, byta partner eller skala — utan att riva upp grunden.",
            },
            {
              title: "Lätt att jobba med",
              text:  "Inga 50-sidiga avtal, inga byråprocesser, inga dolda kostnader. Veckovis demo, fast scope, fast pris, ärlig kommunikation.",
            },
          ].map((item) => (
            <Card key={item.title} variant="elevated" className="p-8">
              <h3 className="font-display text-xl font-bold tracking-tight text-text">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Teamet ────────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">

          {/* Left: text */}
          <div>
            <SectionHeading
              eyebrow="TEAMET"
              title="Fyra utvecklare med många års erfarenhet."
            />
            <p className="mt-5 text-[1.0625rem] leading-[1.75] text-muted">
              Vi är ett kompakt team där alla är seniora — det betyder att ni alltid pratar med
              personen som faktiskt bygger ert system, inte en account manager som vidarebefordrar
              frågor. Vår kombinerade erfarenhet sträcker sig över SaaS-plattformar, e-handel,
              community-appar, AI-integrationer, fintech och legal tech.
            </p>

            {/* Focus area cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  Icon:  IconCode,
                  title: "Fullstack-utveckling",
                  text:  "Next.js, React Native, TypeScript, Node, PostgreSQL och hela den moderna stacken. Vi bygger produkter, inte experiment.",
                },
                {
                  Icon:  IconLayout,
                  title: "Produktdesign",
                  text:  "UX, UI, designsystem och användarflöden. Vi designar för konvertering och tydlighet — inte trender.",
                },
                {
                  Icon:  IconBrain,
                  title: "AI & integrationer",
                  text:  "Praktisk AI som tillför värde, plus integrationer mot allt från Fortnox och Stripe till interna ERP- och CRM-system.",
                },
              ].map(({ Icon, title, text }) => (
                <Card key={title} variant="outlined" className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-text">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: role grid visual */}
          <div className="hidden lg:flex items-start justify-center">
            <div className="surface-elevated grid grid-cols-2 gap-6 p-10">
              {[
                { label: "Kod & Arkitektur", Icon: IconCode },
                { label: "Produkt & UX",     Icon: IconLayout },
                { label: "AI-integrationer", Icon: IconBrain },
                {
                  label: "Strategi",
                  Icon: ({ className }: IconProps) => (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                },
              ].map(({ label, Icon }) => (
                <div key={label} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full border border-brandDeep/60 bg-brandDeep">
                    <Icon className="h-8 w-8 text-brand" />
                  </div>
                  <span className="max-w-[80px] text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Section>

      {/* ── Vad vi byggt ──────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="surface-elevated px-8 py-10 sm:px-10">
          <SectionHeading
            eyebrow="ERFARENHET"
            title="Vi har byggt produkter inom..."
          />
          <ul className="mt-8 space-y-3">
            {[
              { label: "E-handel & CMS",                detail: "CMS Online"               },
              { label: "Community-plattformar",          detail: "Bookiz, Min Odling"        },
              { label: "Legal tech",                     detail: "Mittbrottmål"              },
              { label: "Ekonomi-SaaS",                   detail: "Endoo — pågående"          },
              { label: "AI-integrationer",               detail: "i flera produkter"         },
            ].map(({ label, detail }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span className="text-base text-text">
                  {label}{" "}
                  <span className="text-muted">— {detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center text-sm font-semibold text-brand transition hover:text-text"
            >
              Se alla case →
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Värderingar ───────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="VÄRDERINGAR"
          title="Det vi alltid håller fast vid."
          className="mb-10"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Ärlighet före försäljning",
              text:  "Om vi inte är rätt partner — säger vi det direkt. Vi rekommenderar gärna någon annan om det passar er bättre.",
            },
            {
              number: "02",
              title: "Enklare före komplext",
              text:  "Vi väljer alltid den enklaste lösningen som faktiskt löser problemet. Komplexitet är dyrt — för er och för framtida utvecklare.",
            },
            {
              number: "03",
              title: "Tillgängligt före exklusivt",
              text:  "Vi tror att moderna verktyg och AI gör det möjligt att bygga snabbare och billigare än någonsin. Vi vill att fler bolag ska kunna ha råd med riktigt bra utveckling.",
            },
          ].map(({ number, title, text }) => (
            <Card key={title} variant="elevated" className="p-8">
              <span className="font-display text-3xl font-bold text-brand/20">{number}</span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-text">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Slut-CTA ──────────────────────────────────────────────────────── */}
      <Section>
        <CtaPanel
          eyebrow="Vill ni prata?"
          title="Boka 20 minuter — vi går igenom ert läge, era mål och om vi är rätt match."
          description="Inga säljpitchar. Bara ett ärligt samtal om vad ni behöver och vad som är rimligt."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka samtal</LinkButton>
              <LinkButton href={`mailto:${CONTACT.email}`} variant="secondary">
                Skicka mail
              </LinkButton>
            </>
          }
        />
      </Section>
    </>
  );
}
