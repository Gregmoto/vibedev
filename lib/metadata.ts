import type { Metadata } from "next";
import type { ResolvedSiteSettings } from "@/lib/site-settings";

const siteName = "VibeDev";
const siteUrl = "https://vibedev.se";
const siteDescription =
  "VibeDev bygger appar, webbappar, AI-lösningar och digitala produkter för företag som vill växa snabbare.";
const defaultOgImage = "/og/vibedev-og.svg";

export type SeoFields = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean | null;
};

function toSiteTitle(title: string, baseSiteName: string) {
  return title === baseSiteName ? baseSiteName : `${title} | ${baseSiteName}`;
}

function resolveCanonical(canonicalUrl: string | undefined, path: string, baseSiteUrl: string) {
  const value = canonicalUrl?.trim();

  if (!value) {
    return path;
  }

  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : new URL(value, baseSiteUrl).toString();
}

export function createDynamicMetadata(input: {
  title: string;
  description?: string | null;
  path: string;
  settings: Pick<ResolvedSiteSettings, "siteName" | "siteUrl" | "defaultSeoTitle" | "defaultMetaDescription">;
  seo?: SeoFields | null;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}) {
  const baseSiteName = input.settings.siteName || siteName;
  const baseSiteUrl = input.settings.siteUrl || siteUrl;
  const resolvedTitle = input.seo?.seoTitle?.trim() || input.title || input.settings.defaultSeoTitle || siteName;
  const resolvedDescription =
    input.seo?.metaDescription?.trim() ||
    input.description?.trim() ||
    input.settings.defaultMetaDescription ||
    siteDescription;
  const ogTitle = input.seo?.ogTitle?.trim() || resolvedTitle;
  const ogDescription = input.seo?.ogDescription?.trim() || resolvedDescription;
  const canonical = resolveCanonical(input.seo?.canonicalUrl ?? undefined, input.path, baseSiteUrl);
  const openGraphUrl =
    typeof canonical === "string" && (canonical.startsWith("http://") || canonical.startsWith("https://"))
      ? canonical
      : new URL(input.path, baseSiteUrl).toString();
  const metadataBase = new URL(baseSiteUrl);

  return {
    title: toSiteTitle(resolvedTitle, baseSiteName),
    description: resolvedDescription,
    metadataBase,
    alternates: {
      canonical,
    },
    keywords: input.keywords,
    robots: {
      index: !input.seo?.noindex,
      follow: !input.seo?.noindex,
    },
    openGraph: {
      title: toSiteTitle(ogTitle, baseSiteName),
      description: ogDescription,
      url: openGraphUrl,
      siteName: baseSiteName,
      locale: "sv_SE",
      type: input.type ?? "website",
      ...(input.type === "article" && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${toSiteTitle(ogTitle, baseSiteName)} Open Graph`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: toSiteTitle(ogTitle, baseSiteName),
      description: ogDescription,
      images: [defaultOgImage],
    },
  } satisfies Metadata;
}

export function createMetadata(
  title: string,
  description: string = siteDescription,
  path = "/",
  options?: {
    keywords?: string[];
  },
): Metadata {
  return createDynamicMetadata({
    title,
    description,
    path,
    settings: {
      siteName,
      siteUrl,
      defaultSeoTitle: siteName,
      defaultMetaDescription: siteDescription,
    },
    keywords: options?.keywords,
    type: "website",
  });
}

export function createArticleMetadata(input: {
  title: string;
  description: string;
  path: string;
  publishedTime?: string;
  tags?: string[];
}) {
  const metadata = createMetadata(input.title, input.description, input.path, {
    keywords: input.tags,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article" as const,
      publishedTime: input.publishedTime,
      tags: input.tags,
    },
  } satisfies Metadata;
}

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  ogImage: defaultOgImage,
};
