"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

const CONSENT_STORAGE_KEY = "vibedev-cookie-consent";

type ConsentValue = "accepted" | "declined";

function readStoredConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function clearStoredConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // localStorage unavailable — nothing to clear
  }
}

type CookieConsentProps = {
  ga4MeasurementId?: string | null;
  ga4CustomScript?: string | null;
};

export function CookieConsent({ ga4MeasurementId, ga4CustomScript }: CookieConsentProps) {
  // null = inget val gjort ännu, undefined = inte hydrerad ännu (rendera inget)
  const [consent, setConsent] = useState<ConsentValue | null | undefined>(undefined);

  useEffect(() => {
    setConsent(readStoredConsent());
  }, []);

  function choose(value: ConsentValue) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // localStorage unavailable — valet gäller ändå för denna session
    }
    setConsent(value);
  }

  const hasAnalytics = Boolean(ga4CustomScript || ga4MeasurementId);

  return (
    <>
      {consent === "accepted" && hasAnalytics ? (
        <AnalyticsScripts ga4MeasurementId={ga4MeasurementId} ga4CustomScript={ga4CustomScript} />
      ) : null}

      {consent === null && hasAnalytics ? (
        <div
          role="region"
          aria-label="Cookie-inställningar"
          className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-xl rounded-2xl border border-line bg-bg p-5 shadow-2xl sm:inset-x-auto sm:left-6 sm:bottom-6"
        >
          <p className="text-sm font-semibold text-text">Vi använder cookies</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Vi använder Google Analytics för att förstå hur sajten används och göra den bättre.
            Statistik-cookies sätts bara om du godkänner det.{" "}
            <Link href="/cookies" className="underline underline-offset-2 hover:text-text">
              Läs mer i vår cookiepolicy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="h-10 rounded-xl bg-brand px-5 text-sm font-semibold text-bg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              Godkänn statistik
            </button>
            <button
              type="button"
              onClick={() => choose("declined")}
              className="h-10 rounded-xl border border-line px-5 text-sm font-semibold text-text transition hover:bg-line/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              Endast nödvändiga
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function AnalyticsScripts({ ga4MeasurementId, ga4CustomScript }: CookieConsentProps) {
  if (ga4CustomScript) {
    return (
      <Script
        id="ga4-custom-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: ga4CustomScript }}
      />
    );
  }

  if (!ga4MeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4MeasurementId}');
          `,
        }}
      />
    </>
  );
}
