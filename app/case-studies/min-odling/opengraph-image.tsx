import { createOGImage } from "@/lib/seo/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export default function OGImage() {
  return createOGImage(
    "Min Odling — appen som används året runt",
    "AI-växtidentifiering · Odlingskalender · Community för svenska zoner",
  );
}
