"use client";

import { useActionState } from "react";
import { ContentStatus, type BlogPost, type Prisma } from "@prisma/client";
import { AdminCheckboxField } from "@/components/admin/admin-checkbox-field";
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

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Grundinnehåll" elevated>
              <Input name="title" label="Titel" placeholder="Vad kostar det att bygga en app?" defaultValue={post?.title ?? ""} required />
              <Input name="slug" label="Slug" placeholder="vad-kostar-det-att-bygga-en-app" defaultValue={post?.slug ?? ""} required />
              <Textarea
                name="excerpt"
                label="Excerpt"
                placeholder="Kort utdrag som används i bloggkort och metadata."
                defaultValue={post?.excerpt ?? ""}
                required
              />
              <Textarea
                name="content"
                label="Content"
                placeholder="Skriv innehållet här. Markdown eller enkel text fungerar bra i första versionen."
                defaultValue={post ? getEditorContent(post.content) : ""}
                className="min-h-[360px]"
                required
              />
            </AdminFormSection>

            <AdminFormSection title="SEO" description="Om fälten lämnas tomma används standardvärden från site settings.">
              <Input name="seoTitle" label="SEO title" placeholder="SEO-optimerad titel" defaultValue={post?.seoTitle ?? ""} />
              <Textarea
                name="metaDescription"
                label="Meta description"
                placeholder="Kort beskrivning för sökresultat."
                defaultValue={post?.metaDescription ?? ""}
              />
              <Input name="ogTitle" label="Open Graph title" placeholder="Titel för delning i sociala medier" defaultValue={post?.ogTitle ?? ""} />
              <Textarea
                name="ogDescription"
                label="Open Graph description"
                placeholder="Beskrivning för social delning."
                defaultValue={post?.ogDescription ?? ""}
              />
              <Input name="canonicalUrl" label="Canonical URL" placeholder="https://vibedev.se/blogg/..." defaultValue={post?.canonicalUrl ?? ""} />
              <AdminCheckboxField
                name="noindex"
                label="Noindex"
                defaultChecked={post?.noindex ?? false}
                hint="Använd om sidan inte ska indexeras i sökmotorer."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection title="Publicering" elevated>
              <Select name="status" label="Status" defaultValue={post?.status ?? ContentStatus.DRAFT}>
                <option value={ContentStatus.DRAFT}>Utkast</option>
                <option value={ContentStatus.PUBLISHED}>Publicerad</option>
              </Select>
              <Input
                name="publishedAt"
                type="datetime-local"
                label="Publiceringsdatum"
                defaultValue={post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""}
              />
            </AdminFormSection>

            <AdminFormSection title="Metadata">
              <Input name="featuredImage" label="Featured image" placeholder="https://..." defaultValue={post?.featuredImage ?? ""} />
              <Input name="author" label="Författare" placeholder="VibeDev" defaultValue={post?.author ?? ""} />
              <Input name="category" label="Kategori" placeholder="Apputveckling" defaultValue={post?.category ?? ""} required />
              <Input name="tags" label="Taggar" placeholder="app, budget, strategi" defaultValue={post?.tags.join(", ") ?? ""} />
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
