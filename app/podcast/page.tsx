import type { Metadata } from "next";
import Link from "next/link";
import { PodcastCard } from "@/components/cards/podcast-card";
import { NewsletterSignup } from "@/components/conversion/newsletter-signup";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadataForStandardPage, getPublishedPodcastEpisodes } from "@/lib/cms-public";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadataForStandardPage({
    routePath: "/podcast",
    fallbackTitle: "Vibecoding-podden — Samtal om AI, produktutveckling och vibecoding | VibeDev",
    fallbackDescription:
      "Samtal om hur moderna team bygger digitala produkter med AI, struktur och seniort hantverk. Korta avsnitt, raka åsikter, inga säljpitchar.",
    keywords: ["vibecoding podcast", "ai podcast svenska", "produktutveckling podcast", "startup podcast", "vibecoding"],
  });
}

/* ── Platform icons ──────────────────────────────────────────────────────────── */

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function AcastIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.994 0C5.367 0 0 5.367 0 11.994 0 18.629 5.367 24 11.994 24 18.629 24 24 18.629 24 11.994 24 5.367 18.629 0 11.994 0zm-.245 4.558c.27 0 .495.086.673.26.178.171.267.39.267.66v5.556c.327-.135.676-.202 1.048-.202.76 0 1.406.268 1.938.803.532.535.8 1.18.8 1.94 0 .76-.268 1.407-.8 1.942-.532.534-1.178.8-1.938.8a2.66 2.66 0 01-1.94-.8c-.534-.535-.802-1.181-.802-1.942V5.478c0-.27.09-.489.268-.66a.92.92 0 01.486-.26zm.979 9.018c-.328 0-.607.116-.836.347a1.14 1.14 0 00-.347.837c0 .328.116.607.347.837.23.23.508.346.836.346.328 0 .607-.115.837-.346.23-.23.346-.509.346-.837 0-.328-.115-.607-.346-.837-.23-.23-.51-.347-.837-.347z" />
    </svg>
  );
}

/* ── Platform badge ──────────────────────────────────────────────────────────── */

type Platform = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  text: string;
  label: string;
};

const PLATFORMS: Platform[] = [
  {
    name: "Spotify",
    href: "https://open.spotify.com/show/vibedev",
    icon: SpotifyIcon,
    bg: "bg-[#1DB954]/10 hover:bg-[#1DB954]/20",
    text: "text-[#1DB954]",
    label: "Lyssna på Spotify",
  },
  {
    name: "Apple Podcasts",
    href: "https://podcasts.apple.com/se/podcast/vibedev",
    icon: AppleIcon,
    bg: "bg-[#872EC4]/10 hover:bg-[#872EC4]/20",
    text: "text-[#872EC4]",
    label: "Lyssna på Apple Podcasts",
  },
  {
    name: "Acast",
    href: "https://acast.com/vibedev",
    icon: AcastIcon,
    bg: "bg-[#F55B23]/10 hover:bg-[#F55B23]/20",
    text: "text-[#F55B23]",
    label: "Lyssna på Acast",
  },
];

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default async function PodcastPage() {
  const episodes   = await getPublishedPodcastEpisodes();
  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem",     url: siteConfig.url },
    { name: "Podcast", url: `${siteConfig.url}/podcast` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-gradient-to-b from-bg to-[#EFF6FF] px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">PODCAST</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Vibecoding-podden
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Samtal om hur moderna team bygger digitala produkter med AI, struktur och seniort hantverk. Korta avsnitt, raka åsikter, inga säljpitchar.
          </p>

          {/* Platform links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.label}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${platform.bg} ${platform.text}`}
              >
                <platform.icon className="h-4 w-4" />
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Episodes ──────────────────────────────────────────────────────────── */}
      <Section size="tight">
        <SectionHeading
          eyebrow="SENASTE AVSNITTEN"
          title="Raka samtal om vibecoding, AI och produktbygge."
          description="Varje avsnitt är under 45 minuter. Vi pratar om verkliga projekt, konkreta beslut och vad som faktiskt fungerar — och vad som inte gör det."
          className="mb-10"
        />

        {episodes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {episodes.map((episode) => (
              <PodcastCard key={episode.slug} episode={episode} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-bg py-20 text-center">
            <p className="text-sm font-semibold text-text">Första avsnittet kommer snart</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Prenumerera på nyhetsbrevet så får du ett mejl direkt när vi släpper.
            </p>
          </div>
        )}
      </Section>

      {/* ── Upcoming (planned stubs teaser) ───────────────────────────────────── */}
      <Section size="tight">
        <div className="rounded-2xl border border-line bg-bg p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="lg:w-72 lg:shrink-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">KOMMANDE AVSNITT</p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text">
                Det här pratar vi om härnäst.
              </h2>
              <p className="mt-2 text-sm text-muted">
                Prenumerera så missar du inget. Vi skickar ett mejl när nytt avsnitt släpps.
              </p>
            </div>
            <div className="flex-1">
              <ol className="space-y-4">
                {[
                  "Vad är vibecoding egentligen? — En introduktion",
                  "Cursor vs Claude Code vs Copilot — så väljer vi 2026",
                  "Bygga MVP på 8 veckor — vår process",
                  "AI i kundsupport — när det fungerar",
                  "Hur vi tänker scope: 80/20-regeln för MVP:er",
                ].map((title, i) => (
                  <li key={title} className="flex items-center gap-3 text-sm text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-muted/60">
                      {i + 1}
                    </span>
                    {title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────────── */}
      <Section>
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-[#EFF6FF] p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">PRENUMERERA</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text">
              Få varje nytt avsnitt direkt i inboxen.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Plus bonus-resurser, lästips och extra material som inte finns i avsnitten. Avregistrera när du vill — ett klick.
            </p>
            <div className="mx-auto mt-6 max-w-sm">
              <NewsletterSignup source="podcast-newsletter" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── End CTA ───────────────────────────────────────────────────────────── */}
      <Section size="tight">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-bg p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-text">Vill ni diskutera ert projekt?</p>
            <p className="mt-1 text-sm text-muted">
              Om ett avsnitt väcker frågor om er produkt, AI-satsning eller MVP-process är vi bara ett samtal bort.
            </p>
          </div>
          <Link
            href="/boka-mote"
            className="inline-flex h-11 shrink-0 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Boka 30 min →
          </Link>
        </div>
      </Section>
    </>
  );
}
