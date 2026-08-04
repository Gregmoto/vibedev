import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/components/admin/admin-table";
import { BihrRunButtons } from "@/components/admin/bihr-run-buttons";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { Badge } from "@/components/ui/badge";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

type FeedFile = { key: string; size: number; uploaded: Date };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short" }).format(value);
}

/** Läser vad som faktiskt ligger i R2 — sanningen om vad som gick att hämta. */
async function listFeeds(): Promise<{ nightly: FeedFile[]; extended: FeedFile[] }> {
  let bucket: R2Bucket | undefined;

  try {
    bucket = getCloudflareContext().env?.TICKET_ATTACHMENTS;
  } catch {
    bucket = undefined;
  }

  if (!bucket) {
    return { nightly: [], extended: [] };
  }

  const nightly: FeedFile[] = [];
  for (const name of ["feeds/bihr-hardparts.csv", "feeds/bihr-ridergear.csv"]) {
    const head = await bucket.head(name);
    if (head) {
      nightly.push({ key: name, size: head.size, uploaded: head.uploaded });
    }
  }

  const extended: FeedFile[] = [];
  let cursor: string | undefined;
  do {
    const listing = await bucket.list({ prefix: "feeds/extended/", cursor, limit: 1000 });
    for (const object of listing.objects) {
      extended.push({ key: object.key, size: object.size, uploaded: object.uploaded });
    }
    cursor = listing.truncated ? listing.cursor : undefined;
  } while (cursor);

  extended.sort((a, b) => a.key.localeCompare(b.key, "sv"));

  return { nightly, extended };
}

export default async function AdminBihrPage() {
  const [{ nightly, extended }, runs] = await Promise.all([
    listFeeds(),
    hasDatabaseUrl()
      ? db.bihrRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
      : Promise.resolve([]),
  ]);

  return (
    <AdminShell
      title="API – Bihr"
      description="Hämtar katalogerna från Bihr och lägger dem som CSV. HardPart och RiderGear uppdateras varje natt, Extended hämtas när du behöver den."
    >
      <section className="surface-elevated p-6">
        <h2 className="text-sm font-semibold text-text">Hämta</h2>
        <p className="mt-2 text-sm text-muted">
          Extended är hela sortimentet uppdelat på 245 märkesfiler och tar några minuter. Filerna
          raderas automatiskt efter ett dygn.
        </p>
        <div className="mt-5">
          <BihrRunButtons />
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="text-sm font-semibold text-text">Nattliga filer</h2>
        {nightly.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Inga filer hämtade än. Tryck på knappen ovan eller vänta på nattkörningen 03:15.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {nightly.map((file) => {
              const name = file.key.replace("feeds/", "");
              return (
                <li key={file.key} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-2">
                    <a href={`/${name}`} className="text-sm text-brand transition hover:underline">
                      /{name}
                    </a>
                    <CopyLinkButton path={`/${name}`} />
                  </span>
                  <span className="text-xs text-muted">
                    {formatBytes(file.size)} · uppdaterad {formatDateTime(file.uploaded)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-text">Extended – märkesfiler</h2>
          <span className="text-xs text-muted">{extended.length} filer</span>
        </div>

        {extended.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Ingen Extended-hämtning gjord, eller så har filerna städats bort efter ett dygn.
          </p>
        ) : (
          <ul className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {extended.map((file) => {
              const name = file.key.replace("feeds/extended/", "");
              return (
                <li key={file.key} className="flex items-center justify-between gap-2 py-1">
                  <span className="flex min-w-0 items-center gap-1">
                    <a
                      href={`/api/bihr/extended/${name}`}
                      className="truncate text-sm text-brand transition hover:underline"
                      title={name}
                    >
                      {name.split("/").pop()}
                    </a>
                    <CopyLinkButton path={`/api/bihr/extended/${name}`} />
                  </span>
                  <span className="shrink-0 text-xs text-muted">{formatBytes(file.size)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AdminTable
        title="Logg"
        description="De 50 senaste hämtningarna. Äldre rader raderas automatiskt."
        rows={runs}
        rowKey={(row) => row.id}
        dense
        emptyState={
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-base font-medium text-text">Inga körningar loggade än</p>
          </div>
        }
        columns={[
          {
            key: "when",
            header: "Tidpunkt",
            className: "w-[18%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {formatDateTime(row.createdAt)}
              </span>
            ),
          },
          {
            key: "kind",
            header: "Typ",
            className: "w-[16%]",
            render: (row) => (
              <span className="text-sm text-text">
                {row.kind === "extended" ? "Extended" : "Nattlig"}
                {row.manual ? <span className="ml-2 text-xs text-muted">manuell</span> : null}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            className: "w-[14%]",
            render: (row) =>
              row.success ? (
                <Badge tone="success">Lyckades</Badge>
              ) : (
                <Badge tone="neutral">Misslyckades</Badge>
              ),
          },
          {
            key: "result",
            header: "Resultat",
            className: "w-[24%]",
            render: (row) => (
              <span className="text-sm text-muted">
                {row.kind === "extended"
                  ? `${row.files} filer · ${formatBytes(row.bytes)}`
                  : `${row.rows.toLocaleString("sv-SE")} rader · ${formatBytes(row.bytes)}`}
              </span>
            ),
          },
          {
            key: "duration",
            header: "Tid",
            className: "w-[10%]",
            render: (row) => (
              <span className="whitespace-nowrap text-sm text-muted">
                {(row.durationMs / 1000).toFixed(1)} s
              </span>
            ),
          },
          {
            key: "error",
            header: "Fel",
            className: "w-[18%]",
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
    </AdminShell>
  );
}
