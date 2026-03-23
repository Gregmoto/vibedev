import type { MetadataRoute } from "next";
import {
  getPublishedBlogPosts,
  getPublishedCaseStudies,
  getPublishedCustomPages,
  getPublishedPodcastEpisodes,
} from "@/lib/cms-public";
import { getResolvedSiteSettings } from "@/lib/site-settings";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getResolvedSiteSettings();
  const [blogPosts, podcastEpisodes, caseStudies, customPages] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedPodcastEpisodes(),
    getPublishedCaseStudies(),
    getPublishedCustomPages(),
  ]);

  const staticRoutes = routes.map((route) => ({
    url: `${settings.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const articleRoutes = blogPosts.map((post) => ({
    url: `${settings.siteUrl}/blogg/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const episodeRoutes = podcastEpisodes.map((episode) => ({
    url: `${settings.siteUrl}/podcast/${episode.slug}`,
    lastModified: new Date(episode.updatedAt || episode.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseRoutes = caseStudies.map((item) => ({
    url: `${settings.siteUrl}/case-studies/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.publishedAt || new Date().toISOString()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pageRoutes = customPages.map((page) => ({
    url: `${settings.siteUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...episodeRoutes, ...caseRoutes, ...pageRoutes];
}
