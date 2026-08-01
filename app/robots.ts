import type { MetadataRoute } from "next";
import { getResolvedSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getResolvedSiteSettings();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /arende/ nås med en hemlig token i länken — den ska varken följas
        // eller indexeras, oavsett hur någon råkar dela länken vidare.
        disallow: ["/admin", "/admin/", "/api/", "/arende/"],
      },
    ],
    host: settings.siteUrl,
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  };
}
