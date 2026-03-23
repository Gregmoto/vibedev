import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { LinkButton } from "@/components/ui/button";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { deletePageAction, publishPageAction, unpublishPageAction } from "@/lib/admin-page-actions";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const pages = hasDatabaseUrl()
    ? await db.page.findMany({
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  return (
    <AdminShell
      title="Sidor"
      description="Hantera enklare statiska sidor och innehållssektioner från ett enkelt men skalbart page editor-flöde."
    >
      <AdminTable
        title="Alla sidor"
        description="Alla sidor i databasen, med status och snabba åtgärder."
        rows={pages}
        rowKey={(row) => row.id}
        actions={
          <LinkButton href="/admin/pages/new" size="sm">
            Ny sida
          </LinkButton>
        }
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga CMS-sidor ännu</p>
            <p className="mt-2 text-sm text-muted">Skapa en publicerad sida för att få en ny route direkt i frontend och sitemap.</p>
            <div className="mt-5">
              <LinkButton href="/admin/pages/new" size="sm">
                Skapa första sidan
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
                <Link href={`/admin/pages/${row.id}`} className="font-medium text-text transition hover:text-brand">
                  {row.title}
                </Link>
                <p className="text-xs text-muted">{row.slug}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <AdminStatusBadge status={row.status as "DRAFT" | "PUBLISHED"} />,
          },
          {
            key: "updatedAt",
            header: "Uppdaterad",
            render: (row) => <span className="text-muted">{new Date(row.updatedAt).toLocaleDateString("sv-SE")}</span>,
          },
          {
            key: "actions",
            header: "Åtgärder",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/pages/${row.id}`} className="button-secondary px-3 py-2 text-xs">
                  Redigera
                </Link>
                {row.status === ContentStatus.DRAFT ? (
                  <form action={publishPageAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Publicera
                    </button>
                  </form>
                ) : (
                  <form action={unpublishPageAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Avpublicera
                    </button>
                  </form>
                )}
                <form action={deletePageAction}>
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
