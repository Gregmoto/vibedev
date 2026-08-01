import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PodcastEpisodeForm } from "@/components/admin/podcast-episode-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type AdminEditPodcastEpisodePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPodcastEpisodePage({ params }: AdminEditPodcastEpisodePageProps) {
  const { id } = await params;
  const episode = await db.podcastEpisode.findUnique({
    where: { id },
  });

  if (!episode) {
    notFound();
  }

  return (
    <AdminShell
      title="Redigera podcastavsnitt"
      description="Uppdatera innehåll, show notes, publicering och SEO för det valda avsnittet."
    >
      <PodcastEpisodeForm episode={episode} />
    </AdminShell>
  );
}
