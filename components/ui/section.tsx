import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "tight" | "hero";
};

export function Section({ children, className = "", size = "default" }: SectionProps) {
  return (
    <section
      className={cn(
        "container-shell",
        size === "default" && "section-space",
        size === "tight" && "section-tight",
        size === "hero" && "pb-16 pt-20 sm:pb-24 sm:pt-28",
        className,
      )}
    >
      {children}
    </section>
  );
}
