import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";

/**
 * Server-side behörighetsvakt för alla /admin-routes utom /admin/login.
 * Ersätter det tidigare middleware-skyddet (proxy.ts), som inte kan köras på
 * Cloudflare/OpenNext (Next 16:s proxy stödjer bara Node-runtime, som OpenNext
 * ännu inte kör). Kontrollen sker här i request-scope via auth().
 */
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
