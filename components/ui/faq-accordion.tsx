"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className="surface overflow-hidden">
            <button
              type="button"
              className="interactive-outline flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-text sm:text-lg">{item.question}</span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-lg text-muted transition",
                  isOpen && "rotate-45 border-brand/30 text-brand",
                )}
              >
                +
              </span>
            </button>
            {isOpen ? <div className="px-6 pb-6 text-sm leading-7 text-muted sm:text-base">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
