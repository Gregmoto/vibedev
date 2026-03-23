import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="Webbplatsinställningar"
      description="Hantera site name, kontaktuppgifter, standard-SEO, GA4 och Search Console från ett ställe."
    >
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
