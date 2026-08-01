import type { MetadataRoute } from "next";
import { getResolvedSiteSettings } from "@/lib/site-settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getResolvedSiteSettings();

  return {
    name: settings.siteName,
    short_name: settings.siteName,
    description:
      settings.defaultMetaDescription ??
      "Seniort produktteam i Stockholm som bygger appar, webbappar och AI-lösningar.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
