import { db } from "@/lib/db";
import { decryptSecret } from "@/lib/integration-crypto";

/**
 * Inloggning hos Parts Europes kundportal.
 *
 * De har inget API — filen ligger bakom en vanlig formulärinloggning med
 * PHP-session. Vi hämtar loginsidan för att få sessionscookie och csrf-token,
 * postar uppgifterna, och lämnar tillbaka cookien.
 *
 * Inloggningen sker här och inte i feed-workern med flit: lösenordet finns bara
 * på sajten, som har databasen och krypteringsnyckeln. Workern får en
 * sessionscookie som går ut av sig själv, aldrig lösenordet.
 */

const BASE = "https://dataex.partseurope.eu";

export const PARTSEUROPE_FILE_URL =
  `${BASE}/en/account/customer/file-share/download-file?files%5B%5D=/Lists/Pricefiles/PE_All_Parts_v7.csv`;

function collectCookies(response: Response, jar: Map<string, string>): void {
  for (const raw of response.headers.getSetCookie?.() ?? []) {
    const [pair] = raw.split(";");
    const index = pair.indexOf("=");
    if (index > 0) {
      jar.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
    }
  }
}

/** Läser och dekrypterar uppgifterna. Används av endpointen som workern anropar. */
export async function getPartsEuropeCredentials(): Promise<{ username: string; password: string }> {
  const credential = await db.integrationCredential.findUnique({
    where: { provider: "partseurope" },
  });

  if (!credential) {
    throw new Error("Inga inloggningsuppgifter sparade för Parts Europe.");
  }

  const key = process.env.INTEGRATION_SECRET;
  if (!key) {
    throw new Error("INTEGRATION_SECRET saknas — lösenordet kan inte dekrypteras.");
  }

  return {
    username: credential.username,
    password: await decryptSecret(credential.secretCipher, credential.secretIv, key),
  };
}
