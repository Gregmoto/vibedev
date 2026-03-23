import { ContentStatus } from "@prisma/client";
import { z } from "zod";

export const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().url().safeParse(value).success, "Ange en giltig URL.");

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
