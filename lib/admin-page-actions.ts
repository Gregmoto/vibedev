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
  requireAdminAction,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

const pageSchema = z.object({
  title: z.string().min(2, "Titel måste vara minst 2 tecken."),
  slug: z.string().min(1, "Slug krävs.").regex(/^[a-z0-9-/]+$/, "Använd små bokstäver, siffror, snedstreck och bindestreck."),
  intro: z.string().optional(),
  content: z.string().min(10, "Content måste vara minst 10 tecken."),
  status: z.nativeEnum(ContentStatus),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  canonicalUrl: optionalUrlSchema,
  noindex: z.boolean(),
});

export type PageFormState = {
  error?: string;
  success?: string;
  values?: ReturnType<typeof toPayload>;
};

function toPayload(formData: FormData) {
  return {
    title: normalizeEmpty(formData.get("title")),
    slug: normalizeEmpty(formData.get("slug")),
    intro: normalizeEmpty(formData.get("intro")),
    content: normalizeEmpty(formData.get("content")),
    status: normalizeEmpty(formData.get("status")) as ContentStatus,
    seoTitle: normalizeEmpty(formData.get("seoTitle")),
    metaDescription: normalizeEmpty(formData.get("metaDescription")),
    ogTitle: normalizeEmpty(formData.get("ogTitle")),
    ogDescription: normalizeEmpty(formData.get("ogDescription")),
    canonicalUrl: normalizeEmpty(formData.get("canonicalUrl")),
    noindex: formData.get("noindex") === "on",
  };
}

function toData(parsed: z.infer<typeof pageSchema>): Prisma.PageUncheckedCreateInput {
  return {
    title: parsed.title,
    slug: parsed.slug,
    intro: parsed.intro || null,
    content: {
      markdown: parsed.content,
    },
    status: parsed.status,
    seoTitle: parsed.seoTitle || null,
    metaDescription: parsed.metaDescription || null,
    ogTitle: parsed.ogTitle || null,
    ogDescription: parsed.ogDescription || null,
    canonicalUrl: parsed.canonicalUrl || null,
    noindex: parsed.noindex,
  };
}

function refreshPagesAdmin(slug?: string) {
  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(slug.startsWith("/") ? slug : `/${slug}`);
  }
}

export async function createPageAction(_prevState: PageFormState, formData: FormData): Promise<PageFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Page editor kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = pageSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte skapa sidan."),
      values: payload,
    };
  }

  try {
    const page = await db.page.create({
      data: toData(parsed.data),
    });

    refreshPagesAdmin(page.slug);
    redirect(`/admin/pages/${page.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av en annan sida.", values: payload };
    }

    return { error: "Något gick fel när sidan skapades.", values: payload };
  }
}

export async function updatePageAction(pageId: string, _prevState: PageFormState, formData: FormData): Promise<PageFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Page editor kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = pageSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte uppdatera sidan."),
      values: payload,
    };
  }

  try {
    await db.page.update({
      where: { id: pageId },
      data: toData(parsed.data),
    });

    refreshPagesAdmin(parsed.data.slug);
    redirect(`/admin/pages/${pageId}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av en annan sida.", values: payload };
    }

    return { error: "Något gick fel när sidan uppdaterades.", values: payload };
  }
}

export async function deletePageAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const existing = await db.page.findUnique({
    where: { id },
    select: { slug: true },
  });

  await db.page.delete({
    where: { id },
  });

  refreshPagesAdmin(existing?.slug);
  redirect("/admin/pages");
}

export async function publishPageAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.page.update({
    where: { id },
    data: {
      status: ContentStatus.PUBLISHED,
    },
    select: { slug: true },
  });

  refreshPagesAdmin(updated.slug);
  redirect("/admin/pages");
}

export async function unpublishPageAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.page.update({
    where: { id },
    data: {
      status: ContentStatus.DRAFT,
    },
    select: { slug: true },
  });

  refreshPagesAdmin(updated.slug);
  redirect("/admin/pages");
}
