"use client";

import { useActionState } from "react";
import { ContentStatus, type PodcastEpisode, type Prisma } from "@prisma/client";
import { AdminCheckboxField } from "@/components/admin/admin-checkbox-field";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import {
  createPodcastEpisodeAction,
  type PodcastFormState,
  updatePodcastEpisodeAction,
} from "@/lib/admin-podcast-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PodcastEpisodeFormProps = {
  episode?: PodcastEpisode;
};

const initialState: PodcastFormState = {};

function getEditorContent(content: Prisma.JsonValue) {
  if (content && typeof content === "object" && !Array.isArray(content) && "markdown" in content) {
    const markdown = (content as { markdown?: unknown }).markdown;
    return typeof markdown === "string" ? markdown : "";
  }

  return typeof content === "string" ? content : "";
}

export function PodcastEpisodeForm({ episode }: PodcastEpisodeFormProps) {
  const boundAction = episode ? updatePodcastEpisodeAction.bind(null, episode.id) : createPodcastEpisodeAction;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Avsnittsinnehåll" elevated>
              <Input name="title" label="Titel" placeholder="Från idé till MVP utan att tappa fart" defaultValue={episode?.title ?? ""} required />
              <Input name="slug" label="Slug" placeholder="fran-ide-till-mvp-utan-att-tappa-fart" defaultValue={episode?.slug ?? ""} required />
              <Textarea
                name="description"
                label="Beskrivning"
                placeholder="Kort beskrivning av avsnittet."
                defaultValue={episode?.description ?? ""}
                required
              />
              <Textarea
                name="showNotes"
                label="Show notes"
                placeholder="Skriv show notes här. Enkel markdown eller vanlig text fungerar bra."
                defaultValue={episode ? getEditorContent(episode.showNotes) : ""}
                className="min-h-[320px]"
                required
              />
            </AdminFormSection>

            <AdminFormSection title="SEO" description="Tomma SEO-fält faller tillbaka till site settings.">
              <Input name="seoTitle" label="SEO title" placeholder="SEO-optimerad titel" defaultValue={episode?.seoTitle ?? ""} />
              <Textarea
                name="metaDescription"
                label="Meta description"
                placeholder="Kort beskrivning för sökresultat."
                defaultValue={episode?.metaDescription ?? ""}
              />
              <Input name="ogTitle" label="Open Graph title" placeholder="Titel för social delning" defaultValue={episode?.ogTitle ?? ""} />
              <Textarea
                name="ogDescription"
                label="Open Graph description"
                placeholder="Beskrivning för delning i sociala medier."
                defaultValue={episode?.ogDescription ?? ""}
              />
              <Input name="canonicalUrl" label="Canonical URL" placeholder="https://vibedev.se/podcast/..." defaultValue={episode?.canonicalUrl ?? ""} />
              <AdminCheckboxField
                name="noindex"
                label="Noindex"
                defaultChecked={episode?.noindex ?? false}
                hint="Hindrar sökmotorer från att indexera avsnittet."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection title="Publicering" elevated>
              <Select name="status" label="Status" defaultValue={episode?.status ?? ContentStatus.DRAFT}>
                <option value={ContentStatus.DRAFT}>Utkast</option>
                <option value={ContentStatus.PUBLISHED}>Publicerad</option>
              </Select>
              <Input
                name="publishedAt"
                type="datetime-local"
                label="Datum"
                defaultValue={episode?.publishedAt ? new Date(episode.publishedAt).toISOString().slice(0, 16) : ""}
              />
            </AdminFormSection>

            <AdminFormSection title="Avsnittsdata">
              <Input name="guestNames" label="Gäster" placeholder="Erik Sand, Maja Lindqvist" defaultValue={episode?.guestNames.join(", ") ?? ""} />
              <Input name="coverImage" label="Cover image" placeholder="https://..." defaultValue={episode?.coverImage ?? ""} />
              <Input name="audioUrl" label="Audio URL" placeholder="https://..." defaultValue={episode?.audioUrl ?? ""} />
              <Input name="embedUrl" label="Embed URL" placeholder="https://open.spotify.com/..." defaultValue={episode?.embedUrl ?? ""} />
            </AdminFormSection>

            <AdminFormFooter
              isPending={isPending}
              submitLabel={episode ? "Spara ändringar" : "Skapa avsnitt"}
              pendingLabel="Sparar..."
              helperText="Spara som utkast när avsnittet fortfarande saknar slutlig beskrivning, show notes eller embed-länk."
              error={state.error}
              success={state.success}
            />
          </>
        }
      />
    </form>
  );
}
