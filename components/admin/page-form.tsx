"use client";

import { useActionState } from "react";
import { ContentStatus, type Page, type Prisma } from "@prisma/client";
import { AdminCheckboxField } from "@/components/admin/admin-checkbox-field";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { createPageAction, type PageFormState, updatePageAction } from "@/lib/admin-page-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PageFormProps = {
  page?: Page;
};

const initialState: PageFormState = {};

function getEditorContent(content: Prisma.JsonValue) {
  if (content && typeof content === "object" && !Array.isArray(content) && "markdown" in content) {
    const markdown = (content as { markdown?: unknown }).markdown;
    return typeof markdown === "string" ? markdown : "";
  }

  return typeof content === "string" ? content : "";
}

export function PageForm({ page }: PageFormProps) {
  const boundAction = page ? updatePageAction.bind(null, page.id) : createPageAction;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Sidinnehåll" elevated>
              <Input name="title" label="Title" placeholder="Startsida" defaultValue={page?.title ?? ""} required />
              <Input name="slug" label="Slug" placeholder="/om-oss" defaultValue={page?.slug ?? ""} required />
              <Textarea name="intro" label="Intro" placeholder="Kort introtext för sidan." defaultValue={page?.intro ?? ""} />
              <Textarea
                name="content"
                label="Content"
                placeholder="Skriv innehållet här. Enkel markdown eller vanlig text fungerar bra."
                defaultValue={page ? getEditorContent(page.content) : ""}
                className="min-h-[360px]"
                required
              />
            </AdminFormSection>

            <AdminFormSection title="SEO" description="Om du lämnar fälten tomma används standard-SEO från site settings.">
              <Input name="seoTitle" label="SEO title" placeholder="SEO-optimerad titel" defaultValue={page?.seoTitle ?? ""} />
              <Textarea
                name="metaDescription"
                label="Meta description"
                placeholder="Kort beskrivning för sökresultat."
                defaultValue={page?.metaDescription ?? ""}
              />
              <Input name="ogTitle" label="Open Graph title" placeholder="Titel för social delning" defaultValue={page?.ogTitle ?? ""} />
              <Textarea
                name="ogDescription"
                label="Open Graph description"
                placeholder="Beskrivning för social delning."
                defaultValue={page?.ogDescription ?? ""}
              />
              <Input name="canonicalUrl" label="Canonical URL" placeholder="https://vibedev.se/..." defaultValue={page?.canonicalUrl ?? ""} />
              <AdminCheckboxField
                name="noindex"
                label="Noindex"
                defaultChecked={page?.noindex ?? false}
                hint="Bra för interna, temporära eller kampanjspecifika sidor."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection title="Status" elevated>
              <Select name="status" label="Status" defaultValue={page?.status ?? ContentStatus.DRAFT}>
                <option value={ContentStatus.DRAFT}>Utkast</option>
                <option value={ContentStatus.PUBLISHED}>Publicerad</option>
              </Select>
            </AdminFormSection>

            <AdminFormFooter
              isPending={isPending}
              submitLabel={page ? "Spara ändringar" : "Skapa sida"}
              pendingLabel="Sparar..."
              helperText="Publicerade sidor kan användas direkt i frontendens metadataflöde och sitemap."
              error={state.error}
              success={state.success}
            />
          </>
        }
      />
    </form>
  );
}
