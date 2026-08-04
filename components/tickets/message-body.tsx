"use client";

import { useState } from "react";
import type { HtmlBlock } from "@/lib/tickets/html-body";
import { cn } from "@/lib/utils";

type MessageBodyProps = {
  /** Ren text. Används när mejlet saknar HTML, eller när HTML:en var tom. */
  text: string;
  /**
   * Mejlets HTML, redan nedbruten till en säker struktur på servern.
   * Parsningen ligger kvar där med flit — htmlparser2 hör inte hemma i
   * klientbundlen, och avsändarens HTML ska aldrig nå webbläsaren som HTML.
   */
  blocks?: HtmlBlock[] | null;
  /** Färger skiljer sig mellan adminpanelen och kundsidan. */
  fadeClassName?: string;
};

/* Nyhetsbrev och signaturtunga mejl blir tusentals tecken långa. Utan en gräns
   trycker ett enda sådant meddelande ner resten av tråden utom synhåll. */
const LONG_MESSAGE_CHARS = 900;

function blocksLength(blocks: HtmlBlock[]): number {
  return blocks.reduce(
    (total, block) => total + block.runs.reduce((sum, run) => sum + run.text.length, 0),
    0,
  );
}

export function MessageBody({ text, blocks, fadeClassName }: MessageBodyProps) {
  const [expanded, setExpanded] = useState(false);
  /* Bilder laddas först på begäran. En fjärrbild i ett mejl är lika ofta en
     spårpixel som innehåll — hämtar vi den automatiskt avslöjar vi att
     meddelandet lästs, när, och ungefär varifrån. */
  const [showImages, setShowImages] = useState(false);

  const hasImages = Boolean(blocks?.some((block) => block.runs.some((run) => run.image)));

  const useBlocks = Boolean(blocks && blocks.length > 0);
  const length = useBlocks ? blocksLength(blocks!) : text.length;

  const isLong = length > LONG_MESSAGE_CHARS;
  const collapsed = isLong && !expanded;

  return (
    <div className="mt-4">
      <div className={cn("relative", collapsed && "max-h-64 overflow-hidden")}>
        {useBlocks ? (
          <div className="space-y-2">
            {blocks!.map((block, blockIndex) => (
              <p
                key={blockIndex}
                className={cn(
                  "break-words text-sm leading-7",
                  block.heading ? "font-semibold text-text" : "text-text",
                )}
              >
                {block.runs.map((run, runIndex) =>
                  run.image ? (
                    showImages ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={runIndex}
                        src={run.image}
                        alt={run.text}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="my-1 inline-block max-h-64 max-w-full rounded-lg border border-white/10"
                      />
                    ) : (
                      <span key={runIndex} className="text-muted">
                        [{run.text}]{" "}
                      </span>
                    )
                  ) : run.href ? (
                    <a
                      key={runIndex}
                      href={run.href}
                      target="_blank"
                      // nofollow + noreferrer: adresser i inkommande mejl är
                      // opålitliga och ska varken ärva vår sidas rykte eller
                      // avslöja varifrån klicket kom.
                      rel="noopener noreferrer nofollow"
                      title={run.href}
                      className="text-brand underline underline-offset-2 transition hover:no-underline"
                    >
                      {run.text}
                    </a>
                  ) : (
                    <span key={runIndex}>{run.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        ) : (
          /*
            break-words krävs: spårningslänkar i marknadsmejl kan vara flera
            hundra tecken utan mellanslag, och ett sådant "ord" spränger annars
            kortets bredd och tvingar fram vågrät scroll i hela vyn.
          */
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-text">{text}</p>
        )}

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

      <div className="mt-2 flex flex-wrap items-center gap-4">
        {isLong ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-xs font-medium text-brand transition hover:underline"
          >
            {expanded ? "Visa mindre" : "Visa hela meddelandet"}
          </button>
        ) : null}

        {hasImages ? (
          <button
            type="button"
            onClick={() => setShowImages((value) => !value)}
            title={
              showImages
                ? undefined
                : "Bilder hämtas från avsändaren först när du visar dem."
            }
            className="text-xs font-medium text-brand transition hover:underline"
          >
            {showImages ? "Dölj bilder" : "Visa bilder"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
