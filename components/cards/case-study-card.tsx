import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CaseStudy } from "@/content/cases";

type CaseStudyCardProps = {
  item: CaseStudy;
};

export function CaseStudyCard({ item }: CaseStudyCardProps) {
  return (
    <Card className="h-full p-7">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="accent">{item.industry}</Badge>
      </div>
      <h3 className="heading-md mt-5 text-2xl">{item.projectName}</h3>
      <p className="body-md mt-3">{item.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {item.techStack.slice(0, 3).map((tech) => (
          <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <Link href={`/case-studies/${item.slug}`} className="text-sm font-medium text-brand transition hover:text-text">
          Se case study
        </Link>
      </div>
    </Card>
  );
}
