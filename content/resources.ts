export type ResourceSource =
  | "mvp-checklist"
  | "vibecoding-guide"
  | "ai-decision-model"
  | "newsletter"
  | "podcast-newsletter";

export type Resource = {
  /** Matches the ResourceSource union — passed as hidden form field */
  source: Exclude<ResourceSource, "newsletter">;
  title: string;
  description: string;
  /** Human-readable format label, e.g. "PDF" */
  format: string;
  pageCount: number;
};

export const resources: Resource[] = [
  {
    source: "mvp-checklist",
    title: "MVP-checklistan för founders",
    description:
      "20-punkts checklista för vad som måste vara på plats innan ni börjar bygga er MVP. Skopa-frågor, teknikval, lanseringsförberedelser.",
    format: "PDF",
    pageCount: 8,
  },
  {
    source: "vibecoding-guide",
    title: "Vibecoding-guiden 2026",
    description:
      "Så använder vårt team AI i kodflödet för att bygga produkter på halva tiden. Verktyg, workflows, vanliga misstag.",
    format: "PDF",
    pageCount: 14,
  },
  {
    source: "ai-decision-model",
    title: "När passar AI i en digital produkt?",
    description:
      "En enkel beslutsmodell för att avgöra om AI faktiskt tillför värde i just ert case — eller om det bara blir kostsam demoeffekt.",
    format: "PDF",
    pageCount: 6,
  },
];
