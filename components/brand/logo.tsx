/**
 * Inline SVG brand components — font is live from the page so Space Grotesk
 * renders correctly unlike static <img src="/logo.svg">.
 *
 * LogoMark  — V-symbol only (favicon, mobile nav, tight spaces)
 * LogoFull  — V-symbol + "VibeDev" wordmark (desktop nav, footer)
 * LogoWhite — full white variant (dark backgrounds, OG footer)
 */

/* ── V-mark ──────────────────────────────────────────────────────────────────── */

export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 44 44"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="VibeDev"
      role="img"
    >
      <defs>
        <linearGradient id="vd-mark" x1="2" y1="3" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path d="M2 3 L13 3 L22 33 L31 3 L42 3 L22 43 Z" fill="url(#vd-mark)" />
    </svg>
  );
}

/* ── Full wordmark (light bg) ────────────────────────────────────────────────── */

export function LogoFull({ className, height = 36 }: { className?: string; height?: number }) {
  const w = Math.round((176 / 44) * height);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 176 44"
      fill="none"
      width={w}
      height={height}
      className={className}
      aria-label="VibeDev"
      role="img"
    >
      <defs>
        <linearGradient id="vd-full" x1="2" y1="3" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path d="M2 3 L13 3 L22 33 L31 3 L42 3 L22 43 Z" fill="url(#vd-full)" />
      <text
        x="56"
        y="31"
        fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="-0.5"
      >
        <tspan fill="#0F172A">Vibe</tspan>
        <tspan fill="#2563EB">Dev</tspan>
      </text>
    </svg>
  );
}

/* ── Full wordmark (white — dark bg) ─────────────────────────────────────────── */

export function LogoWhite({ className, height = 36 }: { className?: string; height?: number }) {
  const w = Math.round((176 / 44) * height);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 176 44"
      fill="none"
      width={w}
      height={height}
      className={className}
      aria-label="VibeDev"
      role="img"
    >
      <path d="M2 3 L13 3 L22 33 L31 3 L42 3 L22 43 Z" fill="white" />
      <text
        x="56"
        y="31"
        fill="white"
        fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="-0.5"
      >
        VibeDev
      </text>
    </svg>
  );
}
