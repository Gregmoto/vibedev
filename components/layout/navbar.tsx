"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { navigation } from "@/content/navigation";

type NavbarProps = {
  siteName?: string;
};

export function Navbar({ siteName = "VibeDev" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-[4.75rem] items-center justify-between gap-4 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              VD
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-text">{siteName}</p>
              <p className="text-xs text-muted">Appar, webbappar och AI-lösningar</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive ? "bg-white/[0.06] text-text" : "text-muted hover:bg-white/[0.04] hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <LinkButton href="/boka-mote" size="sm">
              Boka möte
            </LinkButton>
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Öppna meny"
            className="button-secondary px-4 py-2 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="sr-only">Öppna meny</span>
            <span className="text-sm">{mobileOpen ? "Stäng" : "Meny"}</span>
          </button>
        </div>

        {mobileOpen ? (
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
                    isActive ? "bg-white/[0.07] text-text" : "text-muted hover:bg-white/[0.04] hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
