import { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "tight" | "hero";
  id?: string;
  as?: "section" | "div" | "article";
};

export function Section({ children, className = "", size = "default", id, as = "section" }: SectionProps) {
  const Tag = as;

  return (
    <Tag id={id}>
      <Container
        className={cn(
          size === "default" && "section-space",
          size === "tight" && "section-tight",
          size === "hero" && "pb-16 pt-20 sm:pb-24 sm:pt-28",
          className,
        )}
      >
        {children}
      </Container>
    </Tag>
  );
}
