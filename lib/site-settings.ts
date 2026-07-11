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
  } catch {
    return null;
  }
}

export async function getResolvedSiteSettings(): Promise<ResolvedSiteSettings> {
  const settings = await getSiteSettings();

  return mergeSiteSettings(settings);
}

export function mergeSiteSettings(settings?: SiteSettings | null): ResolvedSiteSettings {
  return {
    siteName: settings?.siteName?.trim() || defaultSiteSettings.siteName,
    siteUrl: settings?.siteUrl?.trim() || defaultSiteSettings.siteUrl,
    contactEmail: settings?.contactEmail?.trim() || defaultSiteSettings.contactEmail,
    phone: settings?.phone?.trim() || defaultSiteSettings.phone,
    address: settings?.address?.trim() || defaultSiteSettings.address,
    footerText: settings?.footerText?.trim() || defaultSiteSettings.footerText,
    socialLinks: readSocialLinks(settings?.socialLinks),
    defaultSeoTitle: settings?.defaultSeoTitle?.trim() || defaultSiteSettings.defaultSeoTitle,
    defaultMetaDescription:
      settings?.defaultMetaDescription?.trim() || defaultSiteSettings.defaultMetaDescription,
    ga4MeasurementId: settings?.ga4MeasurementId?.trim() || defaultSiteSettings.ga4MeasurementId,
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
