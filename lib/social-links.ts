import type { Prisma } from "@prisma/client";
import { CONTACT } from "@/lib/config/contact";

/**
 * Db-fria hjälpare för sociala länkar. Ligger avskilt från lib/site-settings.ts
 * (som importerar Prisma-klienten) så att klientkomponenter kan använda dem utan
 * att dra in databasdrivrutinen (pg) i klient-bundlen.
 */

export type SocialLink = {
  label: string;
  url: string;
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", url: CONTACT.social.linkedin },
  { label: "Instagram", url: CONTACT.social.instagram },
];

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseSocialLinksInput(value: string): SocialLink[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part.trim());

      return {
        label: url ? label : "Länk",
        url: url ?? label,
      };
    })
    .filter((item) => isSafeHttpUrl(item.url));
}

export function readSocialLinks(value: Prisma.JsonValue | null | undefined): SocialLink[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SOCIAL_LINKS;
  }

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const label = "label" in item && typeof item.label === "string" ? item.label.trim() : "";
      const url = "url" in item && typeof item.url === "string" ? item.url.trim() : "";

      return label && url && isSafeHttpUrl(url) ? { label, url } : null;
    })
    .filter((item): item is SocialLink => Boolean(item));

  return links.length > 0 ? links : DEFAULT_SOCIAL_LINKS;
}

export function formatSocialLinks(value: unknown) {
  return readSocialLinks(value as Prisma.JsonValue | null | undefined)
    .map((item) => `${item.label} | ${item.url}`)
    .filter(Boolean)
    .join("\n");
}
