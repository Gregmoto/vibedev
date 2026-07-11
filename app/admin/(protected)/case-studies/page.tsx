import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { LinkButton } from "@/components/ui/button";
import { ContentStatus } from "@prisma/client";
import Link from "next/link";
import {
  deleteCaseStudyAction,
  publishCaseStudyAction,
  unpublishCaseStudyAction,
} from "@/lib/admin-case-study-actions";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  const caseStudies = hasDatabaseUrl()
    ? await db.caseStudy.findMany({
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  return (
    <AdminShell
      title="Case studies"
      description="Hantera affärscase, process, resultat, teknikstack och publicering per projekt."
    >
      <AdminTable
        title="Alla case studies"
        description="Alla case studies i databasen, med status och snabba åtgärder."
        rows={caseStudies}
        rowKey={(row) => row.id}
        actions={<LinkButton href="/admin/case-studies/new" size="sm">Nytt case</LinkButton>}
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga case studies ännu</p>
            <p className="mt-2 text-sm text-muted">Lägg in case för att stärka förtroende, SEO och konvertering på sajten.</p>
            <div className="mt-5">
              <LinkButton href="/admin/case-studies/new" size="sm">
                Skapa första caset
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
                <Link href={`/admin/case-studies/${row.id}`} className="font-medium text-text transition hover:text-brand">
                  {row.title}
                </Link>
                <p className="text-xs text-muted">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "industry",
            header: "Bransch",
            render: (row) => <span className="text-muted">{row.industry}</span>,
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
                <Link href={`/admin/case-studies/${row.id}`} className="button-secondary px-3 py-2 text-xs">
                  Redigera
                </Link>
                {row.status === ContentStatus.DRAFT ? (
                  <form action={publishCaseStudyAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Publicera
                    </button>
                  </form>
                ) : (
                  <form action={unpublishCaseStudyAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="button-secondary px-3 py-2 text-xs">
                      Avpublicera
                    </button>
                  </form>
                )}
                <form action={deleteCaseStudyAction}>
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
