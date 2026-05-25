import { createOGImage, ogContentType, ogRuntime, ogSize } from "@/lib/seo/og-image";
export const runtime = ogRuntime; export const contentType = ogContentType; export const size = ogSize;
export default function OGImage() { return createOGImage("Vibecoding: så bygger moderna team produkter med AI 2026", "Vibecoding · AI-assisterad utveckling · VibeDev"); }
