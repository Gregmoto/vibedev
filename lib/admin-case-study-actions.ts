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
  parseLineList,
  parsePublishedAt,
  requireAdminAction,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

const caseStudySchema = z.object({
  title: z.string().min(2, "Titel måste vara minst 2 tecken."),
  slug: z.string().min(2, "Slug krävs.").regex(/^[a-z0-9-]+$/, "Använd endast små bokstäver, siffror och bindestreck."),
  clientName: z.string().optional(),
  industry: z.string().min(2, "Bransch krävs."),
  summary: z.string().min(10, "Summary måste vara minst 10 tecken."),
  problem: z.string().min(10, "Problem måste vara minst 10 tecken."),
  solution: z.string().min(10, "Solution måste vara minst 10 tecken."),
  process: z.string().min(10, "Process måste vara minst 10 tecken."),
  results: z.string().min(10, "Results måste vara minst 10 tecken."),
  techStack: z.string().optional(),
  featuredImage: optionalUrlSchema,
  status: z.nativeEnum(ContentStatus),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  canonicalUrl: optionalUrlSchema,
  noindex: z.boolean(),
});

export type CaseStudyFormState = {
  error?: string;
  success?: string;
};

function toPayload(formData: FormData) {
  return {
    title: normalizeEmpty(formData.get("title")),
    slug: normalizeEmpty(formData.get("slug")),
    clientName: normalizeEmpty(formData.get("clientName")),
    industry: normalizeEmpty(formData.get("industry")),
    summary: normalizeEmpty(formData.get("summary")),
    problem: normalizeEmpty(formData.get("problem")),
    solution: normalizeEmpty(formData.get("solution")),
    process: normalizeEmpty(formData.get("process")),
    results: normalizeEmpty(formData.get("results")),
    techStack: normalizeEmpty(formData.get("techStack")),
    featuredImage: normalizeEmpty(formData.get("featuredImage")),
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

function toData(parsed: z.infer<typeof caseStudySchema>): Prisma.CaseStudyUncheckedCreateInput {
  return {
    title: parsed.title,
    slug: parsed.slug,
    clientName: parsed.clientName || null,
    industry: parsed.industry,
    summary: parsed.summary,
    problem: parsed.problem,
    solution: parsed.solution,
    process: {
      items: parseLineList(parsed.process),
    },
    results: {
      items: parseLineList(parsed.results),
    },
    techStack: parseCommaSeparatedList(parsed.techStack || ""),
    featuredImage: parsed.featuredImage || null,
    status: parsed.status,
    publishedAt: parsePublishedAt(parsed.publishedAt || "", parsed.status),
    seoTitle: parsed.seoTitle || null,
    metaDescription: parsed.metaDescription || null,
    ogTitle: parsed.ogTitle || null,
    ogDescription: parsed.ogDescription || null,
    canonicalUrl: parsed.canonicalUrl || null,
    noindex: parsed.noindex,
  };
}

function refreshCaseStudiesAdmin(slug?: string) {
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/case-studies/${slug}`);
  }
}

export async function createCaseStudyAction(
  _prevState: CaseStudyFormState,
  formData: FormData,
): Promise<CaseStudyFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return { error: "DATABASE_URL saknas. Case study-CMS kräver en konfigurerad databas." };
  }

  const payload = toPayload(formData);
  const parsed = caseStudySchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte skapa case study."),
    };
  }

  try {
    const caseStudy = await db.caseStudy.create({
      data: toData(parsed.data),
    });

    refreshCaseStudiesAdmin(caseStudy.slug);
    redirect(`/admin/case-studies/${caseStudy.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat case." };
    }

    return { error: "Något gick fel när case study skapades." };
  }
}

export async function updateCaseStudyAction(
  caseStudyId: string,
  _prevState: CaseStudyFormState,
  formData: FormData,
): Promise<CaseStudyFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return { error: "DATABASE_URL saknas. Case study-CMS kräver en konfigurerad databas." };
  }

  const payload = toPayload(formData);
  const parsed = caseStudySchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte uppdatera case study."),
    };
  }

  try {
    await db.caseStudy.update({
      where: { id: caseStudyId },
      data: toData(parsed.data),
    });

    refreshCaseStudiesAdmin(parsed.data.slug);
    revalidatePath(`/admin/case-studies/${caseStudyId}`);
    return { success: "Case study uppdaterades." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat case." };
    }

    return { error: "Något gick fel när case study uppdaterades." };
  }
}

export async function deleteCaseStudyAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const existing = await db.caseStudy.findUnique({
    where: { id },
    select: { slug: true },
  });

  await db.caseStudy.delete({
    where: { id },
  });

  refreshCaseStudiesAdmin(existing?.slug);
  redirect("/admin/case-studies");
}

export async function publishCaseStudyAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.caseStudy.update({
    where: { id },
    data: {
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    select: { slug: true },
  });

  refreshCaseStudiesAdmin(updated.slug);
  redirect("/admin/case-studies");
}

export async function unpublishCaseStudyAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.caseStudy.update({
    where: { id },
    data: {
      status: ContentStatus.DRAFT,
    },
    select: { slug: true },
  });

  refreshCaseStudiesAdmin(updated.slug);
  redirect("/admin/case-studies");
}
