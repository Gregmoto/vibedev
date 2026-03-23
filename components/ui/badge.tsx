import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "accent" | "neutral" | "success";
};

const toneClasses = {
  brand: "badge-base border-brand/25 bg-brand/10 text-brand",
  accent: "badge-base border-accent/25 bg-accent/10 text-accent",
  neutral: "badge-base border-white/10 bg-white/[0.04] text-muted",
  success: "badge-base border-success/25 bg-success/10 text-success",
};

export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return <span className={cn(toneClasses[tone], className)}>{children}</span>;
}
