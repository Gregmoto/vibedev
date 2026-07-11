import { AdminShell } from "@/components/admin/admin-shell";
import { CaseStudyForm } from "@/components/admin/case-study-form";

export const dynamic = "force-dynamic";

export default function AdminNewCaseStudyPage() {
  return (
    <AdminShell
      title="Nytt case study"
      description="Skapa ett nytt case och fyll i innehåll, resultat, publicering och SEO i samma formulär."
    >
      <CaseStudyForm />
    </AdminShell>
  );
}
