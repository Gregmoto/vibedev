import Link from "next/link";
import type { ComponentType } from "react";
import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

/* ── Inline SVG icons (no external dep) ─────────────────────────────────── */

type IconProps = { className?: string };

function IconCode({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function IconPen({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconTarget({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconSparkles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

/* ── Role data ───────────────────────────────────────────────────────────── */

const roles: { label: string; Icon: ComponentType<IconProps> }[] = [
  { label: "Kod & Arkitektur", Icon: IconCode },
  { label: "Produkt & UX",     Icon: IconPen },
  { label: "Strategi",         Icon: IconTarget },
  { label: "AI-integrationer", Icon: IconSparkles },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function TeamSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">

        {/* ── Left: text ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Pre-title badge */}
          <div className="inline-flex items-center rounded-full bg-brandDeep px-4 py-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Teamet bakom VibeDev
            </span>
          </div>

          {/* H2 */}
          <h2 className="text-balance font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-text sm:text-[2.5rem] lg:text-[3rem]">
            Fyra utvecklare som tröttnade på att kod skulle vara dyrt och komplicerat.
          </h2>

          {/* Body text — 3 paragraphs */}
          <div className="space-y-4 text-[1.0625rem] leading-[1.75] text-muted">
            <p>
              VibeDev är ett team på fyra seniora utvecklare med många års erfarenhet av
              utveckling, projektledning och struktur. Vi har byggt allt från SaaS-plattformar
              och CMS-system till AI-funktioner och MVP:er för founders.
            </p>
            <p>
              Vi startade VibeDev av en enkel anledning: vi har sett alldeles för många bolag
              betala alldeles för mycket för utveckling som tar alldeles för lång tid. Det går att
              göra det enklare. Och det går att göra det billigare&nbsp;— utan att tumma på
              kvalitet.
            </p>
            <p>
              Vi väljer projekt vi tror på och säger nej till uppdrag där vi inte tillför värde.
              Det är så vi kan lova fast scope, fast pris och leverans i tid.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <LinkButton href="/boka-mote" size="lg">
              Boka samtal med teamet&nbsp;→
            </LinkButton>
          </div>
        </div>

        {/* ── Right: visual ────────────────────────────────────────────── */}
        {/* TODO: ev. byt mot riktig teambild när tillgänglig */}
        <div className="surface-elevated flex items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {roles.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                {/* Avatar circle */}
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-brandDeep/60 bg-brandDeep">
                  <Icon className="h-9 w-9 text-brand" />
                </div>
                {/* Label */}
                <span className="max-w-[88px] text-[11px] font-semibold uppercase leading-tight tracking-[0.16em] text-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}
