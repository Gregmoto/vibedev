/**
 * Tunn wrapper runt GA4:s gtag. Skickar bara händelser om gtag faktiskt finns —
 * dvs. när besökaren har godkänt statistik-cookies (annars laddas aldrig gtag).
 * Utan samtycke blir anropet en no-op, vilket är det GDPR-korrekta beteendet.
 */

declare global {
  interface Window {
    gtag?: (command: string, ...params: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params ?? {});
  }
}
