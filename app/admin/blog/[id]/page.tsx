import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type AdminEditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPostPage({ params }: AdminEditBlogPostPageProps) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      title="Redigera blogginlägg"
      description="Uppdatera innehåll, publiceringsstatus och SEO för det valda blogginlägget."
    >
      <BlogPostForm post={post} />
    </AdminShell>
  );
}
