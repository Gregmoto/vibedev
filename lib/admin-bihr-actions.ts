"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-action-utils";

export type BihrActionState = { error?: string; success?: string };

/**
 * Startar en körning i feed-workern.
 *
 * Workern svarar direkt och gör jobbet i bakgrunden — Extended tar minuter och
 * skulle annars slå i tidsgränsen för en serveråtgärd.
 */
async function trigger(path: string): Promise<BihrActionState> {
  const base = process.env.BIHR_WORKER_URL?.replace(/\/$/, "");
  const secret = process.env.BIHR_TRIGGER_SECRET;

  if (!base || !secret) {
    return { error: "BIHR_WORKER_URL eller BIHR_TRIGGER_SECRET saknas i miljön." };
  }

  try {
    const response = await fetch(`${base}${path}?key=${encodeURIComponent(secret)}`, {
      method: "GET",
    });

    if (!response.ok) {
      return { error: `Workern svarade HTTP ${response.status}.` };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Kunde inte nå workern." };
  }

  revalidatePath("/admin/bihr");
  return { success: "Körningen är startad. Uppdatera sidan om en stund för att se resultatet." };
}

export async function runNightlyAction(): Promise<BihrActionState> {
  await requireAdminAction();
  return trigger("/run-nightly");
}

export async function runExtendedAction(): Promise<BihrActionState> {
  await requireAdminAction();
  return trigger("/run-extended");
}
