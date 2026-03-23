import type { Prisma, SiteSettings } from "@prisma/client";
import { db } from "@/lib/db";

export type SocialLink = {
  label: string;
  url: string;
};

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
  contactEmail: "hello@vibedev.se",
  phone: "+46 70 123 45 67",
  address: "Stockholm, Sverige",
  footerText:
    "Moderna digitala produkter för bolag som vill växa snabbare med bättre teknik, tydligare produktbeslut och starkare användarupplevelser.",
  socialLinks: [
    { label: "LinkedIn", url: "https://www.linkedin.com" },
    { label: "Instagram", url: "https://www.instagram.com" },
  ],
  defaultSeoTitle: "VibeDev",
  defaultMetaDescription:
    "VibeDev bygger appar, webbappar, AI-lösningar och digitala produkter för företag som vill växa snabbare.",
  ga4MeasurementId: null,
  ga4CustomScript: null,
  googleSearchConsoleVerification: null,
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
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
    ga4MeasurementId: settings?.ga4MeasurementId?.trim() || null,
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

export function parseSocialLinksInput(value: string): SocialLink[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part.trim());

      return {
        label: url ? label : "Länk",
        url: url ?? label,
      };
    });
}

export function readSocialLinks(value: Prisma.JsonValue | null | undefined): SocialLink[] {
  if (!Array.isArray(value)) {
    return defaultSiteSettings.socialLinks;
  }

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const label = "label" in item && typeof item.label === "string" ? item.label.trim() : "";
      const url = "url" in item && typeof item.url === "string" ? item.url.trim() : "";

      return label && url ? { label, url } : null;
    })
    .filter((item): item is SocialLink => Boolean(item));

  return links.length > 0 ? links : defaultSiteSettings.socialLinks;
}

export function formatSocialLinks(value: unknown) {
  return readSocialLinks(value as Prisma.JsonValue | null | undefined)
    .map((item) => `${item.label} | ${item.url}`)
    .filter(Boolean)
    .join("\n");
}

export function normalizeScriptContent(value?: string | null) {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const scriptMatch = trimmed.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);

  return (scriptMatch?.[1] ?? trimmed).trim() || null;
}
