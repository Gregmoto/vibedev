import { siteConfig } from "@/lib/metadata";

type SchemaContext = {
  siteName?: string;
  siteUrl?: string;
  email?: string;
};

export function organizationSchema(context?: SchemaContext) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: context?.siteName || siteConfig.name,
    url: context?.siteUrl || siteConfig.url,
    email: context?.email || "hello@vibedev.se",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Stockholm",
      addressCountry: "SE",
    },
  };
}

export function websiteSchema(context?: SchemaContext) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: context?.siteName || siteConfig.name,
    url: context?.siteUrl || siteConfig.url,
    inLanguage: "sv-SE",
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
  keywords?: string[];
  siteName?: string;
  siteUrl?: string;
}) {
  const siteName = input.siteName || siteConfig.name;
  const siteUrl = input.siteUrl || siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    mainEntityOfPage: `${siteUrl}${input.path}`,
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    author: {
      "@type": "Organization",
      name: siteName,
    },
    keywords: input.keywords,
  };
}

export function podcastEpisodeSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
  duration?: string;
  siteName?: string;
  siteUrl?: string;
}) {
  const siteName = input.siteName || siteConfig.name;
  const siteUrl = input.siteUrl || siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    url: `${siteUrl}${input.path}`,
    timeRequired: input.duration,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: `${siteName} Podcast`,
    },
  };
}
