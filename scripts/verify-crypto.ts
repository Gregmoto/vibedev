import { encryptSecret, decryptSecret } from "../lib/integration-crypto";

async function main() {

  const key = "test-nyckel-1234";
  const secrets = ["hemligt123", "åäö!\"#¤%&/()=?", "x".repeat(200), "a"];

  let fail = 0;
  for (const s of secrets) {
    const { cipher, iv } = await encryptSecret(s, key);
    const back = await decryptSecret(cipher, iv, key);
    const ok = back === s;
    if (!ok) fail++;
    console.log(`${ok ? "ok  " : "FEL "} "${s.slice(0, 20)}" (${cipher.length} tecken chiffer)`);
  }

  // Två krypteringar av samma text ska ge olika chiffer (unik IV).
  const a = await encryptSecret("samma", key);
  const b = await encryptSecret("samma", key);
  console.log(a.cipher !== b.cipher ? "ok   unik IV per sparning" : "FEL  identiskt chiffer");
  if (a.cipher === b.cipher) fail++;

  // Fel nyckel ska inte gå att dekryptera.
  try {
    await decryptSecret(a.cipher, a.iv, "fel-nyckel");
    console.log("FEL  fel nyckel gav ändå klartext");
    fail++;
  } catch {
    console.log("ok   fel nyckel avvisas");
  }

  console.log(fail === 0 ? "\nALLA TESTER OK" : `\n${fail} FEL`);
  process.exit(fail === 0 ? 0 : 1);

}

main();
