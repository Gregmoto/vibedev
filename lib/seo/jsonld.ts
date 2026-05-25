/**
 * JSON-LD schema generators.
 *
 * Usage in a Server Component:
 *   <script type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }} />
 */

import { CONTACT } from "@/lib/config/contact";
import { siteConfig } from "@/lib/metadata";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

type SiteContext = { siteName?: string; siteUrl?: string };

function resolvedName(ctx?: SiteContext) {
  return ctx?.siteName ?? siteConfig.name;
}
function resolvedUrl(ctx?: SiteContext) {
  return ctx?.siteUrl ?? siteConfig.url;
}

/* ── Organization ────────────────────────────────────────────────────────── */

export function getOrganizationSchema(ctx?: SiteContext) {
  const name = resolvedName(ctx);
  const url  = resolvedUrl(ctx);

  return {
    "@context": "https://schema.org",
    "@type":    "Organization",
    name,
    url,
    logo:    `${url}/logo.svg`,
    sameAs:  [CONTACT.social.linkedin, CONTACT.social.instagram],
    contactPoint: {
      "@type":            "ContactPoint",
      telephone:           CONTACT.phone,
      email:               CONTACT.email,
      contactType:         "customer service",
      areaServed:          "SE",
      availableLanguage:   "Swedish",
    },
    address: {
      "@type":          "PostalAddress",
      addressLocality:  CONTACT.address.city,
      addressCountry:   "SE",
    },
  };
}

/* ── LocalBusiness / ProfessionalService ─────────────────────────────────── */

export function getLocalBusinessSchema(ctx?: SiteContext) {
  const name = resolvedName(ctx);
  const url  = resolvedUrl(ctx);

  return {
    "@context":  "https://schema.org",
    "@type":     "ProfessionalService",
    name,
    url,
    logo:        `${url}/logo.svg`,
    telephone:   CONTACT.phone,
    email:       CONTACT.email,
    priceRange:  "$$$$",
    sameAs:      [CONTACT.social.linkedin, CONTACT.social.instagram],
    address: {
      "@type":          "PostalAddress",
      addressLocality:  CONTACT.address.city,
      addressCountry:   "SE",
    },
    areaServed: "Sweden",
  };
}

/* ── FAQPage ─────────────────────────────────────────────────────────────── */

export function getFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name:    q,
      acceptedAnswer: {
        "@type": "Answer",
        text:    a,
      },
    })),
  };
}

/* ── Service ─────────────────────────────────────────────────────────────── */

export function getServiceSchema(
  service: {
    slug:          string;
    title:         string;
    pitch:         string;
    deliverables?: string[];
  },
  ctx?: SiteContext,
) {
  const url = resolvedUrl(ctx);

  return {
    "@context":  "https://schema.org",
    "@type":     "Service",
    name:         service.title,
    description:  service.pitch,
    provider: {
      "@type": "Organization",
      name:    resolvedName(ctx),
      url,
    },
    areaServed:  "Sweden",
    url:         `${url}/tjanster#${service.slug}`,
    ...(service.deliverables?.length ? { serviceOutput: service.deliverables } : {}),
  };
}

/* ── BreadcrumbList ──────────────────────────────────────────────────────── */

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context":      "https://schema.org",
    "@type":         "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":   "ListItem",
      position:   i + 1,
      name:       item.name,
      item:       item.url,
    })),
  };
}
