import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { StickyCta } from "@/components/layout/sticky-cta";
import { createMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/schema";
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

const bodyFont = Manrope({
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
              organizationSchema({
                siteName: settings.siteName,
                siteUrl: settings.siteUrl,
                email: settings.contactEmail || undefined,
              }),
              websiteSchema({
                siteName: settings.siteName,
                siteUrl: settings.siteUrl,
              }),
            ]),
          }}
        />
        {/* Dynamic global scripts from database-backed settings */}
        <AnalyticsScripts settings={settings} />
        <Navbar siteName={settings.siteName} />
        <main id="main-content">{children}</main>
        <Footer settings={settings} />
        <StickyCta />
      </body>
    </html>
  );
}

function AnalyticsScripts({ settings }: { settings: Awaited<ReturnType<typeof getResolvedSiteSettings>> }) {
  if (settings.ga4CustomScript) {
    return (
      <Script
        id="ga4-custom-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: settings.ga4CustomScript }}
      />
    );
  }

  if (!settings.ga4MeasurementId) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4MeasurementId}`} strategy="afterInteractive" />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.ga4MeasurementId}');
          `,
        }}
      />
    </>
  );
}
