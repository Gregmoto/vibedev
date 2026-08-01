import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Standardkonfig kör Next.js på Cloudflare Workers.
// Lägg till incrementalCache (R2) här om/när ISR (`revalidate`) börjar användas.
export default defineCloudflareConfig();
