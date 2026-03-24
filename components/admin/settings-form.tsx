"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { saveSiteSettingsAction, type SettingsFormState } from "@/lib/admin-settings-actions";
import { formatSocialLinks } from "@/lib/site-settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SettingsFormProps = {
  settings: SiteSettings | null;
};

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(saveSiteSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Webbplats" elevated>
              <Input name="siteName" label="Site name" placeholder="VibeDev" defaultValue={settings?.siteName ?? "VibeDev"} required />
              <Input name="siteUrl" label="Site URL" placeholder="https://vibedev.se" defaultValue={settings?.siteUrl ?? "https://vibedev.se"} required />
              <Input name="contactEmail" label="Kontaktmail" placeholder="hello@vibedev.se" defaultValue={settings?.contactEmail ?? ""} />
              <Input name="phone" label="Telefon" placeholder="+46 70 123 45 67" defaultValue={settings?.phone ?? ""} />
              <Textarea name="address" label="Adress" placeholder="Stockholm, Sverige" defaultValue={settings?.address ?? ""} />
              <Textarea name="footerText" label="Footer text" placeholder="Kort text för footer." defaultValue={settings?.footerText ?? ""} />
              <Textarea
                name="socialLinks"
                label="Social links"
                placeholder={"LinkedIn | https://linkedin.com/company/vibedev\nX | https://x.com/vibedev"}
                defaultValue={formatSocialLinks(settings?.socialLinks)}
                hint="En länk per rad i formatet Label | URL."
              />
            </AdminFormSection>

            <AdminFormSection title="Standard-SEO" description="Används som fallback när innehåll saknar egna SEO-fält.">
              <Input name="defaultSeoTitle" label="Default SEO title" placeholder="VibeDev" defaultValue={settings?.defaultSeoTitle ?? ""} />
              <Textarea
                name="defaultMetaDescription"
                label="Default meta description"
                placeholder="Standardbeskrivning för sajten."
                defaultValue={settings?.defaultMetaDescription ?? ""}
              />
              <Textarea
                name="googleSearchConsoleVerification"
                label="Google Search Console verification"
                placeholder="google-site-verification=... eller bara verifieringskoden"
                defaultValue={settings?.googleSearchConsoleVerification ?? ""}
                hint="Du kan ange hela meta-taggen eller bara verifieringskoden."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection
              title="Analytics"
              elevated
              description="Measurement ID laddar standard-GA4. Custom script prioriteras om båda finns."
            >
              <Input name="ga4MeasurementId" label="GA4 Measurement ID" placeholder="G-XXXXXXXXXX" defaultValue={settings?.ga4MeasurementId ?? ""} />
              <Textarea
                name="ga4CustomScript"
                label="GA4 custom script"
                placeholder="window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} ..."
                defaultValue={settings?.ga4CustomScript ?? ""}
                className="min-h-[220px]"
                hint="Endast begränsad GA4/gtag-kod tillåts. Script-taggar och godtycklig JavaScript-blockeras."
              />
            </AdminFormSection>

            <AdminFormFooter
              isPending={isPending}
              submitLabel="Spara inställningar"
              pendingLabel="Sparar..."
              helperText="GA4 och Search Console används globalt i layouten, metadataflödet och robots/sitemap där det är relevant."
              error={state.error}
              success={state.success}
            />
          </>
        }
      />
    </form>
  );
}
