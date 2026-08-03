"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MessageBodyProps = {
  text: string;
  /** Färger skiljer sig mellan adminpanelen och kundsidan. */
  fadeClassName?: string;
};

/* Nyhetsbrev och signaturtunga mejl blir tusentals tecken långa. Utan en gräns
   trycker ett enda sådant meddelande ner resten av tråden utom synhåll. */
const LONG_MESSAGE_CHARS = 900;

export function MessageBody({ text, fadeClassName }: MessageBodyProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > LONG_MESSAGE_CHARS;
  const collapsed = isLong && !expanded;

  return (
    <div className="mt-4">
      <div className={cn("relative", collapsed && "max-h-64 overflow-hidden")}>
        {/*
          break-words krävs: spårningslänkar i marknadsmejl kan vara flera
          hundra tecken utan mellanslag, och ett sådant "ord" spränger annars
          kortets bredd och tvingar fram vågrät scroll i hela vyn.
        */}
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-text">{text}</p>

        {collapsed ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent",
              fadeClassName ?? "from-panelElevated",
            )}
          />
        ) : null}
      </div>

      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-xs font-medium text-brand transition hover:underline"
        >
          {expanded ? "Visa mindre" : "Visa hela meddelandet"}
        </button>
      ) : null}
    </div>
  );
}
