import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = SharedProps & {
  href: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
  ghost: "button-ghost",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={cn(variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
}: LinkButtonProps) {
  return (
    <Link href={href} className={cn(variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </Link>
  );
}
