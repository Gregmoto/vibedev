"use client";

import { clearStoredConsent } from "@/components/consent/cookie-consent";

/** Nollställer cookie-valet och laddar om sidan så bannern visas igen. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        clearStoredConsent();
        window.location.reload();
      }}
      className="inline-flex h-10 items-center rounded-xl border border-line px-5 text-sm font-semibold text-text transition hover:bg-line/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      Ändra cookie-inställningar
    </button>
  );
}
