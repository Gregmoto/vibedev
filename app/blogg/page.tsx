import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/cards/blog-card";
import { NewsletterSignup } from "@/components/conversion/newsletter-signup";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage, getPublishedBlogPosts } from "@/lib/cms-public";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/blogg",
    fallbackTitle: "Blogg — Vibecoding, AI och modern produktutveckling | VibeDev",
    fallbackDescription:
      "Vi skriver om hur vi bygger — verktyg, processer, misstag och vinster. Inget marketing-snack, bara erfarenhet.",
    keywords: ["vibecoding", "ai produktutveckling", "mvp blogg", "digital produktutveckling", "apputveckling artiklar"],
  });
}

/* ── Category config ─────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { label: "Alla",              slug: null },
  { label: "Vibecoding",        slug: "vibecoding" },
  { label: "AI i produkter",    slug: "ai-i-produkter" },
  { label: "MVP-utveckling",    slug: "mvp-utveckling" },
  { label: "Tekniska val",      slug: "tekniska-val" },
  { label: "Produktstrategi",   slug: "produktstrategi" },
];

/* Map from URL slug to possible category values in blog data */
const CATEGORY_MAP: Record<string, string[]> = {
  "vibecoding":     ["Vibecoding"],
  "ai-i-produkter": ["AI", "AI i produkter"],
  "mvp-utveckling": ["MVP", "MVP-utveckling"],
  "tekniska-val":   ["Produktval", "Tekniska val"],
  "produktstrategi":["Produktstrategi"],
};

/* ── Page ────────────────────────────────────────────────────────────────────── */

type BlogPageProps = {
  searchParams: Promise<{ kategori?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { kategori } = await searchParams;

  const allPosts   = await getPublishedBlogPosts();
  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",   url: siteConfig.url },
    { name: "Blogg", url: `${siteConfig.url}/blogg` },
  ]);

  /* Filter posts by category if query param present */
  const matchCategories = kategori ? (CATEGORY_MAP[kategori] ?? [kategori]) : null;
  const posts = matchCategories
    ? allPosts.filter((p) => matchCategories.includes(p.category))
    : allPosts;

  const activeCategory = CATEGORIES.find((c) => c.slug === (kategori ?? null));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-gradient-to-b from-bg to-[#EFF6FF] px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">BLOGG</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Vibecoding, AI och modern produktutveckling.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Vi skriver om hur vi bygger — verktyg, processer, misstag och vinster. Inget marketing-snack, bara erfarenhet.
          </p>
        </div>
      </div>

      {/* ── Category filter ───────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-bg">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <div className="flex min-w-max gap-1 py-3">
            {CATEGORIES.map((cat) => {
              const isActive = (kategori ?? null) === cat.slug;
              const href     = cat.slug ? `/blogg?kategori=${cat.slug}` : "/blogg";
              return (
                <Link
                  key={cat.label}
                  href={href}
                  className={[
                    "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-brand text-bg shadow-sm"
                      : "text-muted hover:bg-line/50 hover:text-text",
                  ].join(" ")}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Article grid ──────────────────────────────────────────────────────── */}
      <Section size="tight">
        {activeCategory && activeCategory.slug && (
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm font-semibold text-text">
              {posts.length} {posts.length === 1 ? "artikel" : "artiklar"} i kategorin
            </span>
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {activeCategory.label}
            </span>
            <Link href="/blogg" className="ml-auto text-xs text-muted hover:text-text">
              Rensa filter →
            </Link>
          </div>
        )}

        {!activeCategory?.slug && (
          <SectionHeading
            eyebrow="SENASTE ARTIKLAR"
            title="Kunskap du kan använda direkt."
            description="Alla artiklar är skrivna av oss som faktiskt bygger produkter — baserade på verkliga projekt, inte teori."
            className="mb-10"
          />
        )}

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line py-20 text-center">
            <p className="text-sm font-semibold text-text">Inga artiklar i den kategorin än</p>
            <p className="mt-2 text-sm text-muted">
              Prenumerera på nyhetsbrevet så hör du av oss när vi publicerar.
            </p>
            <Link href="/blogg" className="mt-4 inline-flex text-sm font-medium text-brand hover:underline">
              Visa alla artiklar
            </Link>
          </div>
        )}
      </Section>

      {/* ── Pillar pages highlight ────────────────────────────────────────────── */}
      {!kategori && (
        <Section size="tight">
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">GUIDER</p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text">
              Djupgående guider för team som bygger
            </h2>
            <p className="mt-1 text-sm text-muted">
              Längre, mer utförliga resurser som täcker ämnen från grunden.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: "/vibecoding",
                  title: "Vibecoding: komplett guide 2026",
                  desc: "Vad vibecoding är, verktygen, arbetsflödena, misstagen och framtiden. Ca 15 min läsning.",
                  label: "~15 min",
                },
                {
                  href: "/blogg/ai-i-din-produkt",
                  title: "AI i din digitala produkt",
                  desc: "Beslutsmodell, use cases, demoeffekten och tekniska val. Ca 12 min läsning.",
                  label: "~12 min",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-xl border border-line bg-bg p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">{item.label}</span>
                    <span className="text-xs font-medium text-brand opacity-0 transition group-hover:opacity-100">
                      Läs →
                    </span>
                  </div>
                  <p className="mt-2 font-display text-base font-bold text-text">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── Newsletter CTA ────────────────────────────────────────────────────── */}
      <Section>
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-line bg-bg p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">NYHETSBREV</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text">
              Nya guider direkt i inboxen.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Ungefär en gång i månaden — alltid med en konkret guide eller insikt, aldrig säljpitchar.
            </p>
            <div className="mx-auto mt-6 max-w-sm">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
