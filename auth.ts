import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

const globalForLoginRateLimit = globalThis as unknown as {
  loginRateLimit: Map<string, { count: number; blockedUntil: number; lastAttemptAt: number }> | undefined;
};

const loginRateLimitStore = globalForLoginRateLimit.loginRateLimit ?? new Map<string, { count: number; blockedUntil: number; lastAttemptAt: number }>();

if (!globalForLoginRateLimit.loginRateLimit) {
  globalForLoginRateLimit.loginRateLimit = loginRateLimitStore;
}

function getLoginKey(email: string) {
  return email.trim().toLowerCase();
}

function isRateLimited(email: string) {
  const entry = loginRateLimitStore.get(getLoginKey(email));

  if (!entry) {
    return false;
  }

  if (entry.blockedUntil > Date.now()) {
    return true;
  }

  if (entry.blockedUntil <= Date.now()) {
    loginRateLimitStore.delete(getLoginKey(email));
  }

  return false;
}

function recordFailedAttempt(email: string) {
  const key = getLoginKey(email);
  const now = Date.now();
  const current = loginRateLimitStore.get(key);

  if (!current || now - current.lastAttemptAt > LOGIN_WINDOW_MS) {
    loginRateLimitStore.set(key, { count: 1, blockedUntil: 0, lastAttemptAt: now });
    return;
  }

  const nextCount = current.count + 1;
  loginRateLimitStore.set(key, {
    count: nextCount,
    blockedUntil: nextCount >= MAX_LOGIN_ATTEMPTS ? now + LOGIN_WINDOW_MS : 0,
    lastAttemptAt: now,
  });
}

function clearFailedAttempts(email: string) {
  loginRateLimitStore.delete(getLoginKey(email));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin login",
      credentials: {
        email: { label: "E-post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        if (isRateLimited(parsed.data.email)) {
          console.warn("[auth][credentials] Rate limited login attempt", parsed.data.email);
          return null;
        }

        let user;

        try {
          user = await db.user.findUnique({
            where: { email: parsed.data.email },
          });
        } catch (error) {
          console.error("[auth][credentials] User lookup failed", error);
          throw error;
        }

        if (!user?.passwordHash) {
          recordFailedAttempt(parsed.data.email);
          console.warn("[auth][credentials] No user or password hash for email", parsed.data.email);
          return null;
        }

        const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!matches) {
          recordFailedAttempt(parsed.data.email);
          console.warn("[auth][credentials] Password mismatch for email", parsed.data.email);
          return null;
        }

        clearFailedAttempts(parsed.data.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname.startsWith("/admin/login");
      const isLoggedIn = !!session?.user;
      const role = session?.user?.role;
      const isAdmin = role === UserRole.ADMIN;

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
});
