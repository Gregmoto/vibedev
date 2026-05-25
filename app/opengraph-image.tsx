import { createOGImage, ogContentType, ogRuntime, ogSize } from "@/lib/seo/og-image";

export const runtime     = ogRuntime;
export const contentType = ogContentType;
export const size        = ogSize;

export default function OGImage() {
  return createOGImage("Apputveckling, AI & MVP i Stockholm");
}
