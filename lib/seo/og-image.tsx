/**
 * Shared OG-image generator used by every opengraph-image.tsx route file.
 *
 * Layout: gradient background (brand → sky) with V-mark + wordmark on the left
 * and the page title/tagline on the right.
 */

import { ImageResponse } from "next/og";

export const ogRuntime     = "edge" as const;
export const ogContentType = "image/png";
export const ogSize        = { width: 1200, height: 630 };

/* ── V-mark path (same geometry as public/logo-mark.svg) ─────────────────────── */

function VMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M2 3 L13 3 L22 33 L31 3 L42 3 L22 43 Z" fill="white" />
    </svg>
  );
}

/* ── Main generator ──────────────────────────────────────────────────────────── */

export function createOGImage(title: string, tagline?: string): ImageResponse {
  const subtitle  = tagline ?? "Apputveckling · AI · MVP — Stockholm";
  const titleSize = title.length > 55 ? 44 : title.length > 38 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          display:        "flex",
          width:          "100%",
          height:         "100%",
          position:       "relative",
          overflow:       "hidden",
          fontFamily:     "system-ui, -apple-system, sans-serif",
          background:     "linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #0EA5E9 100%)",
        }}
      >
        {/* ── Geometric decorations ──────────────────────────────────────── */}
        {/* Large circle — top right */}
        <div
          style={{
            position:     "absolute",
            right:        -120,
            top:          -120,
            width:        560,
            height:       560,
            borderRadius: "50%",
            border:       "1.5px solid rgba(255,255,255,0.12)",
            display:      "flex",
          }}
        />
        {/* Medium circle — bottom left */}
        <div
          style={{
            position:     "absolute",
            left:         -80,
            bottom:       -80,
            width:        380,
            height:       380,
            borderRadius: "50%",
            border:       "1.5px solid rgba(255,255,255,0.08)",
            display:      "flex",
          }}
        />
        {/* Small accent — top left */}
        <div
          style={{
            position:     "absolute",
            left:         260,
            top:          40,
            width:        120,
            height:       120,
            borderRadius: "50%",
            border:       "1px solid rgba(255,255,255,0.07)",
            display:      "flex",
          }}
        />

        {/* ── Left panel: Logo ──────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            alignItems:     "flex-start",
            width:          340,
            padding:        "64px 48px 64px 64px",
            borderRight:    "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <VMark size={80} />
          <div
            style={{
              display:       "flex",
              marginTop:     20,
              fontSize:      42,
              fontWeight:    800,
              color:         "white",
              letterSpacing: "-1.5px",
              lineHeight:    1,
            }}
          >
            VibeDev
          </div>
          <div
            style={{
              display:       "flex",
              marginTop:     12,
              fontSize:      14,
              color:         "rgba(255,255,255,0.6)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            vibedev.se
          </div>
        </div>

        {/* ── Right panel: Title + tagline ──────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            flex:           1,
            padding:        "64px 72px",
          }}
        >
          <div
            style={{
              display:       "flex",
              fontSize:      titleSize,
              fontWeight:    800,
              color:         "white",
              lineHeight:    1.12,
              letterSpacing: "-1.5px",
              maxWidth:      740,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display:       "flex",
              marginTop:     24,
              fontSize:      22,
              color:         "rgba(255,255,255,0.75)",
              lineHeight:    1.5,
              maxWidth:      640,
              letterSpacing: "-0.2px",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    { width: ogSize.width, height: ogSize.height },
  );
}
