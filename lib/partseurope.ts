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

export async function loginToPartsEurope(): Promise<string> {
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

  const password = await decryptSecret(credential.secretCipher, credential.secretIv, key);
  const jar = new Map<string, string>();

  const loginPage = await fetch(`${BASE}/en/login`, { redirect: "manual" });
  collectCookies(loginPage, jar);

  const html = await loginPage.text();
  const csrf =
    html.match(/name=["']csrf_token["'][^>]*value=["']([^"']+)/)?.[1] ??
    html.match(/value=["']([^"']+)["'][^>]*name=["']csrf_token/)?.[1];

  if (!csrf) {
    throw new Error("Hittade ingen csrf_token på inloggningssidan — formuläret kan ha ändrats.");
  }

  const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

  const result = await fetch(`${BASE}/en/login`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookieHeader() },
    body: new URLSearchParams({
      _email: credential.username,
      _password: password,
      csrf_token: csrf,
      go_to: "",
    }),
  });
  collectCookies(result, jar);

  // En lyckad inloggning skickar vidare in i kontot. Stannar vi kvar på /login
  // är uppgifterna fel — och då ska felet sägas rakt ut, inte visa sig som en
  // tom fil senare.
  const location = result.headers.get("location") ?? "";
  if (result.status !== 302 || location.includes("/login")) {
    throw new Error("Parts Europe avvisade inloggningen. Kontrollera e-post och lösenord.");
  }

  return cookieHeader();
}
