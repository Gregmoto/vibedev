"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  /** Frågan som ställs innan formuläret skickas. */
  message: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Textlänk i stället för knapp — för täta tabeller där knappar tar för mycket bredd. */
  plain?: boolean;
};

/**
 * Skickar formuläret först efter ett ja. Används för åtgärder som inte går att
 * ångra — att radera ett ärende tar med sig hela tråden och alla bilagor, och i
 * en lista ligger knappen ett felklick från fel rad.
 */
export function ConfirmSubmitButton({
  children,
  message,
  variant = "secondary",
  size = "sm",
  className,
  plain = false,
}: ConfirmSubmitButtonProps) {
  const confirmFirst = (event: React.MouseEvent) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  if (plain) {
    return (
      <button
        type="submit"
        onClick={confirmFirst}
        className={cn(
          "whitespace-nowrap text-sm text-muted transition hover:text-warning",
          className,
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <Button type="submit" variant={variant} size={size} className={className} onClick={confirmFirst}>
      {children}
    </Button>
  );
}
