import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { CsvUploadForm } from "@/components/admin/csv-upload-form";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { deleteCsvAction } from "@/lib/admin-csv-actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export default async function AdminCsvPage() {
  const files = hasDatabaseUrl()
    ? await db.csvFile.findMany({ orderBy: { updatedAt: "desc" } })
    : [];

  return (
    <AdminShell
      title="CSV-fil"
      description="Ladda upp en fil och få en fast länk. Byter du ut filen behåller länken sin adress, så mottagaren behöver aldrig uppdatera något."
    >
      <section className="surface-elevated p-6">
        <h2 className="text-sm font-semibold text-text">Ladda upp ny fil</h2>
        <p className="mt-2 text-sm text-muted">
          Högst 60 MB. Adressen skapas av filnamnet — &quot;Prislista 2026.csv&quot; blir
          /api/csv/prislista-2026.
        </p>
        <div className="mt-5">
          <CsvUploadForm />
        </div>
      </section>

      {files.length === 0 ? (
        <section className="surface p-6">
          <p className="text-sm text-muted">
            Inga filer uppladdade än. Filen du laddar upp får en länk du kan använda direkt.
          </p>
        </section>
      ) : (
        files.map((file) => {
          const path = `/api/csv/${file.slug}`;

          return (
            <section key={file.id} className="surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-text">{file.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <a
                      href={path}
                      className="truncate text-sm text-brand transition hover:underline"
                    >
                      {path}
                    </a>
                    <CopyLinkButton path={path} />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {formatBytes(file.sizeBytes)} · uppdaterad {formatDateTime(file.updatedAt)} ·{" "}
                    {file.versions === 1 ? "originalversion" : `version ${file.versions}`}
                  </p>
                </div>

                <form action={deleteCsvAction}>
                  <input type="hidden" name="id" value={file.id} />
                  <ConfirmSubmitButton
                    plain
                    message={`Ta bort ${file.name}? Länken ${path} slutar fungera för alla som använder den.`}
                  >
                    Ta bort
                  </ConfirmSubmitButton>
                </form>
              </div>

              <div className="mt-5 border-t border-white/5 pt-5">
                <CsvUploadForm replaceId={file.id} replaceName={file.name} />
              </div>
            </section>
          );
        })
      )}
    </AdminShell>
  );
}
