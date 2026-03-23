import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/content/blog";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full p-7">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="accent">{post.category}</Badge>
        <span className="text-xs uppercase tracking-[0.18em] text-muted">{post.readingTime}</span>
      </div>
      <h3 className="heading-md mt-5 text-2xl">
        <Link href={`/blogg/${post.slug}`} className="transition hover:text-brand">
          {post.title}
        </Link>
      </h3>
      <p className="body-md mt-3">{post.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted">{new Date(post.publishedAt).toLocaleDateString("sv-SE")}</span>
        <Link href={`/blogg/${post.slug}`} className="text-sm font-medium text-brand transition hover:text-text">
          Läs artikel
        </Link>
      </div>
    </Card>
  );
}
