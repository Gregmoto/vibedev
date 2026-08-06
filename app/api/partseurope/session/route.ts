import { loginToPartsEurope } from "@/lib/partseurope";

/**
 * Loggar in hos Parts Europe och lämnar tillbaka sessionscookien.
 *
 * Anropas av feed-workern, som saknar databasanslutning och därför varken kan
 * läsa eller dekryptera lösenordet. Den får en färskvara som går ut av sig
 * själv i stället.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.BIHR_TRIGGER_SECRET;

  if (!secret || request.headers.get("x-bihr-secret") !== secret) {
    return new Response("Not found", { status: 404 });
  }

  try {
    return Response.json({ cookie: await loginToPartsEurope() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Inloggningen misslyckades." },
      { status: 502 },
    );
  }
}
