import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CtaPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
  className?: string;
};

export function CtaPanel({ eyebrow, title, description, actions, className }: CtaPanelProps) {
  return (
    <div className={cn("surface-elevated px-6 py-12 sm:px-10 sm:py-14", className)}>
      <div className="max-w-3xl space-y-6">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading-lg text-balance">{title}</h2>
        <p className="body-lg">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
      </div>
    </div>
  );
}
