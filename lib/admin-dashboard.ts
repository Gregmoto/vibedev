import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getResolvedSiteSettings } from "@/lib/site-settings";

type ContentSummaryItem = {
  label: string;
  total: number;
  published: number;
  drafts: number;
  href: string;
  createHref: string;
};

type DashboardActivityItem = {
  type: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
  href: string;
};

export type AdminDashboardData = {
  totals: {
    blogPosts: number;
    podcastEpisodes: number;
    caseStudies: number;
    pages: number;
    drafts: number;
    published: number;
  };
  contentSummary: ContentSummaryItem[];
  recentActivity: DashboardActivityItem[];
  settingsOverview: {
    siteName: string;
    siteUrl: string;
    contactEmail: string | null;
    phone: string | null;
    footerText: string | null;
    socialLinksCount: number;
    ga4Enabled: boolean;
    searchConsoleEnabled: boolean;
  };
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const settings = await getResolvedSiteSettings();

  if (!hasDatabaseUrl()) {
    return {
      totals: {
        blogPosts: 0,
        podcastEpisodes: 0,
        caseStudies: 0,
        pages: 0,
        drafts: 0,
        published: 0,
      },
      contentSummary: [
        { label: "Bloggposter", total: 0, published: 0, drafts: 0, href: "/admin/blog", createHref: "/admin/blog/new" },
        { label: "Podcastavsnitt", total: 0, published: 0, drafts: 0, href: "/admin/podcast", createHref: "/admin/podcast/new" },
        { label: "Case studies", total: 0, published: 0, drafts: 0, href: "/admin/case-studies", createHref: "/admin/case-studies/new" },
        { label: "Sidor", total: 0, published: 0, drafts: 0, href: "/admin/pages", createHref: "/admin/pages/new" },
      ],
      recentActivity: [],
      settingsOverview: {
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        contactEmail: settings.contactEmail,
        phone: settings.phone,
        footerText: settings.footerText,
        socialLinksCount: settings.socialLinks.length,
        ga4Enabled: Boolean(settings.ga4MeasurementId || settings.ga4CustomScript),
        searchConsoleEnabled: Boolean(settings.googleSearchConsoleVerification),
      },
    };
  }

  const [
    blogPostsTotal,
    blogPostsPublished,
    podcastEpisodesTotal,
    podcastEpisodesPublished,
    caseStudiesTotal,
    caseStudiesPublished,
    pagesTotal,
    pagesPublished,
    recentBlogPosts,
    recentPodcastEpisodes,
    recentCaseStudies,
    recentPages,
  ] = await Promise.all([
    db.blogPost.count(),
    db.blogPost.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.podcastEpisode.count(),
    db.podcastEpisode.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.caseStudy.count(),
    db.caseStudy.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.page.count(),
    db.page.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.blogPost.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.podcastEpisode.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.caseStudy.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.page.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
  ]);

  const contentSummary: ContentSummaryItem[] = [
    {
      label: "Bloggposter",
      total: blogPostsTotal,
      published: blogPostsPublished,
      drafts: blogPostsTotal - blogPostsPublished,
      href: "/admin/blog",
      createHref: "/admin/blog/new",
    },
    {
      label: "Podcastavsnitt",
      total: podcastEpisodesTotal,
      published: podcastEpisodesPublished,
      drafts: podcastEpisodesTotal - podcastEpisodesPublished,
      href: "/admin/podcast",
      createHref: "/admin/podcast/new",
    },
    {
      label: "Case studies",
      total: caseStudiesTotal,
      published: caseStudiesPublished,
      drafts: caseStudiesTotal - caseStudiesPublished,
      href: "/admin/case-studies",
      createHref: "/admin/case-studies/new",
    },
    {
      label: "Sidor",
      total: pagesTotal,
      published: pagesPublished,
      drafts: pagesTotal - pagesPublished,
      href: "/admin/pages",
      createHref: "/admin/pages/new",
    },
  ];

  const recentActivity = [
    ...recentBlogPosts.map((item) => ({
      type: "Bloggpost",
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt.toISOString(),
      href: `/admin/blog/${item.id}`,
    })),
    ...recentPodcastEpisodes.map((item) => ({
      type: "Podcast",
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt.toISOString(),
      href: `/admin/podcast/${item.id}`,
    })),
    ...recentCaseStudies.map((item) => ({
      type: "Case",
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt.toISOString(),
      href: `/admin/case-studies/${item.id}`,
    })),
    ...recentPages.map((item) => ({
      type: "Sida",
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt.toISOString(),
      href: `/admin/pages/${item.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return {
    totals: {
      blogPosts: blogPostsTotal,
      podcastEpisodes: podcastEpisodesTotal,
      caseStudies: caseStudiesTotal,
      pages: pagesTotal,
      drafts: contentSummary.reduce((sum, item) => sum + item.drafts, 0),
      published: contentSummary.reduce((sum, item) => sum + item.published, 0),
    },
    contentSummary,
    recentActivity,
    settingsOverview: {
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      footerText: settings.footerText,
      socialLinksCount: settings.socialLinks.length,
      ga4Enabled: Boolean(settings.ga4MeasurementId || settings.ga4CustomScript),
      searchConsoleEnabled: Boolean(settings.googleSearchConsoleVerification),
    },
  };
}
