import { db } from "@/lib/db";

/**
 * Tar emot resultatet av en körning från feed-workern.
 *
 * Workern har ingen databasanslutning — den kör i en egen Worker utan
 * Hyperdrive-binding — så den rapporterar hit i stället. Endpointen är skyddad
 * med samma hemlighet som triggar körningarna.
 */

export const dynamic = "force-dynamic";

/* Bara de 50 senaste sparas. Äldre rader säger inget som inte redan syns i
   filen som ligger i R2, och tabellen ska inte växa obegränsat. */
const KEEP_RUNS = 50;

export async function POST(request: Request) {
  const secret = process.env.BIHR_TRIGGER_SECRET;

  if (!secret || request.headers.get("x-bihr-secret") !== secret) {
    return new Response("Not found", { status: 404 });
  }

  const payload = (await request.json()) as {
    kind?: string;
    success?: boolean;
    rows?: number;
    files?: number;
    bytes?: number;
    durationMs?: number;
    error?: string | null;
    manual?: boolean;
  };

  await db.bihrRun.create({
    data: {
      kind: payload.kind === "extended" ? "extended" : "nightly",
      success: Boolean(payload.success),
      rows: Math.trunc(payload.rows ?? 0),
      files: Math.trunc(payload.files ?? 0),
      // Byte kan överstiga ett 32-bitars heltal vid stora körningar.
      bytes: Math.min(Math.trunc(payload.bytes ?? 0), 2_147_483_647),
      durationMs: Math.trunc(payload.durationMs ?? 0),
      error: payload.error ? String(payload.error).slice(0, 1000) : null,
      manual: Boolean(payload.manual),
    },
  });

  const stale = await db.bihrRun.findMany({
    orderBy: { createdAt: "desc" },
    skip: KEEP_RUNS,
    select: { id: true },
  });

  if (stale.length > 0) {
    await db.bihrRun.deleteMany({ where: { id: { in: stale.map((row) => row.id) } } });
  }

  return Response.json({ ok: true });
}
