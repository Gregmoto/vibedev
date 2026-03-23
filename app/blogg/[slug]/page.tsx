import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/metadata";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  return createMetadata("Bloggartikel", `Artikelmall för ${slug}.`, `/blogg/${slug}`);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;

  return (
    <Section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Bloggartikel</h1>
      <p className="mt-4 max-w-2xl text-muted">Dynamisk artikelmall för slug: {slug}</p>
    </Section>
  );
}
