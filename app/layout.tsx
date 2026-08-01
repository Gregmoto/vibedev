import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SiteChrome } from "@/components/layout/site-chrome";
import { StickyCta } from "@/components/layout/sticky-cta";
import { StickyMobileCta } from "@/components/conversion/sticky-mobile-cta";
import { createMetadata } from "@/lib/metadata";
import { websiteSchema } from "@/lib/schema";
import { getLocalBusinessSchema, getOrganizationSchema } from "@/lib/seo/jsonld";
import {
  getResolvedSiteSettings,
  parseSearchConsoleVerification,
} from "@/lib/site-settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResolvedSiteSettings();
  const title = settings.defaultSeoTitle || settings.siteName;
  const description = settings.defaultMetaDescription || undefined;
  const siteUrl = settings.siteUrl;

  const metadata = createMetadata(title, description, "/");
  const verification = parseSearchConsoleVerification(settings.googleSearchConsoleVerification);

  return {
    ...metadata,
    metadataBase: new URL(siteUrl),
    verification: verification
      ? {
          google: verification,
        }
      : undefined,
  };
}

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getResolvedSiteSettings();

  return (
    <html lang="sv">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-bg text-text antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Hoppa till innehåll
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              getOrganizationSchema({
                siteName:     settings.siteName,
                siteUrl:      settings.siteUrl,
                socialLinks:  settings.socialLinks,
                contactEmail: settings.contactEmail,
                phone:        settings.phone,
              }),
              getLocalBusinessSchema({
                siteName:     settings.siteName,
                siteUrl:      settings.siteUrl,
                socialLinks:  settings.socialLinks,
                contactEmail: settings.contactEmail,
                phone:        settings.phone,
              }),
              websiteSchema({
                siteName: settings.siteName,
                siteUrl:  settings.siteUrl,
              }),
            ]),
          }}
        />
        {/* GA4 laddas först efter cookie-samtycke — bannern hanterar valet.
            Varken adminpanelen eller kundens ärendesida spåras: där finns inget
            att mäta, och en supporttråd hör inte hemma i webbanalysen. */}
        <SiteChrome>
          <CookieConsent
            ga4MeasurementId={settings.ga4MeasurementId}
            ga4CustomScript={settings.ga4CustomScript}
          />
        </SiteChrome>
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main id="main-content">{children}</main>
        <SiteChrome>
          <Footer />
          <StickyCta />
          <StickyMobileCta />
        </SiteChrome>
      </body>
    </html>
  );
}

