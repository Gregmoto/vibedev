"use client";

/**
 * Sticky bottom bar — mobile only (md:hidden).
 *
 * Fades + slides up after the user scrolls 600 px.
 * Hidden on /admin/*, /kontakt and /boka-mote.
 * Adds bottom padding to <body> on mobile when visible to prevent
 * page content being obscured.
 */

import { Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONTACT } from "@/lib/config/contact";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 600;
const BAR_HEIGHT        = 72; // px — keep in sync with min-h below

export function StickyMobileCta() {
  const pathname  = usePathname();
  const [visible, setVisible] = useState(false);
  const rafRef    = useRef<number | null>(null);

  /* ── Visibility rules ──────────────────────────────────────────────────── */

  const isHiddenRoute =
    pathname.startsWith("/admin") ||
    pathname === "/kontakt"       ||
    pathname === "/boka-mote";

  /* ── Scroll listener ───────────────────────────────────────────────────── */

  useEffect(() => {
    if (isHiddenRoute) return;

    function handleScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setVisible(window.scrollY >= SCROLL_THRESHOLD);
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check immediately in case page loads pre-scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHiddenRoute]);

  /* ── Body padding on mobile ────────────────────────────────────────────── */

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (visible && isMobile) {
      document.body.style.paddingBottom = `${BAR_HEIGHT}px`;
    } else {
      document.body.style.paddingBottom = "";
    }
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  if (isHiddenRoute) return null;

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        // Only on mobile
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        // Transition: slide up + fade in
        "transition-all duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      {/* Soft gradient bleed above the bar */}
      <div
        className="pointer-events-none h-6 bg-gradient-to-t from-bg/80 to-transparent"
        aria-hidden="true"
      />

      <div className="border-t border-line bg-panelElevated px-3 py-3 shadow-[0_-4px_24px_rgba(15,23,42,0.10)]">
        <div className="flex gap-2">
          {/* Primary — Boka samtal (60 %) */}
          <Link
            href="/boka-mote"
            className={cn(
              "flex min-h-[48px] flex-[3] items-center justify-center gap-2 rounded-xl",
              "bg-brand text-sm font-semibold text-bg",
              "transition-opacity active:opacity-80",
            )}
          >
            <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            Boka samtal
          </Link>

          {/* Secondary — Maila (40 %) */}
          <a
            href={CONTACT.emailHref}
            className={cn(
              "flex min-h-[48px] flex-[2] items-center justify-center gap-2 rounded-xl",
              "border border-lineStrong bg-transparent text-sm font-semibold text-text",
              "transition-colors active:bg-line/30",
            )}
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            Maila
          </a>
        </div>
      </div>
    </div>
  );
}
