import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { getAdminDashboardData } from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <AdminShell
      title="Dashboard"
      description="En snabb överblick över innehåll, status och de viktigaste delarna av VibeDev-admin."
    >
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.contentSummary.map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-text">{item.total}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                {item.published} publicerade
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted">
                {item.drafts} drafts
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              <LinkButton href={item.href} variant="secondary" size="sm">
                Öppna
              </LinkButton>
              <LinkButton href={item.createHref} size="sm">
                Skapa ny
              </LinkButton>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted">Totalt publicerat innehåll</p>
          <p className="mt-3 text-3xl font-semibold text-text">{dashboard.totals.published}</p>
          <p className="mt-2 text-sm text-muted">Summerat över blogg, podcast, case studies och pages.</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted">Totalt drafts</p>
          <p className="mt-3 text-3xl font-semibold text-text">{dashboard.totals.drafts}</p>
          <p className="mt-2 text-sm text-muted">Utkast som fortfarande väntar på publicering.</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted">Snabbstatus</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <AdminStatusBadge status={dashboard.totals.published > 0 ? "PUBLISHED" : "DRAFT"} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              {dashboard.settingsOverview.ga4Enabled ? "GA4 aktiv" : "GA4 saknas"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              {dashboard.settingsOverview.searchConsoleEnabled ? "Search Console aktiv" : "Search Console saknas"}
            </span>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminTable
          title="Senaste aktivitet"
          description="Senast uppdaterat innehåll i adminpanelen."
          rows={dashboard.recentActivity}
          actions={
            <LinkButton href="/admin/blog" size="sm">
              Öppna blogg
            </LinkButton>
          }
          columns={[
            {
              key: "type",
              header: "Typ",
              render: (row) => <span className="text-muted">{row.type}</span>,
            },
            {
              key: "name",
              header: "Titel",
              render: (row) => (
                <Link href={row.href} className="font-medium text-text transition hover:text-brand">
                  {row.title}
                </Link>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <AdminStatusBadge status={row.status as "DRAFT" | "PUBLISHED"} />,
            },
            {
              key: "updated",
              header: "Uppdaterad",
              render: (row) => (
                <span className="text-muted">{new Date(row.updatedAt).toLocaleDateString("sv-SE")}</span>
              ),
            },
          ]}
        />

        <Card className="p-6">
          <h2 className="heading-md text-2xl">Skapa nytt innehåll</h2>
          <p className="mt-3 text-sm text-muted">Snabbknappar för de vanligaste arbetsflödena i admin.</p>
          <div className="mt-5 grid gap-3">
            <LinkButton href="/admin/blog/new" variant="secondary" size="sm">
              Ny bloggpost
            </LinkButton>
            <LinkButton href="/admin/podcast/new" variant="secondary" size="sm">
              Nytt podcastavsnitt
            </LinkButton>
            <LinkButton href="/admin/case-studies/new" variant="secondary" size="sm">
              Ny case study
            </LinkButton>
            <LinkButton href="/admin/pages/new" variant="secondary" size="sm">
              Ny sida
            </LinkButton>
            <LinkButton href="/admin/settings" size="sm">
              Öppna settings
            </LinkButton>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h2 className="heading-md text-2xl">Site settings</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Site name</p>
              <p className="mt-1 font-medium text-text">{dashboard.settingsOverview.siteName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Site URL</p>
              <p className="mt-1 font-medium text-text">{dashboard.settingsOverview.siteUrl}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Kontakt</p>
              <p className="mt-1 text-text">{dashboard.settingsOverview.contactEmail || "Inte angivet"}</p>
              <p className="mt-1 text-muted">{dashboard.settingsOverview.phone || "Telefon saknas"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Social links</p>
              <p className="mt-1 text-text">{dashboard.settingsOverview.socialLinksCount} sparade länkar</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
                {dashboard.settingsOverview.ga4Enabled ? "GA4 konfigurerat" : "GA4 ej konfigurerat"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
                {dashboard.settingsOverview.searchConsoleEnabled
                  ? "Search Console verifierad"
                  : "Search Console saknas"}
              </span>
            </div>
            <div className="pt-3">
              <LinkButton href="/admin/settings" variant="secondary" size="sm">
                Redigera settings
              </LinkButton>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="heading-md text-2xl">Översikt</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Bloggposter",
                value: dashboard.totals.blogPosts,
              },
              {
                label: "Podcastavsnitt",
                value: dashboard.totals.podcastEpisodes,
              },
              {
                label: "Case studies",
                value: dashboard.totals.caseStudies,
              },
              {
                label: "Pages",
                value: dashboard.totals.pages,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-text">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-sm text-muted">Footer preview</p>
            <p className="mt-3 text-sm leading-7 text-text">
              {dashboard.settingsOverview.footerText || "Ingen footertext sparad ännu."}
            </p>
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}
