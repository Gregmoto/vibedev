import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageForm } from "@/components/admin/page-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type AdminEditPagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPagePage({ params }: AdminEditPagePageProps) {
  const { id } = await params;
  const page = await db.page.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  return (
    <AdminShell
      title="Redigera sida"
      description="Uppdatera titel, intro, innehåll, status och SEO för den valda sidan."
    >
      <PageForm page={page} />
    </AdminShell>
  );
}
