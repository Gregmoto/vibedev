import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Integritetspolicy — VibeDev",
  "Hur VibeDev hanterar och skyddar dina personuppgifter i enlighet med GDPR.",
  "/integritetspolicy",
);

/* TODO: Juridisk granskning krävs innan publicering */

export default function IntegritetspolicyPage() {
  return (
    <main id="main-content" className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text">
            Integritetspolicy
          </h1>
          <p className="mb-10 text-sm text-muted">
            Senast uppdaterad: 1 maj 2026 · {/* TODO: uppdatera datum vid juridisk granskning */}
          </p>

          <div className="prose prose-neutral max-w-none space-y-10 text-muted leading-7">

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">1. Personuppgiftsansvarig</h2>
              <p>
                VibeDev (Holmfred Ecommerce AB, org.nr XXXXXX-XXXX) är personuppgiftsansvarig
                för de personuppgifter som behandlas i samband med användning av
                webbplatsen vibedev.se och de tjänster vi erbjuder.
                {/* TODO: fyll i korrekt org.nr */}
              </p>
              <p className="mt-2">
                Kontaktuppgifter:{" "}
                <a href="mailto:hello@vibedev.se" className="text-brand hover:underline">
                  hello@vibedev.se
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">2. Vilka uppgifter samlar vi in?</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Kontaktformulär och bokningar:</strong> namn, e-postadress,
                  telefonnummer och meddelandetext.
                </li>
                <li>
                  <strong>Nyhetsbrev och lead magnets:</strong> e-postadress och
                  eventuellt företagsnamn.
                </li>
                <li>
                  <strong>Webbplatsanalys:</strong> anonymiserade besöksdata via Google
                  Analytics 4 (om aktiverat). Inga cookies sätts utan ditt samtycke.
                </li>
                <li>
                  <strong>Cal.com-bokningar:</strong> de uppgifter du anger i bokningsformuläret
                  (namn, e-postadress, eventuellt företag).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">3. Ändamål och rättslig grund</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="py-2 pr-4 text-left font-semibold text-text">Ändamål</th>
                      <th className="py-2 pr-4 text-left font-semibold text-text">Rättslig grund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2 pr-4">Svara på förfrågningar och offerter</td>
                      <td className="py-2">Berättigat intresse / avtal</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Skicka nyhetsbrev och lead magnets</td>
                      <td className="py-2">Samtycke</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Webbplatsanalys och förbättringar</td>
                      <td className="py-2">Berättigat intresse / samtycke</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Fakturering och avtalsfullgörelse</td>
                      <td className="py-2">Rättslig förpliktelse / avtal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">4. Lagringstid</h2>
              <p>
                Vi lagrar dina uppgifter så länge det är nödvändigt för det ändamål de
                samlades in för, eller så länge lagen kräver det (t.ex. 7 år för
                bokföringsändamål enligt bokföringslagen).
                Nyhetsbrev-prenumerationer sparas tills du avregistrerar dig.
                {/* TODO: verifiera lagringstider med juridisk rådgivare */}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">5. Tredjepartsleverantörer</h2>
              <p>Vi delar uppgifter med följande kategorier av mottagare:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Resend</strong> — e-postleverantör för transaktionsmail och nyhetsbrev
                  (USA, Standard Contractual Clauses).
                </li>
                <li>
                  <strong>Cal.com</strong> — bokningsplattform (EU/USA, Standard Contractual Clauses).
                </li>
                <li>
                  <strong>Vercel</strong> — webbhosting (USA, Standard Contractual Clauses).
                </li>
                <li>
                  <strong>Google Analytics 4</strong> — webbanalys, om du har givit samtycke
                  (USA, Standard Contractual Clauses).
                </li>
              </ul>
              {/* TODO: kontrollera aktuella DPA-avtal med alla leverantörer */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">6. Dina rättigheter</h2>
              <p>Enligt GDPR har du rätt att:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Begära tillgång till dina personuppgifter (registerutdrag)</li>
                <li>Begära rättelse av felaktiga uppgifter</li>
                <li>Begära radering ("rätten att bli glömd")</li>
                <li>Begära begränsning av behandling</li>
                <li>Invända mot behandling som baseras på berättigat intresse</li>
                <li>Dataportabilitet (få ut dina uppgifter i maskinläsbart format)</li>
                <li>Återkalla samtycke när som helst</li>
              </ul>
              <p className="mt-3">
                Skicka din begäran till{" "}
                <a href="mailto:hello@vibedev.se" className="text-brand hover:underline">
                  hello@vibedev.se
                </a>
                . Vi svarar inom 30 dagar. Du har också rätt att lämna klagomål till{" "}
                <a
                  href="https://www.imy.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Integritetsskyddsmyndigheten (IMY)
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">7. Cookies</h2>
              <p>
                Vi använder cookies i begränsad utsträckning. Se vår{" "}
                <a href="/cookies" className="text-brand hover:underline">
                  cookiepolicy
                </a>{" "}
                för detaljer.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">8. Ändringar</h2>
              <p>
                Vi kan uppdatera denna policy när verksamheten förändras. Väsentliga
                förändringar kommuniceras via e-post till prenumeranter eller via ett
                meddelande på webbplatsen.
              </p>
              {/* TODO: sätt upp process för att notifiera prenumeranter vid policyändringar */}
            </section>

          </div>
        </div>
      </Container>
    </main>
  );
}
