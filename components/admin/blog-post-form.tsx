"use client";

import { useActionState } from "react";
import { ContentStatus, type BlogPost, type Prisma } from "@prisma/client";
import { AdminCheckboxField } from "@/components/admin/admin-checkbox-field";
import { AdminDateTimeField } from "@/components/admin/admin-date-time-field";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { createBlogPostAction, type BlogFormState, updateBlogPostAction } from "@/lib/admin-blog-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type BlogPostFormProps = {
  post?: BlogPost;
};

const initialState: BlogFormState = {};

function getEditorContent(content: Prisma.JsonValue) {
  if (content && typeof content === "object" && !Array.isArray(content) && "markdown" in content) {
    const markdown = (content as { markdown?: unknown }).markdown;
    return typeof markdown === "string" ? markdown : "";
  }

  return typeof content === "string" ? content : "";
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const boundAction = post ? updateBlogPostAction.bind(null, post.id) : createBlogPostAction;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const values = state.values;

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Grundinnehåll" elevated>
              <Input name="title" label="Titel" placeholder="Vad kostar det att bygga en app?" defaultValue={values?.title ?? post?.title ?? ""} required />
              <Input name="slug" label="Slug" placeholder="vad-kostar-det-att-bygga-en-app" defaultValue={values?.slug ?? post?.slug ?? ""} required />
              <Textarea
                name="excerpt"
                label="Excerpt"
                placeholder="Kort utdrag som används i bloggkort och metadata."
                defaultValue={values?.excerpt ?? post?.excerpt ?? ""}
                required
              />
              <Textarea
                name="content"
                label="Content"
                placeholder="Skriv innehållet här. Markdown eller enkel text fungerar bra i första versionen."
                defaultValue={values?.content ?? (post ? getEditorContent(post.content) : "")}
                className="min-h-[360px]"
                required
              />
            </AdminFormSection>

            <AdminFormSection title="SEO" description="Om fälten lämnas tomma används standardvärden från site settings.">
              <Input name="seoTitle" label="SEO title" placeholder="SEO-optimerad titel" defaultValue={values?.seoTitle ?? post?.seoTitle ?? ""} />
              <Textarea
                name="metaDescription"
                label="Meta description"
                placeholder="Kort beskrivning för sökresultat."
                defaultValue={values?.metaDescription ?? post?.metaDescription ?? ""}
              />
              <Input name="ogTitle" label="Open Graph title" placeholder="Titel för delning i sociala medier" defaultValue={values?.ogTitle ?? post?.ogTitle ?? ""} />
              <Textarea
                name="ogDescription"
                label="Open Graph description"
                placeholder="Beskrivning för social delning."
                defaultValue={values?.ogDescription ?? post?.ogDescription ?? ""}
              />
              <Input name="canonicalUrl" label="Canonical URL" placeholder="https://vibedev.se/blogg/..." defaultValue={values?.canonicalUrl ?? post?.canonicalUrl ?? ""} />
              <AdminCheckboxField
                name="noindex"
                label="Noindex"
                defaultChecked={values ? values.noindex : (post?.noindex ?? false)}
                hint="Använd om sidan inte ska indexeras i sökmotorer."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection title="Publicering" elevated>
              <Select name="status" label="Status" defaultValue={values?.status ?? post?.status ?? ContentStatus.DRAFT}>
                <option value={ContentStatus.DRAFT}>Utkast</option>
                <option value={ContentStatus.PUBLISHED}>Publicerad</option>
              </Select>
              <AdminDateTimeField
                name="publishedAt"
                label="Publiceringsdatum"
                defaultValue={values?.publishedAt ?? (post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "")}
              />
            </AdminFormSection>

            <AdminFormSection title="Metadata">
              <Input name="featuredImage" label="Featured image" placeholder="https://..." defaultValue={values?.featuredImage ?? post?.featuredImage ?? ""} />
              <Input name="author" label="Författare" placeholder="VibeDev" defaultValue={values?.author ?? post?.author ?? ""} />
              <Input name="category" label="Kategori" placeholder="Apputveckling" defaultValue={values?.category ?? post?.category ?? ""} required />
              <Input name="tags" label="Taggar" placeholder="app, budget, strategi" defaultValue={values?.tags ?? post?.tags.join(", ") ?? ""} />
            </AdminFormSection>

            <AdminFormFooter
              isPending={isPending}
              submitLabel={post ? "Spara ändringar" : "Skapa blogginlägg"}
              pendingLabel="Sparar..."
              helperText="Innehållet sparas med valt statusläge. Välj utkast för att fortsätta arbeta innan publicering."
              error={state.error}
              success={state.success}
            />
          </>
        }
      />
    </form>
  );
}
