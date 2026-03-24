import type { Metadata } from "next";
import { BlogCard } from "@/components/cards/blog-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { PatternGrid } from "@/components/ui/pattern-grid";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage, getPublishedBlogPosts } from "@/lib/cms-public";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/blogg",
    fallbackTitle: "Blogg",
    fallbackDescription: "Artiklar om apputveckling, MVP, AI och modern produktutveckling.",
    keywords: ["blogg", "apputveckling", "mvp", "ai", "vibecoding"],
  });
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();

  return (
    <>
      <PageHeader
        eyebrow="Blogg"
        title="Artiklar för team som bygger appar, webbappar och AI-produkter."
        description="Kunskap, perspektiv och konkreta guider för företag som vill fatta bättre beslut kring teknik, produkt och tillväxt."
      />

      <Section size="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-elevated p-6 sm:p-8">
            <SectionHeading
              eyebrow="Bloggöversikt"
              title="SEO-stark innehållshubb för frågor som era kunder faktiskt söker på."
              description="Här samlar vi guider och perspektiv kring apputveckling, MVP, AI, vibecoding och produktbeslut."
            />
            <div className="mt-8">
              <Input
                name="blog-search"
                type="search"
                label="Sök i bloggen"
                placeholder="Sök på app, MVP, AI eller strategi"
                hint="UI för sökfält. Söket kopplas till riktig filtrering i nästa steg om du vill."
              />
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Kategorier</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Badge key={category} tone="neutral">
                  {category}
                </Badge>
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-text">Populära taggar</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Senaste artiklar"
          title="Bygg bättre beslutsunderlag med innehåll som är skrivet för verkliga produktteam."
          description="Alla artiklar är skrivna för founders, produktägare och marknadschefer som vill förstå vad som faktiskt krävs för att bygga rätt digital produkt."
        />
        <PatternGrid className="mt-10" columns="3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </PatternGrid>
      </Section>
    </>
  );
}
