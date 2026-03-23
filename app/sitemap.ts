import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

const routes = [
  "",
  "/tjanster",
  "/om-oss",
  "/blogg",
  "/podcast",
  "/case-studies",
  "/kontakt",
  "/boka-mote",
  "/resurser",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
