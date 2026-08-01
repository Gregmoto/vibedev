"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/button";

const DISMISS_KEY = "vibedev-sticky-cta-dismissed";

export function StickyCta() {
  const pathname = usePathname();
  // undefined = vet ännu inte (inte hydrerad) -> rendera inget, undviker att
  // rutan blinkar till för den som redan stängt den.
  const [dismissed, setDismissed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage otillgängligt — valet gäller ändå för den här sessionen
    }
    setDismissed(true);
  }

  if (pathname === "/kontakt" || pathname === "/boka-mote") {
    return null;
  }

  if (dismissed !== false) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 hidden px-4 md:block">
      <div className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full border border-line bg-panelElevated/95 py-3 pl-5 pr-3 shadow-panel backdrop-blur-xl">
        <div>
          <p className="text-sm font-semibold text-text">Redo att bygga nästa steg?</p>
          <p className="text-xs text-muted">Få ett tydligt upplägg för app, webbapp, AI eller MVP.</p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton href="/kontakt" variant="secondary" size="sm">
            Kontakt
          </LinkButton>
          <LinkButton href="/boka-mote" size="sm">
            Boka möte
          </LinkButton>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Stäng"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-line hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
