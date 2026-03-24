import { ContentStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";

export const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isSafeHttpUrl(value), "Ange en giltig URL.");

export const optionalEmbedUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isSafeHttpUrl(value), "Ange en giltig embed-URL.");

export function isSafeHttpUrl(value: string) {
  const parsed = z.string().url().safeParse(value);

  if (!parsed.success) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function normalizeEmpty(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function parseCommaSeparatedList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLineList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parsePublishedAt(value: string, status: ContentStatus) {
  if (!value && status === ContentStatus.PUBLISHED) {
    return new Date();
  }

  return value ? new Date(value) : null;
}

export function getFirstIssueMessage(error: z.ZodError, fallback: string) {
  return error.issues[0]?.message || fallback;
}

export async function requireAdminAction() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Otillåten adminåtgärd.");
  }

  return session;
}

export function validateGa4CustomScript(value: string) {
  if (!value.trim()) {
    return true;
  }

  const normalized = value.trim();
  const forbiddenPatterns = [
    /<script\b/i,
    /<\/script>/i,
    /\bdocument\./i,
    /\bwindow\.location\b/i,
    /\bfetch\s*\(/i,
    /\bXMLHttpRequest\b/i,
    /\beval\s*\(/i,
    /\bFunction\s*\(/i,
    /\bimport\s*\(/i,
    /\bsrc\s*=/i,
  ];

  if (forbiddenPatterns.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  return /\bgtag\s*\(/i.test(normalized) || /\bdataLayer\b/i.test(normalized);
}
