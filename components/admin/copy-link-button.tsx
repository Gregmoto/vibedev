"use client";

import { useEffect, useState } from "react";

type CopyLinkButtonProps = {
  /** Sökväg på sajten, t.ex. "/api/bihr/extended/tnk.csv". */
  path: string;
  label?: string;
};

/**
 * Kopierar hela adressen till urklipp.
 *
 * Sökvägen görs om till en fullständig URL först — det är den man vill klistra
 * in i ett importverktyg, inte en relativ sökväg. Origin läses i webbläsaren
 * så att den blir rätt oavsett om sidan körs lokalt eller i produktion.
 */
export function CopyLinkButton({ path, label = "Kopiera länk" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const url = `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Utklippsbehörighet kan nekas. Då markerar vi texten i stället så att
      // användaren kan kopiera själv i stället för att inget händer.
      window.prompt("Kopiera adressen:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${path}`}
      title={copied ? "Kopierad!" : label}
      className="shrink-0 rounded-md p-1 text-muted transition hover:bg-white/[0.06] hover:text-text"
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 text-brand"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
