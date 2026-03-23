import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { LinkButton } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { deleteBlogPostAction, publishBlogPostAction, unpublishBlogPostAction } from "@/lib/admin-blog-actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = hasDatabaseUrl()
    ? await db.blogPost.findMany({
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  return (
    <AdminShell
      title="Bloggposter"
      description="Lista, skapa, redigera, publicera och avpublicera blogginlägg från ett enkelt adminflöde."
    >
      <AdminTable
        title="Alla bloggposter"
        description="Alla blogginlägg i databasen, med status och snabba åtgärder."
        rows={posts}
        rowKey={(row) => row.id}
        actions={
          <LinkButton href="/admin/blog/new" size="sm">
            Ny bloggpost
          </LinkButton>
        }
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga bloggposter ännu</p>
            <p className="mt-2 text-sm text-muted">Skapa ert första blogginlägg för att börja bygga trafik och SEO.</p>
            <div className="mt-5">
              <LinkButton href="/admin/blog/new" size="sm">
                Skapa första bloggposten
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
                <Link href={`/admin/blog/${row.id}`} className="font-medium text-text transition hover:text-brand">
                  {row.title}
                </Link>
                <p className="text-xs text-muted">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "category",
            header: "Kategori",
            render: (row) => <span className="text-muted">{row.category}</span>,
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
                <Link href={`/admin/blog/${row.id}`} className="button-secondary px-3 py-2 text-xs">
                  Redigera
                </Link>
                {row.status === ContentStatus.DRAFT ? (
                  <form action={publishBlogPostAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Publicera
                    </button>
                  </form>
                ) : (
                  <form action={unpublishBlogPostAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Avpublicera
                    </button>
                  </form>
                )}
                <form action={deleteBlogPostAction}>
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
