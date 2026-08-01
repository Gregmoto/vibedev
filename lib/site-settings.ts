import type { SiteSettings } from "@prisma/client";
import { db, hasDatabase } from "@/lib/db";
import { validateGa4CustomScript } from "@/lib/admin-action-utils";
import { CONTACT } from "@/lib/config/contact";
import {
  DEFAULT_SOCIAL_LINKS,
  formatSocialLinks,
  parseSocialLinksInput,
  readSocialLinks,
  type SocialLink,
} from "@/lib/social-links";

// Re-export för bakåtkompatibilitet — flyttat till den db-fria modulen lib/social-links.ts.
export { formatSocialLinks, parseSocialLinksInput, readSocialLinks };
export type { SocialLink };

export type ResolvedSiteSettings = {
  siteName: string;
  siteUrl: string;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  footerText: string | null;
  socialLinks: SocialLink[];
  defaultSeoTitle: string | null;
  defaultMetaDescription: string | null;
  ga4MeasurementId: string | null;
  ga4CustomScript: string | null;
  googleSearchConsoleVerification: string | null;
};

export const defaultSiteSettings: ResolvedSiteSettings = {
  siteName: "VibeDev",
  siteUrl: "https://vibedev.se",
  contactEmail: CONTACT.email,
  phone: CONTACT.phone,
  address: `${CONTACT.address.city}, ${CONTACT.address.country}`,
  footerText:
    "Moderna digitala produkter för bolag som vill växa snabbare med bättre teknik, tydligare produktbeslut och starkare användarupplevelser.",
  socialLinks: DEFAULT_SOCIAL_LINKS,
  defaultSeoTitle: "VibeDev",
  defaultMetaDescription:
    "VibeDev bygger appar, webbappar, AI-lösningar och digitala produkter för företag som vill växa snabbare.",
  ga4MeasurementId: "G-ZTM2L9Y2DD",
  ga4CustomScript: null,
  googleSearchConsoleVerification: null,
};

function hasDatabaseUrl() {
  return hasDatabase();
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    return await db.siteSettings.findFirst({
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    // Vi faller tillbaka på standardvärden så att sajten fortsätter fungera,
    // men felet måste loggas: annars ser ett databasavbrott exakt likadant ut
    // som "inga inställningar sparade än" — och sparade ändringar verkar
    // försvinna utan spår i adminpanelen.
    console.error("[site-settings] Kunde inte läsa inställningar från databasen:", err);
    return null;
  }
}

export async function getResolvedSiteSettings(): Promise<ResolvedSiteSettings> {
  const settings = await getSiteSettings();

  return mergeSiteSettings(settings);
}

/**
 * null/undefined = fältet har aldrig satts -> använd standardvärdet.
 * Tom sträng = admin har medvetet tömt fältet -> respektera det.
 *
 * Skillnaden är hela poängen: med `||` är "" falsy, så varje tömt fält
 * återgick till sitt standardvärde nästa gång sidan lästes in.
 */
function resolveText(
  value: string | null | undefined,
  fallback: string | null,
): string | null {
  return value === null || value === undefined ? fallback : value.trim();
}

export function mergeSiteSettings(settings?: SiteSettings | null): ResolvedSiteSettings {
  return {
    // siteName och siteUrl måste ha ett värde — en tom siteUrl kraschar
    // metadataBase och canonical-länkar. De faller därför alltid tillbaka.
    siteName: settings?.siteName?.trim() || defaultSiteSettings.siteName,
    siteUrl: settings?.siteUrl?.trim() || defaultSiteSettings.siteUrl,

    contactEmail: resolveText(settings?.contactEmail, defaultSiteSettings.contactEmail),
    phone: resolveText(settings?.phone, defaultSiteSettings.phone),
    address: resolveText(settings?.address, defaultSiteSettings.address),
    footerText: resolveText(settings?.footerText, defaultSiteSettings.footerText),
    socialLinks: readSocialLinks(settings?.socialLinks),
    defaultSeoTitle: resolveText(settings?.defaultSeoTitle, defaultSiteSettings.defaultSeoTitle),
    defaultMetaDescription: resolveText(
      settings?.defaultMetaDescription,
      defaultSiteSettings.defaultMetaDescription,
    ),
    // Tömd GA4-kod ska stänga av spårningen, inte återgå till standard-id:t.
    ga4MeasurementId:
      settings?.ga4MeasurementId === null || settings?.ga4MeasurementId === undefined
        ? defaultSiteSettings.ga4MeasurementId
        : settings.ga4MeasurementId.trim() || null,
    ga4CustomScript: normalizeScriptContent(settings?.ga4CustomScript),
    googleSearchConsoleVerification: settings?.googleSearchConsoleVerification?.trim() || null,
  };
}

export function parseSearchConsoleVerification(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  const contentMatch = trimmed.match(/content=["']([^"']+)["']/i);

  return contentMatch?.[1] ?? trimmed;
}

export function normalizeScriptContent(value?: string | null) {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const scriptMatch = trimmed.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  const normalized = (scriptMatch?.[1] ?? trimmed).trim();

  if (!normalized || !validateGa4CustomScript(normalized)) {
    return null;
  }

  return normalized;
}
