"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = {
  error: undefined as string | undefined,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5" aria-busy={isPending}>
      <Input name="email" type="email" label="E-post" placeholder="admin@vibedev.se" required />
      <Input name="password" type="password" label="Lösenord" placeholder="••••••••" required />
      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Loggar in..." : "Logga in"}
      </Button>
    </form>
  );
}
