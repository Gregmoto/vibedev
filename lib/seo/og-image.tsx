/**
 * Shared OG-image generator used by every opengraph-image.tsx route file.
 *
 * next/og renders JSX server-side into a PNG via @resvg/resvg-js (edge-compatible).
 * Consumers re-export `runtime`, `contentType`, and `size`, then call createOGImage().
 */

import { ImageResponse } from "next/og";

export const ogRuntime    = "edge" as const;
export const ogContentType = "image/png";
export const ogSize        = { width: 1200, height: 630 };

export function createOGImage(title: string, tagline?: string): ImageResponse {
  const subtitle = tagline ?? "Apputveckling, AI & MVP · Stockholm";
  const fontSize  = title.length > 55 ? 46 : title.length > 35 ? 54 : 62;

  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          flexDirection:   "column",
          width:           "100%",
          height:          "100%",
          backgroundColor: "#F8FAFC",
          padding:         "64px 72px",
          fontFamily:      "system-ui, -apple-system, sans-serif",
          position:        "relative",
          overflow:        "hidden",
        }}
      >
        {/* Decorative gradient orb — top-right */}
        <div
          style={{
            position:     "absolute",
            right:        -80,
            top:          -80,
            width:        420,
            height:       420,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
          }}
        />
        {/* Decorative gradient orb — bottom-left */}
        <div
          style={{
            position:     "absolute",
            left:         -60,
            bottom:       -60,
            width:        300,
            height:       300,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           10,
          }}
        >
          <div
            style={{
              width:           8,
              height:          28,
              backgroundColor: "#2563EB",
              borderRadius:    4,
            }}
          />
          <span
            style={{
              fontSize:      24,
              fontWeight:    800,
              color:         "#2563EB",
              letterSpacing: "-0.5px",
            }}
          >
            VibeDev
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display:    "flex",
            flex:       1,
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize,
              fontWeight:    800,
              color:         "#0F172A",
              lineHeight:    1.1,
              maxWidth:      900,
              margin:        0,
              letterSpacing: "-1.5px",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        14,
          }}
        >
          <div
            style={{
              width:           4,
              height:          32,
              backgroundColor: "#2563EB",
              borderRadius:    3,
            }}
          />
          <span
            style={{
              fontSize:   19,
              color:      "#64748B",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    ),
    { width: ogSize.width, height: ogSize.height },
  );
}
