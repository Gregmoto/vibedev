import { AdminShell } from "@/components/admin/admin-shell";
import { PodcastEpisodeForm } from "@/components/admin/podcast-episode-form";

export const dynamic = "force-dynamic";

export default function AdminNewPodcastEpisodePage() {
  return (
    <AdminShell
      title="Nytt podcastavsnitt"
      description="Skapa ett nytt podcastavsnitt och fyll i innehåll, publicering och SEO i samma formulär."
    >
      <PodcastEpisodeForm />
    </AdminShell>
  );
}
