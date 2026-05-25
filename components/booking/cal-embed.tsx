"use client";

/**
 * Cal.com inline embed wrapper.
 *
 * Reads the `?paket=` query param and pre-fills the Cal "notes" field so
 * agents can see which package the visitor was interested in.
 *
 * Set NEXT_PUBLIC_CAL_USERNAME in .env.local to enable.
 */

import Cal, { getCalApi } from "@calcom/embed-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ── Query-param → notes mapping ─────────────────────────────────────────── */

const PAKET_NOTES: Record<string, string> = {
  "ai-sprint":   "Intresserad av AI Sprint (2 veckor)",
  "mvp":         "Intresserad av MVP-utveckling (6–8 veckor)",
  "partnerskap": "Intresserad av Produktpartnerskap (löpande)",
};

/* ── Env vars (resolved once at module load) ─────────────────────────────── */
/* Defaults are safe to hard-code — Cal.com usernames are public by design.  */

const CAL_USERNAME   = process.env.NEXT_PUBLIC_CAL_USERNAME   || "vibedev";
const CAL_EVENT_SLUG = process.env.NEXT_PUBLIC_CAL_EVENT_SLUG || "30min";

/* ── Skeleton ────────────────────────────────────────────────────────────── */

function CalSkeleton({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 rounded-2xl bg-[#F4F5F8] transition-opacity duration-500",
        visible ? "animate-pulse opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden="true"
    >
      {/* Calendar-shaped skeleton to minimise layout-shift perception */}
      <div className="p-6">
        {/* Month heading */}
        <div className="mb-6 h-7 w-44 rounded-lg bg-line/60" />
        {/* Weekday labels */}
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-6 rounded bg-line/35" />
          ))}
        </div>
        {/* Day cells — 5 weeks × 7 days */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-line/20" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function CalEmbed() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  const paket   = searchParams.get("paket") ?? "";
  const notes   = PAKET_NOTES[paket] ?? "";
  const calLink = `${CAL_USERNAME}/${CAL_EVENT_SLUG}`;

  useEffect(() => {
    // Guard: don't run if no username is configured
    if (!CAL_USERNAME) return;

    let mounted = true;

    (async () => {
      const cal = await getCalApi();
      if (!mounted) return;

      // Apply brand colour for the light theme
      cal("ui", {
        // Both theme keys required by Record<Theme, Record<string,string>>
        cssVarsPerTheme: {
          light: { "cal-brand": "#2563EB" },
          dark:  { "cal-brand": "#2563EB" },
        },
        hideEventTypeDetails: false,
      });

      // Dismiss skeleton once Cal has fully initialised the iframe
      cal("on", {
        action: "linkReady",
        callback: () => {
          if (mounted) setIsReady(true);
        },
      });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ── Not configured yet ───────────────────────────────────────────────── */

  if (!CAL_USERNAME) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-lineStrong bg-bg p-8 text-center">
        <p className="text-sm font-semibold text-text">Kalenderbokning ej konfigurerad</p>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Sätt{" "}
          <code className="rounded bg-line px-1.5 py-0.5 text-xs font-mono text-brand">
            NEXT_PUBLIC_CAL_USERNAME
          </code>{" "}
          i <code className="rounded bg-line px-1.5 py-0.5 text-xs font-mono text-brand">.env.local</code>{" "}
          för att aktivera Cal.com-bokning.
        </p>
      </div>
    );
  }

  /* ── Embed ────────────────────────────────────────────────────────────── */

  return (
    <div className="relative min-h-[600px] overflow-hidden rounded-2xl border border-line bg-panel">
      {/* Skeleton: rendered on top of Cal until linkReady fires */}
      <CalSkeleton visible={!isReady} />

      {/*
       * Cal is always in the DOM so the 600px min-height is always claimed
       * → no layout shift regardless of how long the iframe takes to load.
       */}
      <Cal
        calLink={calLink}
        config={{
          theme: "light",
          layout: "month_view",
          // Pass interested package as pre-filled notes when coming via
          // a "?paket=…" query param (e.g. from PackagesSection CTAs)
          ...(notes ? { notes } : {}),
        }}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
      />
    </div>
  );
}
