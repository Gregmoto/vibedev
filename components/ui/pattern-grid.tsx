import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PatternGridProps = {
  children: ReactNode;
  columns?: "2" | "3" | "4";
  className?: string;
};

const columnClasses = {
  "2": "grid gap-6 md:grid-cols-2",
  "3": "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
  "4": "grid gap-6 md:grid-cols-2 xl:grid-cols-4",
};

export function PatternGrid({ children, columns = "3", className }: PatternGridProps) {
  return <div className={cn(columnClasses[columns], className)}>{children}</div>;
}
