import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PodcastEpisode } from "@/content/podcast";

type PodcastCardProps = {
  episode: PodcastEpisode;
};

export function PodcastCard({ episode }: PodcastCardProps) {
  return (
    <Card className="h-full p-7">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="brand">Podcast</Badge>
        <span className="text-xs uppercase tracking-[0.18em] text-muted">{episode.duration}</span>
      </div>
      <h3 className="heading-md mt-5 text-2xl">
        <Link href={`/podcast/${episode.slug}`} className="transition hover:text-brand">
          {episode.title}
        </Link>
      </h3>
      <p className="body-md mt-3">{episode.excerpt}</p>
      <div className="mt-5 text-sm text-muted">
        {new Date(episode.publishedAt).toLocaleDateString("sv-SE")}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {episode.guests.map((guest) => (
          <span key={guest.name} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
            {guest.name}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <Link href={`/podcast/${episode.slug}`} className="text-sm font-medium text-brand transition hover:text-text">
          Visa avsnitt
        </Link>
      </div>
    </Card>
  );
}
