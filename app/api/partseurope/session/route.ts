import { getPartsEuropeCredentials } from "@/lib/partseurope";

/**
 * Lämnar ut inloggningsuppgifterna till feed-workern.
 *
 * Workern saknar databasanslutning och krypteringsnyckel och kan därför varken
 * läsa eller dekryptera dem själv.
 *
 * Tidigare loggade sajten in och skickade bara sessionscookien vidare. Det gav
 * 403 vid nedladdningen: Parts Europe binder PHP-sessionen till IP-adressen,
 * och sajten och workern har olika utgående adresser. Nu gör workern båda
 * stegen från samma adress.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.BIHR_TRIGGER_SECRET;

  if (!secret || request.headers.get("x-bihr-secret") !== secret) {
    return new Response("Not found", { status: 404 });
  }

  try {
    return Response.json(await getPartsEuropeCredentials());
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Uppgifterna kunde inte läsas." },
      { status: 502 },
    );
  }
}
