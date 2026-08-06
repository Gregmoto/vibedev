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
