import type { MetadataRoute } from "next";
import { getResolvedSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getResolvedSiteSettings();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    host: settings.siteUrl,
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  };
}
