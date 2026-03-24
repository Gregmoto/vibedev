import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { navigation } from "@/content/navigation";
import type { ResolvedSiteSettings } from "@/lib/site-settings";

type FooterProps = {
  settings: ResolvedSiteSettings;
};

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-black/10">
      <Container className="section-tight">
        <div className="surface-elevated mb-8 grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">Redo att bygga</p>
            <h2 className="heading-md max-w-xl text-balance">
              Behöver ni en partner som kan ta er från idé till lanserad produkt.
            </h2>
            <p className="body-md max-w-2xl">
              VibeDev hjälper team att definiera scope, designa rätt upplevelse och bygga skalbara appar,
              webbappar och AI-funktioner utan onödig byråtröghet.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col lg:items-start">
            <LinkButton href="/boka-mote">Boka möte</LinkButton>
            <LinkButton href="/kontakt" variant="secondary">
              Kontakta oss
            </LinkButton>
          </div>
        </div>

        <div className="grid gap-12 border-t border-white/5 pt-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                VD
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-text">{settings.siteName}</p>
                <p className="text-xs text-muted">{settings.siteUrl.replace(/^https?:\/\//, "")}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted">
              {settings.footerText}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-text">Navigation</p>
            <div className="grid gap-3">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-text">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-text">Kontakt</p>
            <div className="space-y-3 text-sm text-muted">
              {settings.contactEmail ? <p>{settings.contactEmail}</p> : null}
              {settings.phone ? <p>{settings.phone}</p> : null}
              {settings.address ? <p>{settings.address}</p> : null}
              {settings.socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {settings.socialLinks.map((link) => (
                    <Link
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition hover:text-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              <Link href="/kontakt" className="text-brand transition hover:text-text">
                Skicka förfrågan
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
