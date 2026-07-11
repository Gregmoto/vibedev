import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type AdminEditCaseStudyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditCaseStudyPage({ params }: AdminEditCaseStudyPageProps) {
  const { id } = await params;
  const caseStudy = await db.caseStudy.findUnique({
    where: { id },
  });

  if (!caseStudy) {
    notFound();
  }

  return (
    <AdminShell
      title="Redigera case study"
      description="Uppdatera innehåll, process, resultat, publicering och SEO för det valda caset."
    >
      <CaseStudyForm caseStudy={caseStudy} />
    </AdminShell>
  );
}
