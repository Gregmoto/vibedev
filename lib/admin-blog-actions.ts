"use server";

import { ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getFirstIssueMessage,
  hasDatabaseUrl,
  normalizeEmpty,
  optionalUrlSchema,
  parseCommaSeparatedList,
  parsePublishedAt,
  requireAdminAction,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

const blogPostSchema = z.object({
  title: z.string().min(2, "Titel måste vara minst 2 tecken."),
  slug: z.string().min(2, "Slug krävs.").regex(/^[a-z0-9-]+$/, "Använd endast små bokstäver, siffror och bindestreck."),
  excerpt: z.string().min(10, "Excerpt måste vara minst 10 tecken."),
  content: z.string().min(20, "Content måste vara minst 20 tecken."),
  featuredImage: optionalUrlSchema,
  author: z.string().optional(),
  category: z.string().min(2, "Kategori krävs."),
  tags: z.string().optional(),
  status: z.nativeEnum(ContentStatus),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  canonicalUrl: optionalUrlSchema,
  noindex: z.boolean(),
});

export type BlogFormState = {
  error?: string;
  success?: string;
  values?: ReturnType<typeof toPayload>;
};

function parseCanonicalUrl(value: string) {
  if (!value) {
    return "";
  }

  return value;
}

function toPayload(formData: FormData) {
  return {
    title: normalizeEmpty(formData.get("title")),
    slug: normalizeEmpty(formData.get("slug")),
    excerpt: normalizeEmpty(formData.get("excerpt")),
    content: normalizeEmpty(formData.get("content")),
    featuredImage: normalizeEmpty(formData.get("featuredImage")),
    author: normalizeEmpty(formData.get("author")),
    category: normalizeEmpty(formData.get("category")),
    tags: normalizeEmpty(formData.get("tags")),
    status: normalizeEmpty(formData.get("status")) as ContentStatus,
    publishedAt: normalizeEmpty(formData.get("publishedAt")),
    seoTitle: normalizeEmpty(formData.get("seoTitle")),
    metaDescription: normalizeEmpty(formData.get("metaDescription")),
    ogTitle: normalizeEmpty(formData.get("ogTitle")),
    ogDescription: normalizeEmpty(formData.get("ogDescription")),
    canonicalUrl: normalizeEmpty(formData.get("canonicalUrl")),
    noindex: formData.get("noindex") === "on",
  };
}

function toData(parsed: z.infer<typeof blogPostSchema>): Prisma.BlogPostUncheckedCreateInput {
  return {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: {
      markdown: parsed.content,
    },
    featuredImage: parsed.featuredImage || null,
    author: parsed.author || null,
    category: parsed.category,
    tags: parseCommaSeparatedList(parsed.tags || ""),
    status: parsed.status,
    publishedAt: parsePublishedAt(parsed.publishedAt || "", parsed.status),
    seoTitle: parsed.seoTitle || null,
    metaDescription: parsed.metaDescription || null,
    ogTitle: parsed.ogTitle || null,
    ogDescription: parsed.ogDescription || null,
    canonicalUrl: parseCanonicalUrl(parsed.canonicalUrl || "") || null,
    noindex: parsed.noindex,
  };
}

function refreshBlogAdmin(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blogg");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/blogg/${slug}`);
  }
}

export async function createBlogPostAction(_prevState: BlogFormState, formData: FormData): Promise<BlogFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Blogg-CMS kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = blogPostSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte spara blogginlägget."),
      values: payload,
    };
  }

  try {
    const post = await db.blogPost.create({
      data: toData(parsed.data),
    });

    refreshBlogAdmin(post.slug);
    redirect(`/admin/blog/${post.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat blogginlägg.", values: payload };
    }

    return { error: "Något gick fel när blogginlägget skapades.", values: payload };
  }
}

export async function updateBlogPostAction(
  postId: string,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Blogg-CMS kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = blogPostSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte uppdatera blogginlägget."),
      values: payload,
    };
  }

  try {
    await db.blogPost.update({
      where: { id: postId },
      data: toData(parsed.data),
    });

    refreshBlogAdmin(parsed.data.slug);
    revalidatePath(`/admin/blog/${postId}`);
    return { success: "Blogginlägget uppdaterades." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat blogginlägg.", values: payload };
    }

    return { error: "Något gick fel när blogginlägget uppdaterades.", values: payload };
  }
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const postId = normalizeEmpty(formData.get("id"));

  if (!postId) {
    return;
  }

  const existing = await db.blogPost.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  await db.blogPost.delete({
    where: { id: postId },
  });

  refreshBlogAdmin(existing?.slug);
  redirect("/admin/blog");
}

export async function publishBlogPostAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const postId = normalizeEmpty(formData.get("id"));

  if (!postId) {
    return;
  }

  const updated = await db.blogPost.update({
    where: { id: postId },
    data: {
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    select: { slug: true },
  });

  refreshBlogAdmin(updated.slug);
  redirect("/admin/blog");
}

export async function unpublishBlogPostAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const postId = normalizeEmpty(formData.get("id"));

  if (!postId) {
    return;
  }

  const updated = await db.blogPost.update({
    where: { id: postId },
    data: {
      status: ContentStatus.DRAFT,
    },
    select: { slug: true },
  });

  refreshBlogAdmin(updated.slug);
  redirect("/admin/blog");
}
