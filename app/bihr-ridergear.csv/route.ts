import { serveFeed } from "@/lib/bihr/serve";

export const dynamic = "force-dynamic";

export async function GET() {
  return serveFeed("feeds/bihr-ridergear.csv", "bihr-ridergear.csv");
}
