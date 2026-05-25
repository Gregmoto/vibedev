import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Cookiepolicy — VibeDev",
  "Information om hur VibeDev använder cookies och hur du hanterar dina inställningar.",
  "/cookies",
);

/* TODO: Juridisk granskning krävs innan publicering */

export default function CookiesPage() {
  return (
    <main id="main-content" className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text">
            Cookiepolicy
          </h1>
          <p className="mb-10 text-sm text-muted">
            Senast uppdaterad: 1 maj 2026
            {/* TODO: uppdatera datum vid juridisk granskning */}
          </p>

          <div className="prose prose-neutral max-w-none space-y-10 text-muted leading-7">

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">Vad är cookies?</h2>
              <p>
                Cookies är små textfiler som sparas i din webbläsare när du besöker en webbplats.
                De används för att webbplatsen ska fungera korrekt, för att komma ihåg dina
                inställningar och för att samla in anonymiserad statistik.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">Vilka cookies använder vi?</h2>

              <h3 className="mb-2 mt-6 font-semibold text-text">Nödvändiga cookies</h3>
              <p>
                Dessa cookies krävs för att webbplatsen ska fungera och kan inte stängas av.
                De sätts i regel endast som svar på åtgärder du vidtar, t.ex. inloggning
                eller ifyllning av formulär.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="py-2 pr-4 text-left font-semibold text-text">Cookie</th>
                      <th className="py-2 pr-4 text-left font-semibold text-text">Syfte</th>
                      <th className="py-2 text-left font-semibold text-text">Livslängd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">__session</td>
                      <td className="py-2 pr-4">Sessionshantering</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-2 mt-6 font-semibold text-text">Analyscookies (valfria)</h3>
              <p>
                Vi använder Google Analytics 4 för att förstå hur besökare använder webbplatsen.
                Dessa cookies sätts <strong>endast om du godkänner</strong> dem via vår
                cookie-banner.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="py-2 pr-4 text-left font-semibold text-text">Cookie</th>
                      <th className="py-2 pr-4 text-left font-semibold text-text">Syfte</th>
                      <th className="py-2 text-left font-semibold text-text">Livslängd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">_ga</td>
                      <td className="py-2 pr-4">Särskiljer unika besökare (GA4)</td>
                      <td className="py-2">2 år</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">_ga_*</td>
                      <td className="py-2 pr-4">Bevarar sessionstillstånd (GA4)</td>
                      <td className="py-2">2 år</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* TODO: implementera cookie-banner med samtycke innan GA4 aktiveras */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">Tredjepartscookies</h2>
              <p>
                Tjänster inbäddade på webbplatsen (t.ex. Cal.com för bokning) kan sätta
                egna cookies. Vi har ingen kontroll över dessa och hänvisar till respektive
                leverantörs sekretesspolicy.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">Hantera dina inställningar</h2>
              <p>
                Du kan när som helst ändra eller återkalla ditt samtycke till cookies via
                cookie-bannern på webbplatsen, eller genom att rensa cookies i din webbläsare.
                Observera att om du avaktiverar alla cookies kan vissa funktioner sluta fungera.
              </p>
              <p className="mt-3">
                Läs mer om hur du hanterar cookies i din webbläsare:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/sv/kb/forbattrat-skydd-mot-sparning-i-firefox" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    Apple Safari
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">Kontakt</h2>
              <p>
                Frågor om vår cookieanvändning skickas till{" "}
                <a href="mailto:hello@vibedev.se" className="text-brand hover:underline">
                  hello@vibedev.se
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </Container>
    </main>
  );
}
