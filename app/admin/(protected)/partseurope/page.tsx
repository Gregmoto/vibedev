import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PartsEuropeCredentialsForm } from "@/components/admin/partseurope-credentials-form";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { PartsEuropeRunButton } from "@/components/admin/partseurope-run-button";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { CopyLinkButton } from "@/components/admin/copy-link-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export default async function AdminPartsEuropePage() {
  // Bara användarnamnet läses ut. Det krypterade lösenordet lämnar aldrig
  // servern — det finns ingen väg att visa det igen, bara att ersätta det.
  const credential = hasDatabaseUrl()
    ? await db.integrationCredential.findUnique({
        where: { provider: "partseurope" },
        select: { username: true, updatedAt: true },
      })
    : null;

  const runs = hasDatabaseUrl()
    ? await db.bihrRun.findMany({
        where: { kind: "partseurope" },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  return (
    <AdminShell
      title="Parts Europe"
      description="Hämtar prisfilen en gång per dygn och lägger den på en fast länk som fungerar utan inloggning."
    >
      <PartsEuropeCredentialsForm
        savedUsername={credential?.username}
        savedAt={credential ? formatDateTime(credential.updatedAt) : undefined}
      />

      <section className="surface p-6">
        <h2 className="text-sm font-semibold text-text">Fast länk</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a href="/partseurope.csv" className="text-sm text-brand transition hover:underline">
            /partseurope.csv
          </a>
          <CopyLinkButton path="/partseurope.csv" />
        </div>
        <p className="mt-2 text-sm text-muted">
          Fungerar utan inloggning och ersätts vid varje hämtning. Adressen är alltid densamma.
        </p>
        <div className="mt-5">
          <PartsEuropeRunButton />
        </div>
      </section>

      <AdminTable
        title="Senaste hämtningar"
        description="De tio senaste körningarna."
        rows={runs}
        rowKey={(row) => row.id}
        dense
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga hämtningar än</p>
          </div>
        }
        columns={[
          {
            key: "when",
            header: "Tidpunkt",
            className: "w-[26%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {formatDateTime(row.createdAt)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            className: "w-[18%]",
            render: (row) =>
              row.success ? <Badge tone="success">Lyckades</Badge> : <Badge tone="neutral">Fel</Badge>,
          },
          {
            key: "size",
            header: "Storlek",
            className: "w-[16%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {(row.bytes / 1024 / 1024).toFixed(1)} MB
              </span>
            ),
          },
          {
            key: "time",
            header: "Tid",
            className: "w-[12%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {(row.durationMs / 1000).toFixed(1)} s
              </span>
            ),
          },
          {
            key: "error",
            header: "Fel",
            className: "w-[28%]",
            render: (row) =>
              row.error ? (
                <span className="block truncate text-xs text-warning" title={row.error}>
                  {row.error}
                </span>
              ) : (
                <span className="text-xs text-muted">—</span>
              ),
          },
        ]}
      />

      <section className="surface p-6">
        <h2 className="text-sm font-semibold text-text">Status</h2>
        {credential ? (
          <p className="mt-2 text-sm text-muted">
            Uppgifter sparade för <span className="text-text">{credential.username}</span>. Själva
            hämtningen körs automatiskt 04:10 varje dygn.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Inga uppgifter sparade än. Fyll i formuläret ovan för att komma igång.
          </p>
        )}
      </section>
    </AdminShell>
  );
}
