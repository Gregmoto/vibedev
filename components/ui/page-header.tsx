import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("page-hero border-b border-white/5", className)}>
      <Container className="pb-12 pt-20 sm:pb-16 sm:pt-28">
        <div className="surface-elevated max-w-4xl space-y-6 px-6 py-10 sm:px-10 sm:py-12">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {badge ? <Badge tone="accent">{badge}</Badge> : null}
          <h1 className="heading-xl max-w-3xl text-balance">{title}</h1>
          <p className="body-lg max-w-2xl">{description}</p>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
