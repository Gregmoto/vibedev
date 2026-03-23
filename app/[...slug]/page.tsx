import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { createMetadataForContent, getPublishedCustomPageBySlug, getPublishedCustomPages } from "@/lib/cms-public";

type CmsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const pages = await getPublishedCustomPages();

  return pages.map((page) => ({
    slug: page.slug.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const slugParts = (await params).slug;
  const slug = slugParts.join("/");
  const page = await getPublishedCustomPageBySlug(slug);

  if (!page) {
    return createMetadataForContent({
      title: "Sida",
      description: "Sidan kunde inte hittas.",
      path: `/${slug}`,
    });
  }

  return createMetadataForContent({
    title: page.title,
    description: page.intro || page.title,
    path: `/${slug}`,
    seo: page.seo,
  });
}

export default async function CmsPage({ params }: CmsPageProps) {
  const slugParts = (await params).slug;
  const slug = slugParts.join("/");
  const page = await getPublishedCustomPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageHeader eyebrow="Sida" title={page.title} description={page.intro || "Innehåll publicerat från VibeDevs CMS."} />
      <Section size="tight">
        <article className="surface max-w-4xl p-6 sm:p-10">
          <MarkdownContent content={page.content} />
        </article>
      </Section>
    </>
  );
}
