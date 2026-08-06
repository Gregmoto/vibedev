"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/integration-crypto";

export type CredentialState = { error?: string; success?: string };

export async function savePartsEuropeCredentialsAction(
  _prev: CredentialState,
  formData: FormData,
): Promise<CredentialState> {
  await requireAdminAction();

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Fyll i både e-post och lösenord." };
  }

  const key = process.env.INTEGRATION_SECRET;
  if (!key) {
    return { error: "INTEGRATION_SECRET saknas i miljön. Uppgifterna kan inte krypteras." };
  }

  const { cipher, iv } = await encryptSecret(password, key);

  await db.integrationCredential.upsert({
    where: { provider: "partseurope" },
    create: { provider: "partseurope", username, secretCipher: cipher, secretIv: iv },
    update: { username, secretCipher: cipher, secretIv: iv },
  });

  revalidatePath("/admin/partseurope");
  return { success: "Uppgifterna sparades krypterat." };
}

/** Startar en hämtning i feed-workern. Workern svarar direkt och jobbar vidare. */
export async function runPartsEuropeAction(): Promise<CredentialState> {
  await requireAdminAction();

  const base = process.env.BIHR_WORKER_URL?.replace(/\/$/, "");
  const secret = process.env.BIHR_TRIGGER_SECRET;

  if (!base || !secret) {
    return { error: "BIHR_WORKER_URL eller BIHR_TRIGGER_SECRET saknas i miljön." };
  }

  try {
    const response = await fetch(`${base}/run-partseurope?key=${encodeURIComponent(secret)}`);
    if (!response.ok) {
      return { error: `Workern svarade HTTP ${response.status}.` };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Kunde inte nå workern." };
  }

  revalidatePath("/admin/partseurope");
  return { success: "Hämtningen är beställd och startar inom fem minuter." };
}
