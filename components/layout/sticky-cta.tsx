"use client";

import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/button";

export function StickyCta() {
  const pathname = usePathname();

  if (pathname === "/kontakt" || pathname === "/boka-mote") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 hidden px-4 md:block">
      <div className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full border border-white/10 bg-panelElevated/95 px-5 py-3 shadow-glow backdrop-blur-xl">
        <div>
          <p className="text-sm font-semibold text-text">Redo att bygga nästa steg?</p>
          <p className="text-xs text-muted">Få ett tydligt upplägg för app, webbapp, AI eller MVP.</p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/kontakt" variant="secondary" size="sm">
            Kontakt
          </LinkButton>
          <LinkButton href="/boka-mote" size="sm">
            Boka möte
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
