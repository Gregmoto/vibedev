import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/* ── Check icon (no external dep) ──────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2.5 8 6.5 12 13.5 4" />
    </svg>
  );
}

/* ── Package data ────────────────────────────────────────────────────────── */

type PackageItem = {
  id: string;
  duration: string;
  name: string;
  highlighted?: boolean;
  badge?: string;
  description: string;
  includes: string[];
  cta: { label: string; href: string; variant: "primary" | "secondary" };
};

const packages: PackageItem[] = [
  {
    id: "ai-sprint",
    duration: "2 veckor",
    name: "AI Sprint",
    description:
      "För er som vill testa en AI-funktion i befintlig produkt. Vi bygger en fungerande prototyp och ger ett beslutsunderlag för fortsatt investering.",
    includes: [
      "Use-case-workshop (halvdag)",
      "Fungerande AI-prototyp",
      "Integrationsplan för befintlig stack",
      "Beslutsunderlag + nästa-steg-förslag",
    ],
    cta: { label: "Begär offert", href: "/kontakt?paket=ai-sprint", variant: "secondary" },
  },
  {
    id: "mvp",
    duration: "6–8 veckor",
    name: "MVP-utveckling",
    highlighted: true,
    badge: "Populärt val",
    description:
      "För founders som ska validera en affärsidé på riktig marknad. Lanseringsklar produkt byggd för att kunna växa — utan teknisk skuld.",
    includes: [
      "Strategi- och scope-workshop",
      "UI/UX-design i Figma",
      "App eller webbapp (Next.js / React Native)",
      "Inloggning, betalning, notiser",
      "Lansering + 2 veckors support efter go-live",
    ],
    cta: { label: "Boka MVP-samtal", href: "/boka-mote?paket=mvp", variant: "primary" },
  },
  {
    id: "partnerskap",
    duration: "Löpande",
    name: "Produktpartnerskap",
    description:
      "För scaleups med befintlig produkt. Senior produkt- och utvecklingskapacitet på månadsbasis — utan rekryteringsstök eller inhouse-overhead.",
    includes: [
      "Dedikerat seniort team",
      "Veckovis demo + planering",
      "Produkt-, design- och utvecklingsstöd",
      "Flexibel uppsägning (30 dagar)",
    ],
    cta: {
      label: "Diskutera partnerskap",
      href: "/kontakt?paket=partnerskap",
      variant: "secondary",
    },
  },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function PackagesSection() {
  return (
    <Section>
      {/* Section heading */}
      <SectionHeading
        eyebrow="Tre sätt att starta"
        title="Välj vägen som passar er bäst."
        description="Vi anpassar alltid scope och leverans efter er situation — men dessa tre upplägg täcker 90% av projekten vi gör."
      />

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={cn(
              "relative flex flex-col rounded-2xl p-8",
              "shadow-panel transition-all duration-300",
              "hover:-translate-y-0.5 hover:shadow-lg-card",
              pkg.highlighted
                ? "border-2 border-brand bg-[#EFF6FF]"
                : "border border-line bg-panel",
            )}
          >
            {/* "Populärt val" floating badge */}
            {pkg.highlighted && pkg.badge ? (
              <div className="absolute -top-[1.0625rem] right-6" aria-label={pkg.badge}>
                <span className="rounded-full bg-brand px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-bg shadow-sm">
                  {pkg.badge}
                </span>
              </div>
            ) : null}

            {/* Duration pill */}
            <div
              className={cn(
                "inline-flex w-fit items-center rounded-full px-3 py-1",
                pkg.highlighted ? "bg-brand/15 text-brand" : "bg-brandDeep text-brand",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                {pkg.duration}
              </span>
            </div>

            {/* Package name */}
            <h3 className="mt-4 font-display text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-text">
              {pkg.name}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm leading-7 text-muted">{pkg.description}</p>

            {/* Divider */}
            <div
              className={cn(
                "my-6 h-px",
                pkg.highlighted ? "bg-brand/20" : "bg-line",
              )}
            />

            {/* Includes list — flex-1 keeps CTA at the card bottom */}
            <ul className="flex-1 space-y-3">
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-sm leading-6 text-muted">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA button — full width */}
            <div className="mt-8">
              <LinkButton
                href={pkg.cta.href}
                variant={pkg.cta.variant}
                size="md"
                className="w-full"
              >
                {pkg.cta.label}
              </LinkButton>
            </div>
          </div>
        ))}
      </div>

      {/* Below-cards trust line */}
      <div className="mt-10 space-y-2 text-center">
        <p className="text-sm text-muted">
          Alla projekt kommer med fast scope och fast pris efter inledande samtal.
          Inga timdebiteringar som rusar iväg.
        </p>
        <div>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand transition duration-200 hover:text-text"
          >
            Något annat ni behöver? Skicka en förfrågan&nbsp;→
          </Link>
        </div>
      </div>
    </Section>
  );
}
