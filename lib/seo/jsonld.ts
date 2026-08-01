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

type SiteContext = {
  siteName?: string;
  siteUrl?: string;
  /* Värden som styrs från adminpanelen. Utelämnade = använd konstanterna. */
  socialLinks?: { label: string; url: string }[];
  contactEmail?: string | null;
  phone?: string | null;
};

function resolvedName(ctx?: SiteContext) {
  return ctx?.siteName ?? siteConfig.name;
}
function resolvedUrl(ctx?: SiteContext) {
  return ctx?.siteUrl ?? siteConfig.url;
}
function resolvedPhone(ctx?: SiteContext) {
  return ctx?.phone ?? CONTACT.phone;
}
function resolvedEmail(ctx?: SiteContext) {
  return ctx?.contactEmail ?? CONTACT.email;
}

/**
 * sameAs speglar de sociala länkarna i adminpanelen. Har admin tagit bort alla
 * ska fältet utelämnas helt — schema.org tillåter inte ett tomt sameAs, och att
 * falla tillbaka på konstanterna vore samma bugg som i footern.
 */
function resolvedSameAs(ctx?: SiteContext): string[] | undefined {
  const links = ctx?.socialLinks;

  if (!links) {
    return [CONTACT.social.linkedin, CONTACT.social.instagram];
  }

  return links.length > 0 ? links.map((link) => link.url) : undefined;
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
    sameAs:  resolvedSameAs(ctx),
    contactPoint: {
      "@type":            "ContactPoint",
      telephone:           resolvedPhone(ctx),
      email:               resolvedEmail(ctx),
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
    telephone:   resolvedPhone(ctx),
    email:       resolvedEmail(ctx),
    priceRange:  "$$$$",
    sameAs:      resolvedSameAs(ctx),
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

/* ── CreativeWork (Case Study) ───────────────────────────────────────────── */

export function getCaseStudySchema(
  item: {
    slug: string;
    projectName: string;
    summary: string;
    industry: string;
    techStack?: string[];
    publishedAt?: string;
  },
  ctx?: SiteContext,
) {
  const url = resolvedUrl(ctx);

  return {
    "@context": "https://schema.org",
    "@type":    "CreativeWork",
    name:        item.projectName,
    description: item.summary,
    url:         `${url}/case-studies/${item.slug}`,
    genre:       item.industry,
    author: {
      "@type": "Organization",
      name:    resolvedName(ctx),
      url,
    },
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    ...(item.techStack?.length
      ? { keywords: item.techStack.join(", ") }
      : {}),
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
