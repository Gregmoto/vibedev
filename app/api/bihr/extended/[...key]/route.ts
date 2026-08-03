import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { serveFeed } from "@/lib/bihr/serve";

/**
 * Laddar ner en enskild märkesfil ur Extended-hämtningen.
 * Bara för inloggad admin — Extended innehåller hela sortimentet med priser.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const session = await auth();

  if (session?.user?.role !== UserRole.ADMIN) {
    return new Response("Not found", { status: 404 });
  }

  const { key } = await params;
  const segments = key.filter((part) => part !== ".." && part !== "");

  if (segments.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return serveFeed(`feeds/extended/${segments.join("/")}`, `${segments[segments.length - 1]}`);
}
