/**
 * In-memory rate limiter — fungerar för MVP/single-server.
 * Byt till Redis (t.ex. @upstash/ratelimit) för multi-instance produktionssättning.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  contactRateLimit: Map<string, RateLimitEntry> | undefined;
};

const store: Map<string, RateLimitEntry> =
  globalForRateLimit.contactRateLimit ?? new Map();

if (!globalForRateLimit.contactRateLimit) {
  globalForRateLimit.contactRateLimit = store;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export function checkRateLimit(
  key: string,
  maxRequests = 3,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  store.set(key, { count: entry.count + 1, resetAt: entry.resetAt });
  return { allowed: true };
}
