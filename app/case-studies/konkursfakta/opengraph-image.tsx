import { createOGImage } from "@/lib/seo/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export default function OGImage() {
  return createOGImage(
    "Konkursfakta — öppet register över svenska konkurser",
    "Bolagsverket · PoIT · Tingsrätter · ~13 400 bolag · SSR + SEO",
  );
}
