import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="heading-lg text-balance">{title}</h2>
      {description ? <p className="body-lg max-w-2xl">{description}</p> : null}
      {actions ? <div className={cn("flex gap-3", align === "center" && "justify-center")}>{actions}</div> : null}
    </div>
  );
}
