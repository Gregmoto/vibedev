import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogCard } from "@/components/cards/blog-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Section } from "@/components/ui/section";
import {
  createMetadataForContent,
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  getRelatedPublicBlogPosts,
} from "@/lib/cms-public";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { articleSchema } from "@/lib/schema";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return createMetadataForContent({
      title: "Bloggartikel",
      description: "Artikeln kunde inte hittas.",
      path: `/blogg/${slug}`,
      type: "article",
    });
  }

  return createMetadataForContent({
    title: post.title,
    description: post.description,
    path: `/blogg/${slug}`,
    seo: post.seo,
    publishedTime: post.publishedAt,
    keywords: post.tags,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPublishedBlogPostBySlug(slug), getResolvedSiteSettings()]);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPublicBlogPosts(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: post.title,
              description: post.description,
              path: `/blogg/${post.slug}`,
              publishedAt: post.publishedAt,
              keywords: post.tags,
              siteName: settings.siteName,
              siteUrl: settings.siteUrl,
            }),
          ),
        }}
      />
      <Section size="hero" className="page-hero">
        <div className="surface-elevated max-w-4xl px-6 py-12 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">{post.category}</Badge>
            <span className="text-sm text-muted">{post.heroLabel}</span>
            <span className="text-sm text-muted">{post.readingTime}</span>
          </div>
          <h1 className="heading-xl mt-6 max-w-4xl text-balance">{post.title}</h1>
          <p className="body-lg mt-5 max-w-3xl">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
            <span>{new Date(post.publishedAt).toLocaleDateString("sv-SE")}</span>
            <span>{post.author}</span>
          </div>
        </div>
      </Section>

      <Section size="tight" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="surface p-6 sm:p-10">
          <div className="space-y-10">
            {post.content.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="heading-md text-3xl">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="body-lg max-w-none">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Taggar</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <Card variant="outlined" className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Snabb överblick</p>
            <div className="mt-5 space-y-3 text-sm text-muted">
              <p>Kategori: {post.category}</p>
              <p>Lästid: {post.readingTime}</p>
              <p>Publicerad: {new Date(post.publishedAt).toLocaleDateString("sv-SE")}</p>
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Behöver ni hjälp med detta?</p>
            <p className="body-md mt-4">
              Vi hjälper företag att omsätta strategi och innehåll till konkreta produktbeslut, design och utveckling.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <LinkButton href="/tjanster" variant="secondary">
                Se relaterade tjänster
              </LinkButton>
              <LinkButton href="/boka-mote">Boka möte</LinkButton>
              <LinkButton href="/kontakt" variant="secondary">
                Kontakta oss
              </LinkButton>
            </div>
          </Card>
        </aside>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Nästa steg"
          title="Vill ni bygga en digital produkt med tydligare riktning, bättre scope och starkare teknisk grund."
          description="VibeDev hjälper team att gå från idé och innehåll till konkret produktstrategi, design och utveckling."
          actions={
            <>
              <LinkButton href="/boka-mote" size="lg">
                Boka möte
              </LinkButton>
              <LinkButton href="/tjanster" variant="secondary" size="lg">
                Se våra tjänster
              </LinkButton>
            </>
          }
        />
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Relaterade artiklar</p>
            <h2 className="heading-lg mt-4">Läs vidare</h2>
          </div>
          <Link href="/blogg" className="text-sm font-medium text-brand transition hover:text-text">
            Till bloggöversikten
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
      </Section>
    </>
  );
}
