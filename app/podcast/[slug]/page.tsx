import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PodcastCard } from "@/components/cards/podcast-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Section } from "@/components/ui/section";
import {
  createMetadataForContent,
  getPublishedPodcastEpisodeBySlug,
  getPublishedPodcastEpisodes,
  getRelatedPublicPodcastEpisodes,
} from "@/lib/cms-public";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { podcastEpisodeSchema } from "@/lib/schema";

type PodcastEpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const episodes = await getPublishedPodcastEpisodes();

  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: PodcastEpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getPublishedPodcastEpisodeBySlug(slug);

  if (!episode) {
    return createMetadataForContent({
      title: "Podcastavsnitt",
      description: "Avsnittet kunde inte hittas.",
      path: `/podcast/${slug}`,
      type: "article",
    });
  }

  return createMetadataForContent({
    title: episode.title,
    description: episode.description,
    path: `/podcast/${slug}`,
    seo: episode.seo,
    publishedTime: episode.publishedAt,
    keywords: episode.guests.map((guest) => guest.name),
    type: "article",
  });
}

export default async function PodcastEpisodePage({ params }: PodcastEpisodePageProps) {
  const { slug } = await params;
  const [episode, settings] = await Promise.all([getPublishedPodcastEpisodeBySlug(slug), getResolvedSiteSettings()]);

  if (!episode) {
    notFound();
  }

  const relatedEpisodes = await getRelatedPublicPodcastEpisodes(episode);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            podcastEpisodeSchema({
              title: episode.title,
              description: episode.description,
              path: `/podcast/${episode.slug}`,
              publishedAt: episode.publishedAt,
              duration: episode.duration,
              siteName: settings.siteName,
              siteUrl: settings.siteUrl,
            }),
          ),
        }}
      />
      <Section size="hero" className="page-hero">
        <div className="surface-elevated max-w-4xl px-6 py-12 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="brand">Podcast</Badge>
            <span className="text-sm text-muted">{episode.duration}</span>
            <span className="text-sm text-muted">{new Date(episode.publishedAt).toLocaleDateString("sv-SE")}</span>
          </div>
          <h1 className="heading-xl mt-6 max-w-4xl text-balance">{episode.title}</h1>
          <p className="body-lg mt-5 max-w-3xl">{episode.excerpt}</p>
        </div>
      </Section>

      <Section size="tight" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Lyssna</p>
            <div className="mt-5 rounded-3xl border border-dashed border-lineStrong bg-white/[0.03] p-8">
              {episode.embedUrl ? (
                <div className="space-y-4">
                  <p className="font-semibold text-text">Inbäddad spelare</p>
                  <iframe
                    src={episode.embedUrl}
                    title={episode.title}
                    className="h-40 w-full rounded-2xl border border-white/10 bg-black/20"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-bg">
                    <span className="text-lg font-semibold">▶</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text">Embedded spelare</p>
                    <p className="text-sm text-muted">
                      Placeholder för Spotify, Apple Podcasts eller annan extern spelare.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <article className="surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Sammanfattning</p>
            <div className="mt-5 space-y-4">
              {episode.summary.map((paragraph) => (
                <p key={paragraph} className="body-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Show notes</p>
            <div className="mt-5 space-y-4">
              {episode.showNotes.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-sm font-semibold text-brand">
                    {index + 1}
                  </span>
                  <p className="body-md">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Card variant="outlined" className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Gäster</p>
            <div className="mt-5 space-y-5">
              {episode.guests.map((guest) => (
                <div key={guest.name} className="space-y-2">
                  <p className="font-semibold text-text">{guest.name}</p>
                  <p className="text-sm text-brand">{guest.role}</p>
                  <p className="text-sm leading-7 text-muted">{guest.bio}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Vill ni diskutera ert projekt?</p>
            <p className="body-md mt-4">
              Om avsnittet väcker frågor kring er produkt, AI-satsning eller nästa release hjälper vi gärna er att reda ut nästa steg.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <LinkButton href="/tjanster" variant="secondary">
                Se våra tjänster
              </LinkButton>
              <LinkButton href="/kontakt">Kontakta oss</LinkButton>
              <LinkButton href="/boka-mote" variant="secondary">
                Be om offert
              </LinkButton>
            </div>
          </Card>
        </aside>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fler avsnitt</p>
            <h2 className="heading-lg mt-4">Relaterade avsnitt</h2>
          </div>
          <Link href="/podcast" className="text-sm font-medium text-brand transition hover:text-text">
            Till podcastöversikten
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedEpisodes.map((relatedEpisode) => (
            <PodcastCard key={relatedEpisode.slug} episode={relatedEpisode} />
          ))}
        </div>
      </Section>

      <Section>
        <CtaPanel
          eyebrow="Bygg något bättre"
          title="Om ni vill omsätta idéer till en tydligare produktstrategi hjälper vi gärna till."
          description="VibeDev kombinerar strategi, design och utveckling för bolag som vill bygga appar, webbappar och AI-lösningar med mer precision."
          actions={
            <>
              <LinkButton href="/boka-mote">Boka möte</LinkButton>
              <LinkButton href="/case-studies" variant="secondary">
                Se case studies
              </LinkButton>
            </>
          }
        />
      </Section>
    </>
  );
}
