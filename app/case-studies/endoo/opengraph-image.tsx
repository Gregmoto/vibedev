import { createOGImage } from "@/lib/seo/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export default function OGImage() {
  return createOGImage(
    "Endoo — hela ekonomin i ett system",
    "Fakturering · Order · Inköp · Bokföring · Beta Q3 2026",
  );
}
