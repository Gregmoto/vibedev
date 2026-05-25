import { createOGImage, ogContentType, ogRuntime, ogSize } from "@/lib/seo/og-image";
export const runtime = ogRuntime; export const contentType = ogContentType; export const size = ogSize;
export default function OGImage() { return createOGImage("Boka kostnadsfritt strategisamtal", "Gratis · 20 min · Ingen förbindelse"); }
