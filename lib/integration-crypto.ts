/**
 * Kryptering av inloggningsuppgifter till externa tjänster.
 *
 * Uppgifterna anges i adminpanelen men används av ett bakgrundsjobb, så de
 * måste gå att läsa tillbaka — en hash duger inte. Därför AES-GCM med en nyckel
 * som ligger som secret, utanför databasen. En läckt databasdump ger då inget
 * användbart: utan nyckeln är fälten obrukbara.
 *
 * WebCrypto finns både i Node och på Workers, så samma kod fungerar överallt.
 */

const ALGORITHM = "AES-GCM";
const IV_BYTES = 12;

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(value.length ? atob(value).length : 0));
  const decoded = atob(value);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

async function getKey(rawKey: string): Promise<CryptoKey> {
  if (!rawKey) {
    throw new Error("INTEGRATION_SECRET saknas — uppgifter kan varken sparas eller läsas.");
  }

  // Nyckeln härleds ur hemligheten så att den får rätt längd oavsett hur
  // hemligheten ser ut.
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawKey));
  return crypto.subtle.importKey("raw", digest, ALGORITHM, false, ["encrypt", "decrypt"]);
}

export async function encryptSecret(
  plaintext: string,
  rawKey: string,
): Promise<{ cipher: string; iv: string }> {
  const key = await getKey(rawKey);
  // Ny IV per sparning. Återanvänd IV med samma nyckel bryter AES-GCM.
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return { cipher: toBase64(new Uint8Array(encrypted)), iv: toBase64(iv) };
}

export async function decryptSecret(
  cipher: string,
  iv: string,
  rawKey: string,
): Promise<string> {
  const key = await getKey(rawKey);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: fromBase64(iv) },
    key,
    fromBase64(cipher),
  );

  return new TextDecoder().decode(decrypted);
}
