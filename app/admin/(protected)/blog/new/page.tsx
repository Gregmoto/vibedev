import { AdminShell } from "@/components/admin/admin-shell";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const dynamic = "force-dynamic";

export default function AdminNewBlogPostPage() {
  return (
    <AdminShell
      title="Nytt blogginlägg"
      description="Skapa ett nytt blogginlägg och fyll i innehåll, publicering och SEO-fält i samma formulär."
    >
      <BlogPostForm />
    </AdminShell>
  );
}
