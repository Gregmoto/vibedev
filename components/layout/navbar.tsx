"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoFull, LogoMark } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { navigation } from "@/content/navigation";

export function Navbar() {
  const pathname   = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/50 bg-bg/80 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-[4.75rem] items-center justify-between gap-4 py-3">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/" className="group flex items-center gap-3" aria-label="VibeDev — startsida">
            {/* Mark only on mobile */}
            <span className="lg:hidden">
              <LogoMark size={36} />
            </span>
            {/* Full wordmark on desktop */}
            <span className="hidden lg:flex lg:items-center lg:gap-3">
              <LogoFull height={32} />
              <span className="hidden h-4 w-px bg-line xl:block" aria-hidden="true" />
              <span className="hidden text-xs text-muted xl:block">
                Appar, webbappar och AI-lösningar
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Huvudnavigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-muted hover:bg-line/30 hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA + mobile toggle ───────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LinkButton href="/boka-mote" size="sm">
                Boka möte
              </LinkButton>
            </div>

            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
              className="button-secondary px-4 py-2 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="text-sm">{mobileOpen ? "Stäng" : "Meny"}</span>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div id="mobile-menu" className="surface-elevated mb-4 grid gap-2 p-3 lg:hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-muted hover:bg-line/30 hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-1 px-2 pb-1">
              <LinkButton href="/boka-mote" className="w-full">
                Boka möte
              </LinkButton>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
