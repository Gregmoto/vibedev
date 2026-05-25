import { createOGImage, ogContentType, ogRuntime, ogSize } from "@/lib/seo/og-image";
export const runtime = ogRuntime; export const contentType = ogContentType; export const size = ogSize;
export default function OGImage() { return createOGImage("Kontakta VibeDev — Begär offert eller boka samtal"); }
