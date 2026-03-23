"use client";

import { useActionState } from "react";
import { ContentStatus, type CaseStudy, type Prisma } from "@prisma/client";
import { AdminCheckboxField } from "@/components/admin/admin-checkbox-field";
import { AdminFormFooter } from "@/components/admin/admin-form-footer";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import {
  createCaseStudyAction,
  type CaseStudyFormState,
  updateCaseStudyAction,
} from "@/lib/admin-case-study-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CaseStudyFormProps = {
  caseStudy?: CaseStudy;
};

const initialState: CaseStudyFormState = {};

function getLineContent(content: Prisma.JsonValue) {
  if (content && typeof content === "object" && !Array.isArray(content) && "items" in content) {
    const items = (content as { items?: unknown }).items;
    return Array.isArray(items) ? items.join("\n") : "";
  }

  return typeof content === "string" ? content : "";
}

export function CaseStudyForm({ caseStudy }: CaseStudyFormProps) {
  const boundAction = caseStudy ? updateCaseStudyAction.bind(null, caseStudy.id) : createCaseStudyAction;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-8" aria-busy={isPending}>
      <AdminFormLayout
        main={
          <div className="space-y-6">
            <AdminFormSection title="Case-innehåll" elevated>
              <Input name="title" label="Titel" placeholder="Nordfin Onboarding Platform" defaultValue={caseStudy?.title ?? ""} required />
              <Input name="slug" label="Slug" placeholder="nordfin-onboarding-platform" defaultValue={caseStudy?.slug ?? ""} required />
              <Input name="clientName" label="Client name" placeholder="Nordfin" defaultValue={caseStudy?.clientName ?? ""} />
              <Input name="industry" label="Industry" placeholder="Fintech" defaultValue={caseStudy?.industry ?? ""} required />
              <Textarea name="summary" label="Summary" placeholder="Kort sammanfattning av caset." defaultValue={caseStudy?.summary ?? ""} required />
              <Textarea name="problem" label="Problem" placeholder="Vilket kundproblem löste projektet?" defaultValue={caseStudy?.problem ?? ""} required />
              <Textarea name="solution" label="Solution" placeholder="Hur såg lösningen ut?" defaultValue={caseStudy?.solution ?? ""} required />
              <Textarea
                name="process"
                label="Process"
                placeholder="Ett steg per rad"
                defaultValue={caseStudy ? getLineContent(caseStudy.process) : ""}
                required
              />
              <Textarea
                name="results"
                label="Results"
                placeholder="Ett resultat per rad"
                defaultValue={caseStudy ? getLineContent(caseStudy.results) : ""}
                required
              />
            </AdminFormSection>

            <AdminFormSection title="SEO" description="SEO-fälten används både i metadata, sitemap och publika detaljsidor.">
              <Input name="seoTitle" label="SEO title" placeholder="SEO-optimerad titel" defaultValue={caseStudy?.seoTitle ?? ""} />
              <Textarea
                name="metaDescription"
                label="Meta description"
                placeholder="Kort beskrivning för sökresultat."
                defaultValue={caseStudy?.metaDescription ?? ""}
              />
              <Input name="ogTitle" label="Open Graph title" placeholder="Titel för social delning" defaultValue={caseStudy?.ogTitle ?? ""} />
              <Textarea
                name="ogDescription"
                label="Open Graph description"
                placeholder="Beskrivning för social delning."
                defaultValue={caseStudy?.ogDescription ?? ""}
              />
              <Input name="canonicalUrl" label="Canonical URL" placeholder="https://vibedev.se/case-studies/..." defaultValue={caseStudy?.canonicalUrl ?? ""} />
              <AdminCheckboxField
                name="noindex"
                label="Noindex"
                defaultChecked={caseStudy?.noindex ?? false}
                hint="Noindexade case tas bort från sitemap och får robots=index:false."
              />
            </AdminFormSection>
          </div>
        }
        aside={
          <>
            <AdminFormSection title="Publicering" elevated>
              <Select name="status" label="Status" defaultValue={caseStudy?.status ?? ContentStatus.DRAFT}>
                <option value={ContentStatus.DRAFT}>Utkast</option>
                <option value={ContentStatus.PUBLISHED}>Publicerad</option>
              </Select>
              <Input
                name="publishedAt"
                type="datetime-local"
                label="Publiceringsdatum"
                defaultValue={caseStudy?.publishedAt ? new Date(caseStudy.publishedAt).toISOString().slice(0, 16) : ""}
              />
            </AdminFormSection>

            <AdminFormSection title="Metadata">
              <Input name="techStack" label="Tech stack" placeholder="Next.js, TypeScript, Prisma" defaultValue={caseStudy?.techStack.join(", ") ?? ""} />
              <Input name="featuredImage" label="Featured image" placeholder="https://..." defaultValue={caseStudy?.featuredImage ?? ""} />
            </AdminFormSection>

            <AdminFormFooter
              isPending={isPending}
              submitLabel={caseStudy ? "Spara ändringar" : "Skapa case study"}
              pendingLabel="Sparar..."
              helperText="Utkast passar bra medan summary, resultat eller teknikstack fortfarande behöver finslipas."
              error={state.error}
              success={state.success}
            />
          </>
        }
      />
    </form>
  );
}
