import type { Metadata } from "next";

const siteName = "VibeDev";
const siteUrl = "https://vibedev.se";
const siteDescription =
  "VibeDev bygger appar, webbappar, AI-lösningar och digitala produkter för företag som vill växa snabbare.";

export function createMetadata(
  title: string,
  description: string = siteDescription,
  path = "/",
): Metadata {
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;
  const url = new URL(path, siteUrl).toString();

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: "sv_SE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description: siteDescription,
};
