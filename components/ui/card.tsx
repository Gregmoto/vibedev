import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
};

const variantClasses = {
  default: "card-base",
  elevated: "surface-elevated p-6",
  outlined: "rounded-3xl border border-line bg-transparent p-6 transition hover:border-lineStrong",
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return <div className={cn(variantClasses[variant], className)}>{children}</div>;
}
