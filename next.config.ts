import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // Talar om för webbläsaren att aldrig ens försöka http igen.
            // Ett år, inklusive underdomäner.
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  // @prisma/client + .prisma/client måste vara externa så att OpenNext kan patcha den
  // genererade klienten för workerd. pg/adaptern använder Node-built-ins (net/dns/fs)
  // och lämnas som externa require() — resolvas vid runtime via nodejs_compat.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "pg-cloudflare",
  ],
};

export default nextConfig;

// Obs: initOpenNextCloudflareForDev() används medvetet INTE här. På den deployade
// Workern kopplas getCloudflareContext() (och Hyperdrive) in automatiskt av OpenNext.
// Lokalt (next dev) saknas contexten och lib/db.ts faller tillbaka på DATABASE_URL,
// vilket gör lokal utveckling enkel utan att kräva en lokal Hyperdrive-anslutning.
// För att testa den riktiga Worker-runtimen lokalt: använd `npm run preview:cf`.
