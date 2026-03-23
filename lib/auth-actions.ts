"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { normalizeEmpty } from "@/lib/admin-action-utils";

type AuthState = {
  error?: string;
};

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmpty(formData.get("email"));
  const password = normalizeEmpty(formData.get("password"));

  if (!email || !password) {
    return {
      error: "E-post och lösenord krävs.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Inloggningen misslyckades. Kontrollera e-post och lösenord.",
      };
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
