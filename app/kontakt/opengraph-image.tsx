import { createOGImage } from "@/lib/seo/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export default function OGImage() { return createOGImage("Kontakta VibeDev — Begär offert eller boka samtal"); }
