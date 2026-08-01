import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

/**
 * Edge-säker NextAuth-konfiguration — INGEN import av Prisma, bcrypt eller andra
 * Node-beroenden. Används av middleware (proxy.ts) som på Cloudflare/OpenNext måste
 * köra i edge-runtimen. De Node-beroende delarna (PrismaAdapter + Credentials.authorize)
 * ligger i auth.ts och läggs ovanpå denna config.
 *
 * Sessionsstrategin är JWT, så middleware kan avgöra behörighet enbart utifrån token —
 * utan databasåtkomst.
 */
export const authConfig = {
  // Krävs utanför Vercel (Cloudflare Workers) — annars kastar NextAuth "UntrustedHost".
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname.startsWith("/admin/login");
      const isLoggedIn = !!session?.user;
      const role = session?.user?.role;
      const isAdmin = role === "ADMIN";

      if (!isAdminRoute) {
        return true;
      }

      if (isLoginRoute) {
        return !isLoggedIn;
      }

      return isLoggedIn && isAdmin;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as typeof user & { role?: UserRole }).role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role as UserRole | undefined;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
