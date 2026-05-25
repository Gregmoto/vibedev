import { createOGImage } from "@/lib/seo/og-image";

export const runtime     = "edge";
export const contentType = "image/png";
export const size        = { width: 1200, height: 630 };

export default function OGImage() {
  return createOGImage(
    "Vibecoding: så bygger moderna team produkter med AI 2026",
    "Vibecoding · AI-assisterad utveckling · VibeDev",
  );
}
