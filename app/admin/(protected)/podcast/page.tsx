import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { LinkButton } from "@/components/ui/button";
import { ContentStatus } from "@prisma/client";
import Link from "next/link";
import {
  deletePodcastEpisodeAction,
  publishPodcastEpisodeAction,
  unpublishPodcastEpisodeAction,
} from "@/lib/admin-podcast-actions";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPodcastPage() {
  const episodes = hasDatabaseUrl()
    ? await db.podcastEpisode.findMany({
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  return (
    <AdminShell
      title="Podcastavsnitt"
      description="Administrera avsnitt, gäster, show notes, embed-länkar och publicering från ett gränssnitt."
    >
      <AdminTable
        title="Alla podcastavsnitt"
        description="Alla podcastavsnitt i databasen, med status och snabba åtgärder."
        rows={episodes}
        rowKey={(row) => row.id}
        actions={<LinkButton href="/admin/podcast/new" size="sm">Nytt avsnitt</LinkButton>}
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga podcastavsnitt ännu</p>
            <p className="mt-2 text-sm text-muted">Skapa första avsnittet för att fylla podcastsidan och bygga återkommande innehåll.</p>
            <div className="mt-5">
              <LinkButton href="/admin/podcast/new" size="sm">
                Skapa första avsnittet
              </LinkButton>
            </div>
          </div>
        }
        columns={[
          {
            key: "title",
            header: "Titel",
            render: (row) => (
              <div className="space-y-1">
                <Link href={`/admin/podcast/${row.id}`} className="font-medium text-text transition hover:text-brand">
                  {row.title}
                </Link>
                <p className="text-xs text-muted">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "guests",
            header: "Gäster",
            render: (row) => <span className="text-muted">{row.guestNames.length ? row.guestNames.join(", ") : "Inga gäster"}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <AdminStatusBadge status={row.status as "DRAFT" | "PUBLISHED"} />,
          },
          {
            key: "publishedAt",
            header: "Publicerad",
            render: (row) => (
              <span className="text-muted">
                {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString("sv-SE") : "Inte publicerad"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Åtgärder",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/podcast/${row.id}`} className="button-secondary px-3 py-2 text-xs">
                  Redigera
                </Link>
                {row.status === ContentStatus.DRAFT ? (
                  <form action={publishPodcastEpisodeAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Publicera
                    </button>
                  </form>
                ) : (
                  <form action={unpublishPodcastEpisodeAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Avpublicera
                    </button>
                  </form>
                )}
                <form action={deletePodcastEpisodeAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="button-secondary px-3 py-2 text-xs text-warning">
                    Ta bort
                  </button>
                </form>
              </div>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
