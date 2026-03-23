import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
};

const sizeClasses = {
  default: "container-shell",
  wide: "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8",
  narrow: "mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8",
};

export function Container({ children, className, size = "default" }: ContainerProps) {
  return <div className={cn(sizeClasses[size], className)}>{children}</div>;
}
