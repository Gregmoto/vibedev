"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  getFirstIssueMessage,
  normalizeEmpty,
  requireAdminAction,
  validateGa4CustomScript,
} from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { parseSocialLinksInput } from "@/lib/site-settings";

const settingsSchema = z.object({
  siteName: z.string().min(2, "Site name krävs."),
  siteUrl: z.string().url("Site URL måste vara en giltig URL."),
  contactEmail: z.string().refine((value) => value === "" || z.string().email().safeParse(value).success, "Ange en giltig kontaktmail."),
  phone: z.string().optional(),
  address: z.string().optional(),
  footerText: z.string().optional(),
  socialLinks: z.string().optional(),
  defaultSeoTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  ga4MeasurementId: z
    .string()
    .refine((value) => value === "" || /^G-[A-Z0-9]+$/i.test(value), "GA4 Measurement ID måste se ut som G-XXXXXXXXXX."),
  ga4CustomScript: z
    .string()
    .refine(
      (value) => value === "" || validateGa4CustomScript(value),
      "Custom script måste vara ett begränsat GA4-script utan script-taggar eller godtycklig JavaScript-kod.",
    ),
  googleSearchConsoleVerification: z.string().optional(),
});

export type SettingsFormState = {
  error?: string;
  success?: string;
};

function toPayload(formData: FormData) {
  return {
    siteName: normalizeEmpty(formData.get("siteName")),
    siteUrl: normalizeEmpty(formData.get("siteUrl")),
    contactEmail: normalizeEmpty(formData.get("contactEmail")),
    phone: normalizeEmpty(formData.get("phone")),
    address: normalizeEmpty(formData.get("address")),
    footerText: normalizeEmpty(formData.get("footerText")),
    socialLinks: normalizeEmpty(formData.get("socialLinks")),
    defaultSeoTitle: normalizeEmpty(formData.get("defaultSeoTitle")),
    defaultMetaDescription: normalizeEmpty(formData.get("defaultMetaDescription")),
    ga4MeasurementId: normalizeEmpty(formData.get("ga4MeasurementId")),
    ga4CustomScript: normalizeEmpty(formData.get("ga4CustomScript")),
    googleSearchConsoleVerification: normalizeEmpty(formData.get("googleSearchConsoleVerification")),
  };
}

function toData(parsed: z.infer<typeof settingsSchema>): Prisma.SiteSettingsUncheckedCreateInput {
  return {
    siteName: parsed.siteName,
    siteUrl: parsed.siteUrl,
    contactEmail: parsed.contactEmail || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
    footerText: parsed.footerText || null,
    socialLinks: parsed.socialLinks ? parseSocialLinksInput(parsed.socialLinks) : Prisma.JsonNull,
    defaultSeoTitle: parsed.defaultSeoTitle || null,
    defaultMetaDescription: parsed.defaultMetaDescription || null,
    ga4MeasurementId: parsed.ga4MeasurementId || null,
    ga4CustomScript: parsed.ga4CustomScript || null,
    googleSearchConsoleVerification: parsed.googleSearchConsoleVerification || null,
  };
}

export async function saveSiteSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdminAction();

  if (!process.env.DATABASE_URL?.trim()) {
    return {
      error: "DATABASE_URL saknas. Konfigurera databasen innan inställningarna kan sparas.",
    };
  }

  const payload = toPayload(formData);
  const parsed = settingsSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      error: getFirstIssueMessage(parsed.error, "Kunde inte spara inställningarna."),
    };
  }

  const existing = await db.siteSettings.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    await db.siteSettings.update({
      where: { id: existing.id },
      data: toData(parsed.data),
    });
  } else {
    await db.siteSettings.create({
      data: toData(parsed.data),
    });
  }

  for (const path of [
    "/admin/settings",
    "/",
    "/tjanster",
    "/om-oss",
    "/blogg",
    "/podcast",
    "/case-studies",
    "/kontakt",
    "/boka-mote",
    "/resurser",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    revalidatePath(path);
  }

  return {
    success: "Inställningarna sparades.",
  };
}
