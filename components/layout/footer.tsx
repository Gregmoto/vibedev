import Link from "next/link";
import { LogoFull } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { COMPANY } from "@/lib/config/contact";
import { getResolvedSiteSettings } from "@/lib/site-settings";

/* ── Column link lists ───────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Hem",             href: "/" },
  { label: "Tjänster",        href: "/tjanster" },
  { label: "Gratis hemsida",  href: "/gratis-hemsida" },
  { label: "Hyr hemsida",     href: "/hyr" },
  { label: "Case studies",    href: "/case-studies" },
  { label: "Om oss",          href: "/om-oss" },
  { label: "Resurser",        href: "/resurser" },
];

const CONTENT_LINKS = [
  { label: "Blogg",               href: "/blogg" },
  { label: "Podcast",             href: "/podcast" },
  { label: "Vibecoding-guiden",   href: "/vibecoding" },
  { label: "Nyhetsbrev",          href: "/resurser" },
];

const LEGAL_LINKS = [
  { label: "Integritetspolicy",   href: "/integritetspolicy" },
  { label: "Cookies",             href: "/cookies" },
  { label: "Villkor",             href: "/villkor" },
];

/* ── Component ───────────────────────────────────────────────────────────────── */

/* Ikon per känd plattform. Okända länkar får en neutral länkikon. */
function SocialIcon({ label }: { label: string }) {
  const key = label.trim().toLowerCase();

  if (key === "linkedin") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (key === "instagram") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export async function Footer() {
  const year = new Date().getFullYear();
  // Allt nedan styrs från adminpanelen. Tomt värde = admin har medvetet tömt
  // fältet och då ska raden inte renderas — inte falla tillbaka på konstanten.
  const { socialLinks, footerText, contactEmail, phone, address } =
    await getResolvedSiteSettings();

  return (
    <footer className="border-t border-line bg-bg">
      <Container>

        {/* ── 4-column grid ──────────────────────────────────────────────────── */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">

          {/* Col 1 — Brand */}
          <div className="space-y-5">
            <LogoFull height={30} />
            {footerText ? (
              <p className="max-w-xs text-sm leading-7 text-muted">{footerText}</p>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`VibeDev på ${link.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                  >
                    <SocialIcon label={link.label} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-text">
              Navigation
            </p>
            <nav aria-label="Footer-navigation">
              <ul className="space-y-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition hover:text-text"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Innehåll */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-text">
              Innehåll
            </p>
            <ul className="space-y-3">
              {CONTENT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Kontakt */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-text">
              Kontakt
            </p>
            <ul className="space-y-3 text-sm text-muted">
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="transition hover:text-text"
                  >
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="transition hover:text-text"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? <li>{address}</li> : null}
            </ul>
            <div className="mt-5">
              <LinkButton href="/boka-mote" size="sm">
                Boka samtal
              </LinkButton>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/50 py-6 text-xs text-muted">
          <p>© {year} VibeDev. Alla rättigheter förbehållna.</p>

          {/* TODO: lägg in riktigt org.nr + verifiera F-skatt */}
          <p className="hidden sm:block">
            {COMPANY.legalName}
            {COMPANY.orgNumber !== "XXXXXX-XXXX"
              ? ` · Org.nr ${COMPANY.orgNumber} · F-skatt godkänd`
              : " · Org.nr — se TODO i docs/POST_LAUNCH_CHECKLIST.md"}
          </p>

          <nav aria-label="Juridiska sidor">
            <ul className="flex items-center gap-4">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </Container>
    </footer>
  );
}
