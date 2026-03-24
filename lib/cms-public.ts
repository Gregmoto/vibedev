import { ContentStatus, type BlogPost as DbBlogPost, type CaseStudy as DbCaseStudy, type Page as DbPage, type PodcastEpisode as DbPodcastEpisode, type Prisma } from "@prisma/client";
import { blogPosts as staticBlogPosts, getBlogPost } from "@/content/blog";
import { caseStudies as staticCaseStudies } from "@/content/cases";
import { getPodcastEpisode, podcastEpisodes as staticPodcastEpisodes } from "@/content/podcast";
import { db } from "@/lib/db";
import { createDynamicMetadata, type SeoFields } from "@/lib/metadata";
import { getResolvedSiteSettings } from "@/lib/site-settings";

const standardPageSlugs = new Set(["", "/", "hem", "start", "tjanster", "om-oss", "blogg", "podcast", "case-studies", "kontakt", "boka-mote", "resurser"]);

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  author: string;
  heroLabel: string;
  updatedAt: string;
  content: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  seo: SeoFields;
};

export type PublicPodcastEpisode = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  duration: string;
  guests: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  showNotes: string[];
  summary: string[];
  updatedAt: string;
  embedUrl?: string | null;
  audioUrl?: string | null;
  coverImage?: string | null;
  seo: SeoFields;
};

export type PublicCaseStudy = {
  id: string;
  slug: string;
  projectName: string;
  industry: string;
  summary: string;
  customerProblem: string;
  solution: string;
  process: string[];
  results: string[];
  techStack: string[];
  featuredImage?: string | null;
  clientName?: string | null;
  publishedAt?: string;
  updatedAt: string;
  cta: {
    label: string;
    href: string;
  };
  seo: SeoFields;
};

export type PublicPage = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  content: string;
  updatedAt: string;
  seo: SeoFields;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function readingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));

  return `${minutes} min läsning`;
}

function extractMarkdown(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  const markdown = "markdown" in value && typeof value.markdown === "string" ? value.markdown : "";

  return markdown.trim();
}

function extractItems(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const items = "items" in value && Array.isArray(value.items) ? value.items : [];

  return items.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
}

function markdownToSections(markdown: string) {
  const lines = markdown.split("\n").map((line) => line.trimEnd());
  const sections: Array<{ heading: string; paragraphs: string[] }> = [];
  let currentHeading = "Innehåll";
  let buffer: string[] = [];

  const flush = () => {
    const paragraphs = buffer.join("\n").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);

    if (paragraphs.length > 0) {
      sections.push({ heading: currentHeading, paragraphs });
    }

    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      currentHeading = line.replace(/^##\s+/, "").trim() || "Innehåll";
      continue;
    }

    if (line.startsWith("# ")) {
      continue;
    }

    buffer.push(line);
  }

  flush();

  return sections.length > 0 ? sections : [{ heading: "Innehåll", paragraphs: markdown.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) }];
}

function markdownToParagraphs(markdown: string) {
  return markdown
    .split(/\n\s*\n/)
    .map((item) => item.replace(/^#+\s+/gm, "").trim())
    .filter(Boolean);
}

function mapStaticBlogPost(slug: string): PublicBlogPost | null {
  const post = getBlogPost(slug);

  if (!post) {
    return null;
  }

  return {
    id: `static-${post.slug}`,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    description: post.description,
    category: post.category,
    tags: post.tags,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt,
    author: post.author,
    heroLabel: post.heroLabel,
    updatedAt: post.publishedAt,
    content: post.content,
    seo: {},
  };
}

function mapStaticPodcastEpisode(slug: string): PublicPodcastEpisode | null {
  const episode = getPodcastEpisode(slug);

  if (!episode) {
    return null;
  }

  return {
    id: `static-${episode.slug}`,
    slug: episode.slug,
    title: episode.title,
    excerpt: episode.excerpt,
    description: episode.description,
    publishedAt: episode.publishedAt,
    duration: episode.duration,
    guests: episode.guests,
    showNotes: episode.showNotes,
    summary: episode.summary,
    updatedAt: episode.publishedAt,
    embedUrl: null,
    audioUrl: null,
    coverImage: null,
    seo: {},
  };
}

function mapStaticCaseStudy(slug: string): PublicCaseStudy | null {
  const item = staticCaseStudies.find((entry) => entry.slug === slug);

  if (!item) {
    return null;
  }

  return {
    id: `static-${item.slug}`,
    slug: item.slug,
    projectName: item.projectName,
    industry: item.industry,
    summary: item.summary,
    customerProblem: item.customerProblem,
    solution: item.solution,
    process: item.process,
    results: item.results,
    techStack: item.techStack,
    featuredImage: null,
    clientName: null,
    updatedAt: new Date().toISOString(),
    cta: {
      label: item.cta.label,
      href: `/case-studies/${item.slug}`,
    },
    seo: {},
  };
}

function mapDbBlogPost(post: DbBlogPost): PublicBlogPost {
  const markdown = extractMarkdown(post.content);
  const sections = markdownToSections(markdown);
  const flatText = sections.flatMap((section) => section.paragraphs).join(" ");

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    description: post.metaDescription || post.excerpt,
    category: post.category,
    tags: post.tags,
    readingTime: readingTimeFromText(flatText || post.excerpt),
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    author: post.author || "VibeDev",
    heroLabel: post.category,
    updatedAt: post.updatedAt.toISOString(),
    content: sections,
    seo: {
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      ogTitle: post.ogTitle,
      ogDescription: post.ogDescription,
      canonicalUrl: post.canonicalUrl,
      noindex: post.noindex,
    },
  };
}

function mapDbPodcastEpisode(episode: DbPodcastEpisode): PublicPodcastEpisode {
  const markdown = extractMarkdown(episode.showNotes);
  const paragraphs = markdownToParagraphs(markdown);

  return {
    id: episode.id,
    slug: episode.slug,
    title: episode.title,
    excerpt: episode.description,
    description: episode.description,
    publishedAt: (episode.publishedAt || episode.createdAt).toISOString(),
    duration: "Podcastavsnitt",
    guests: episode.guestNames.map((name) => ({
      name,
      role: "Gäst",
      bio: "Publicerad via VibeDevs CMS.",
    })),
    showNotes: extractItems(episode.showNotes).length > 0 ? extractItems(episode.showNotes) : paragraphs,
    summary: paragraphs.length > 0 ? paragraphs : [episode.description],
    updatedAt: episode.updatedAt.toISOString(),
    embedUrl: episode.embedUrl,
    audioUrl: episode.audioUrl,
    coverImage: episode.coverImage,
    seo: {
      seoTitle: episode.seoTitle,
      metaDescription: episode.metaDescription,
      ogTitle: episode.ogTitle,
      ogDescription: episode.ogDescription,
      canonicalUrl: episode.canonicalUrl,
      noindex: episode.noindex,
    },
  };
}

function mapDbCaseStudy(item: DbCaseStudy): PublicCaseStudy {
  return {
    id: item.id,
    slug: item.slug,
    projectName: item.title,
    industry: item.industry,
    summary: item.summary,
    customerProblem: item.problem,
    solution: item.solution,
    process: extractItems(item.process),
    results: extractItems(item.results),
    techStack: item.techStack,
    featuredImage: item.featuredImage,
    clientName: item.clientName,
    publishedAt: (item.publishedAt || item.createdAt).toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    cta: {
      label: "Se case study",
      href: `/case-studies/${item.slug}`,
    },
    seo: {
      seoTitle: item.seoTitle,
      metaDescription: item.metaDescription,
      ogTitle: item.ogTitle,
      ogDescription: item.ogDescription,
      canonicalUrl: item.canonicalUrl,
      noindex: item.noindex,
    },
  };
}

function mapDbPage(page: DbPage): PublicPage {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    intro: page.intro || "",
    content: extractMarkdown(page.content),
    updatedAt: page.updatedAt.toISOString(),
    seo: {
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      canonicalUrl: page.canonicalUrl,
      noindex: page.noindex,
    },
  };
}

async function safeDbRead<T>(read: () => Promise<T>) {
  if (!hasDatabaseUrl()) {
    return {
      data: null as T | null,
      error: false,
      enabled: false,
    };
  }

  try {
    return {
      data: await read(),
      error: false,
      enabled: true,
    };
  } catch (error) {
    console.error("[cms-public] Database read failed", error);
    return {
      data: null as T | null,
      error: true,
      enabled: true,
    };
  }
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  const result = await safeDbRead(async () =>
    db.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED, noindex: false },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  );

  if (result.enabled) {
    return (result.data ?? []).map(mapDbBlogPost);
  }

  return [...staticBlogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((post) => mapStaticBlogPost(post.slug))
    .filter((post): post is PublicBlogPost => Boolean(post));
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const result = await safeDbRead(async () =>
    db.blogPost.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        noindex: false,
      },
    }),
  );

  if (result.enabled) {
    return result.data ? mapDbBlogPost(result.data) : null;
  }

  return mapStaticBlogPost(slug);
}

export async function getRelatedPublicBlogPosts(current: PublicBlogPost, limit = 3) {
  const posts = await getPublishedBlogPosts();

  return posts
    .filter((post) => post.slug !== current.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === current.category) + a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bScore = Number(b.category === current.category) + b.tags.filter((tag) => current.tags.includes(tag)).length;

      return bScore - aScore;
    })
    .slice(0, limit);
}

export async function getPublishedPodcastEpisodes(): Promise<PublicPodcastEpisode[]> {
  const result = await safeDbRead(async () =>
    db.podcastEpisode.findMany({
      where: { status: ContentStatus.PUBLISHED, noindex: false },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  );

  if (result.enabled) {
    return (result.data ?? []).map(mapDbPodcastEpisode);
  }

  return [...staticPodcastEpisodes]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((episode) => mapStaticPodcastEpisode(episode.slug))
    .filter((episode): episode is PublicPodcastEpisode => Boolean(episode));
}

export async function getPublishedPodcastEpisodeBySlug(slug: string): Promise<PublicPodcastEpisode | null> {
  const result = await safeDbRead(async () =>
    db.podcastEpisode.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        noindex: false,
      },
    }),
  );

  if (result.enabled) {
    return result.data ? mapDbPodcastEpisode(result.data) : null;
  }

  return mapStaticPodcastEpisode(slug);
}

export async function getRelatedPublicPodcastEpisodes(current: PublicPodcastEpisode, limit = 3) {
  const episodes = await getPublishedPodcastEpisodes();

  return episodes.filter((episode) => episode.slug !== current.slug).slice(0, limit);
}

export async function getPublishedCaseStudies(): Promise<PublicCaseStudy[]> {
  const result = await safeDbRead(async () =>
    db.caseStudy.findMany({
      where: { status: ContentStatus.PUBLISHED, noindex: false },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  );

  if (result.enabled) {
    return (result.data ?? []).map(mapDbCaseStudy);
  }

  return staticCaseStudies.map((item) => mapStaticCaseStudy(item.slug)).filter((item): item is PublicCaseStudy => Boolean(item));
}

export async function getPublishedCaseStudyBySlug(slug: string): Promise<PublicCaseStudy | null> {
  const result = await safeDbRead(async () =>
    db.caseStudy.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        noindex: false,
      },
    }),
  );

  if (result.enabled) {
    return result.data ? mapDbCaseStudy(result.data) : null;
  }

  return mapStaticCaseStudy(slug);
}

export async function getRelatedPublicCaseStudies(current: PublicCaseStudy, limit = 3) {
  const cases = await getPublishedCaseStudies();

  return cases.filter((item) => item.slug !== current.slug).slice(0, limit);
}

function routeToPageCandidates(routePath: string) {
  if (routePath === "/") {
    return ["hem", "start", "/", ""];
  }

  const normalized = routePath.replace(/^\/+|\/+$/g, "");

  return [normalized];
}

export async function getPublishedPageForRoute(routePath: string): Promise<PublicPage | null> {
  const candidates = routeToPageCandidates(routePath);
  const result = await safeDbRead(async () =>
    db.page.findFirst({
      where: {
        slug: { in: candidates },
        status: ContentStatus.PUBLISHED,
        noindex: false,
      },
      orderBy: { createdAt: "asc" },
    }),
  );

  return result.data ? mapDbPage(result.data) : null;
}

export async function getPublishedCustomPages(): Promise<PublicPage[]> {
  const result = await safeDbRead(async () =>
    db.page.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        noindex: false,
      },
      orderBy: { createdAt: "asc" },
    }),
  );

  return (result.data ?? []).map(mapDbPage).filter((page) => !standardPageSlugs.has(page.slug));
}

export async function getPublishedCustomPageBySlug(slug: string): Promise<PublicPage | null> {
  const page = await getPublishedPageForRoute(`/${slug}`);

  if (!page || standardPageSlugs.has(page.slug)) {
    return null;
  }

  return page;
}

export async function createMetadataForContent(input: {
  title: string;
  description?: string | null;
  path: string;
  seo?: SeoFields | null;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}) {
  const settings = await getResolvedSiteSettings();

  return createDynamicMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    settings,
    seo: input.seo,
    keywords: input.keywords,
    type: input.type,
    publishedTime: input.publishedTime,
  });
}

export async function createMetadataForStandardPage(input: {
  routePath: string;
  fallbackTitle: string;
  fallbackDescription: string;
  keywords?: string[];
}) {
  const page = await getPublishedPageForRoute(input.routePath);

  return createMetadataForContent({
    title: page?.title || input.fallbackTitle,
    description: page?.intro || input.fallbackDescription,
    path: input.routePath,
    seo: page?.seo,
    keywords: input.keywords,
    type: "website",
  });
}
