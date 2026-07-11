import { AdminShell } from "@/components/admin/admin-shell";
import { PageForm } from "@/components/admin/page-form";

export const dynamic = "force-dynamic";

export default function AdminNewPagePage() {
  return (
    <AdminShell
      title="Ny sida"
      description="Skapa en ny enkel sida med intro, innehåll, status och SEO-fält."
    >
      <PageForm />
    </AdminShell>
  );
}
