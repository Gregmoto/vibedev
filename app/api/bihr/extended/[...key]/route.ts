import { serveFeed } from "@/lib/bihr/serve";

/**
 * Laddar ner en enskild märkesfil ur Extended-hämtningen.
 *
 * Öppen utan inloggning, på samma sätt som de nattliga filerna. Filerna är
 * blockerade i robots.txt och skickar noindex, men den som känner till adressen
 * kommer åt dem — det är ett medvetet val för att de ska kunna hämtas av
 * verktyg som inte kan logga in.
 */

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  // Rensa bort försök att ta sig ur katalogen med "..".
  const segments = key.filter((part) => part !== ".." && part !== "" && !part.includes("/"));

  if (segments.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return serveFeed(`feeds/extended/${segments.join("/")}`, segments[segments.length - 1]);
}
