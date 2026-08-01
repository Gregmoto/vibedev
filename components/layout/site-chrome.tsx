"use client";

import { usePathname } from "next/navigation";

/**
 * Döljer marknadsföringssajtens meny, footer och CTA-rutor på sidor som inte
 * är en del av sajten: adminpanelen och kundens ärendesida.
 *
 * En kund som klickar på länken i sitt kvittensmejl ska landa i ärendesystemet,
 * inte i en säljsida med "Boka möte" — och en handläggare i adminpanelen har
 * ingen nytta av huvudmenyn.
 *
 * usePathname fungerar även vid serverrendering, så innehållet uteblir redan i
 * HTML:en i stället för att blinka till och försvinna vid hydrering.
 */

const BARE_PREFIXES = ["/admin", "/arende"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBare = BARE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return isBare ? null : <>{children}</>;
}
