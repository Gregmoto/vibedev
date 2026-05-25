import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CalEmbed } from "@/components/booking/cal-embed";
import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { createMetadataForStandardPage } from "@/lib/cms-public";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/boka-mote",
    fallbackTitle: "Boka kostnadsfritt strategisamtal — VibeDev",
    fallbackDescription:
      "Boka ett 20 minuter strategisamtal med VibeDev. Gratis, utan förbindelser — vi går igenom ert nuläge och vad som är smartast att bygga först.",
    keywords: ["boka möte", "strategisamtal", "gratis konsultation", "mvp", "apputveckling"],
  });
}

/* ── Inline check icon ──────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
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

/* ── Cal skeleton (Suspense fallback shown during SSR/prerender) ─────────── */

function CalSuspenseFallback() {
  return (
    <div className="min-h-[600px] animate-pulse rounded-2xl border border-line bg-[#F4F5F8]" />
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

const INCLUDES = [
  "20 min fokuserat samtal med en senior utvecklare",
  "Vi kartlägger ert nuläge och era mål",
  "Ärlig bedömning om vi är rätt partner — eller om någon annan passar bättre",
  "Skriftligt nästa-steg-förslag inom 24 timmar efter samtalet",
  "Helt kostnadsfritt och ingen förbindelse",
];

export default function BookMeetingPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="page-hero border-b border-line/50">
        <div className="container-shell py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Boka samtal</p>
            <h1 className="heading-xl mt-4 max-w-2xl text-balance">
              20 minuter som kan spara er månader.
            </h1>
            <p className="body-lg mt-5 max-w-2xl">
              Ett kostnadsfritt samtal där vi går igenom ert nuläge, målbild och vad som är
              smartast att bygga först. Inga säljpitchar&nbsp;— bara raka rekommendationer.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main: left features + right calendar ───────────────────────────── */}
      <Section size="tight">
        <div className="grid items-start gap-12 lg:grid-cols-[2fr_3fr]">

          {/* ── Left column (40 %) ─────────────────────────────────────────── */}
          <div className="space-y-8">

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
                Vad du får ut av samtalet
              </h2>
              <ul className="mt-5 space-y-4">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm leading-6 text-muted sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* "Inte redo att boka?" callout */}
            <div className="rounded-2xl border border-line bg-bg p-5">
              <p className="text-sm font-semibold text-text">Inte redo att boka?</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Föredrar ni att skriva istället? Skicka en kort förfrågan så återkommer vi inom
                en arbetsdag.
              </p>
              <Link
                href="/kontakt"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand transition duration-200 hover:text-text"
              >
                Skicka förfrågan&nbsp;→
              </Link>
            </div>

          </div>

          {/* ── Right column (60 %) — Cal.com embed ────────────────────────── */}
          {/*
           * Wrapped in Suspense because CalEmbed uses useSearchParams(),
           * which opts that subtree out of static prerendering.
           * The fallback shows a size-matched skeleton so there is no CLS.
           */}
          <Suspense fallback={<CalSuspenseFallback />}>
            <CalEmbed />
          </Suspense>

        </div>
      </Section>
    </>
  );
}
