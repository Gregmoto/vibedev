"use server";

import { ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getFirstIssueMessage,
  hasDatabaseUrl,
  normalizeEmpty,
  optionalEmbedUrlSchema,
  optionalUrlSchema,
  parseCommaSeparatedList,
  parsePublishedAt,
  requireAdminAction,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

const podcastEpisodeSchema = z.object({
  title: z.string().min(2, "Titel måste vara minst 2 tecken."),
  slug: z.string().min(2, "Slug krävs.").regex(/^[a-z0-9-]+$/, "Använd endast små bokstäver, siffror och bindestreck."),
  description: z.string().min(10, "Beskrivning måste vara minst 10 tecken."),
  showNotes: z.string().min(10, "Show notes måste vara minst 10 tecken."),
  guestNames: z.string().optional(),
  coverImage: optionalUrlSchema,
  audioUrl: optionalUrlSchema,
  embedUrl: optionalEmbedUrlSchema,
  status: z.nativeEnum(ContentStatus),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  canonicalUrl: optionalUrlSchema,
  noindex: z.boolean(),
});

export type PodcastFormState = {
  error?: string;
  success?: string;
  values?: ReturnType<typeof toPayload>;
};

function toPayload(formData: FormData) {
  return {
    title: normalizeEmpty(formData.get("title")),
    slug: normalizeEmpty(formData.get("slug")),
    description: normalizeEmpty(formData.get("description")),
    showNotes: normalizeEmpty(formData.get("showNotes")),
    guestNames: normalizeEmpty(formData.get("guestNames")),
    coverImage: normalizeEmpty(formData.get("coverImage")),
    audioUrl: normalizeEmpty(formData.get("audioUrl")),
    embedUrl: normalizeEmpty(formData.get("embedUrl")),
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

function toData(parsed: z.infer<typeof podcastEpisodeSchema>): Prisma.PodcastEpisodeUncheckedCreateInput {
  return {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    showNotes: {
      markdown: parsed.showNotes,
    },
    guestNames: parseCommaSeparatedList(parsed.guestNames || ""),
    coverImage: parsed.coverImage || null,
    audioUrl: parsed.audioUrl || null,
    embedUrl: parsed.embedUrl || null,
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

function refreshPodcastAdmin(slug?: string) {
  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/podcast/${slug}`);
  }
}

export async function createPodcastEpisodeAction(
  _prevState: PodcastFormState,
  formData: FormData,
): Promise<PodcastFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Podcast-CMS kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = podcastEpisodeSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte skapa avsnittet."),
      values: payload,
    };
  }

  try {
    const episode = await db.podcastEpisode.create({
      data: toData(parsed.data),
    });

    refreshPodcastAdmin(episode.slug);
    redirect(`/admin/podcast/${episode.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat podcastavsnitt.", values: payload };
    }

    return { error: "Något gick fel när podcastavsnittet skapades.", values: payload };
  }
}

export async function updatePodcastEpisodeAction(
  episodeId: string,
  _prevState: PodcastFormState,
  formData: FormData,
): Promise<PodcastFormState> {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return {
      error: "DATABASE_URL saknas. Podcast-CMS kräver en konfigurerad databas.",
      values: toPayload(formData),
    };
  }

  const payload = toPayload(formData);
  const parsed = podcastEpisodeSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte uppdatera avsnittet."),
      values: payload,
    };
  }

  try {
    await db.podcastEpisode.update({
      where: { id: episodeId },
      data: toData(parsed.data),
    });

    refreshPodcastAdmin(parsed.data.slug);
    revalidatePath(`/admin/podcast/${episodeId}`);
    return { success: "Podcastavsnittet uppdaterades." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Sluggen används redan av ett annat podcastavsnitt.", values: payload };
    }

    return { error: "Något gick fel när podcastavsnittet uppdaterades.", values: payload };
  }
}

export async function deletePodcastEpisodeAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const existing = await db.podcastEpisode.findUnique({
    where: { id },
    select: { slug: true },
  });

  await db.podcastEpisode.delete({
    where: { id },
  });

  refreshPodcastAdmin(existing?.slug);
  redirect("/admin/podcast");
}

export async function publishPodcastEpisodeAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.podcastEpisode.update({
    where: { id },
    data: {
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    select: { slug: true },
  });

  refreshPodcastAdmin(updated.slug);
  redirect("/admin/podcast");
}

export async function unpublishPodcastEpisodeAction(formData: FormData) {
  await requireAdminAction();

  if (!hasDatabaseUrl()) {
    return;
  }

  const id = normalizeEmpty(formData.get("id"));

  if (!id) {
    return;
  }

  const updated = await db.podcastEpisode.update({
    where: { id },
    data: {
      status: ContentStatus.DRAFT,
    },
    select: { slug: true },
  });

  refreshPodcastAdmin(updated.slug);
  redirect("/admin/podcast");
}
