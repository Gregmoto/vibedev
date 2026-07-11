import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Löser upp Postgres-anslutningen i prioritetsordning:
 *   1. Cloudflare Hyperdrive-binding (produktion på Workers + `wrangler dev`)
 *   2. Rå DATABASE_URL (lokal `next dev` och `next build`)
 * getCloudflareContext() saknas under `next build`, därför try/catch.
 */
function resolveConnectionString(): string | undefined {
  try {
    const { env } = getCloudflareContext();
    const cs = env?.HYPERDRIVE?.connectionString;
    if (cs && !cs.includes("REPLACE_")) {
      return cs;
    }
  } catch {
    // Ingen Cloudflare-context (t.ex. build-tid) — fall tillbaka på DATABASE_URL nedan.
  }
  return process.env.DATABASE_URL?.trim() || undefined;
}

/** True om någon databasanslutning (Hyperdrive eller DATABASE_URL) är tillgänglig. */
export function hasDatabase(): boolean {
  return Boolean(resolveConnectionString());
}

/**
 * Skapar en Prisma-klient PER REQUEST (React cache() dedupar inom samma request).
 * På Cloudflare Workers får en anslutningspool inte återanvändas mellan requests —
 * därför ny klient per request och maxUses: 1 på adaptern.
 */
export const getDb = cache((): PrismaClient => {
  const connectionString = resolveConnectionString();
  if (!connectionString) {
    throw new Error(
      "Ingen databasanslutning tillgänglig — varken Cloudflare Hyperdrive (HYPERDRIVE) eller DATABASE_URL är satt.",
    );
  }
  const adapter = new PrismaPg({ connectionString, maxUses: 1 });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
});

/**
 * Bakåtkompatibel proxy som bevarar `import { db } from "@/lib/db"`-API:t i alla
 * anropsställen. Varje åtkomst löser upp request-klienten via getDb(). Metoder bind:as
 * till klienten så att `db.model.action()` och `db.$transaction()` fungerar oförändrat.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
