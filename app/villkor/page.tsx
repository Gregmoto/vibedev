import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Allmänna villkor — VibeDev",
  "Allmänna villkor för VibeDev:s tjänster inom webb- och apputveckling samt AI-lösningar.",
  "/villkor",
);

/* TODO: Juridisk granskning krävs innan publicering */

export default function VillkorPage() {
  return (
    <main id="main-content" className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text">
            Allmänna villkor
          </h1>
          <p className="mb-10 text-sm text-muted">
            Senast uppdaterad: 1 maj 2026 · Version 1.0
            {/* TODO: uppdatera datum och version vid juridisk granskning */}
          </p>

          <div className="prose prose-neutral max-w-none space-y-10 text-muted leading-7">

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">1. Parter och tillämpningsområde</h2>
              <p>
                Dessa allmänna villkor ("Villkor") gäller för avtal mellan VibeDev
                (Holmfred Ecommerce AB, org.nr XXXXXX-XXXX, "Leverantören") och
                kunden ("Kunden") avseende digitala tjänster inkluderat men inte
                begränsat till webb- och apputveckling, AI-lösningar och rådgivning.
                {/* TODO: fyll i korrekt org.nr */}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">2. Uppdragets omfattning</h2>
              <p>
                Uppdragets specifika omfattning, leverabler, tidsplan och pris
                fastställs i ett separat avtal, offert eller Statement of Work (SOW)
                som utgör en bilaga till dessa Villkor. Vid motstridigheter har
                det specifika avtalet företräde.
              </p>
              {/* TODO: säkerställ att SOW-mall är upprättad och juridiskt granskad */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">3. Betalningsvillkor</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Fakturering sker enligt överenskommelse i det specifika avtalet,
                  normalt månadsvis eller vid milstolpar.
                </li>
                <li>Betalningsfrist är 30 dagar netto om inget annat avtalats.</li>
                <li>
                  Vid försenad betalning debiteras dröjsmålsränta enligt
                  räntelagen (referensräntan + 8 procentenheter).
                </li>
                <li>
                  Leverantören förbehåller sig rätten att pausa arbetet vid
                  utebliven betalning efter skriftlig påminnelse.
                </li>
              </ul>
              {/* TODO: verifiera ränteberäkning och betalningsprocess med revisor */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">4. Immateriella rättigheter</h2>
              <p>
                Immateriella rättigheter till levererat material övergår till Kunden
                efter att full betalning mottagits, med undantag för:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Återanvändbara komponenter, bibliotek och verktyg som
                  Leverantören utvecklat oberoende av uppdraget.
                </li>
                <li>
                  Tredjepartskomponenter och open source-bibliotek som lyder
                  under sina respektive licenser.
                </li>
              </ul>
              <p className="mt-3">
                Leverantören förbehåller sig rätten att använda uppdraget som
                referens och i portföljen, om inte Kunden skriftligen begär
                sekretess.
              </p>
              {/* TODO: tydliggör IP-klausuler med juridisk rådgivare, särskilt AI-genererat material */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">5. Sekretess</h2>
              <p>
                Båda parter förbinder sig att inte utan den andra partens skriftliga
                samtycke röja konfidentiell information som mottagits i samband med
                uppdraget. Sekretesskyldigheten gäller under avtalstiden och 3 år
                därefter.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">6. Ansvarsbegränsning</h2>
              <p>
                Leverantörens totala ansvar gentemot Kunden är begränsat till det
                belopp Kunden betalat för det aktuella uppdraget under de senaste
                tre månaderna. Leverantören ansvarar inte för indirekta skador,
                utebliven vinst eller följdskador.
              </p>
              {/* TODO: verifiera ansvarsbegränsning är tillräcklig och korrekt med juridisk rådgivare */}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">7. Avtalstid och uppsägning</h2>
              <p>
                Löpande uppdrag kan sägas upp av vardera parten med 30 dagars
                skriftlig varsel. Pågående faktureringsperiod och utfört arbete
                fram till uppsägningsdatum faktureras fullt ut.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">8. Force majeure</h2>
              <p>
                Part är befriad från påföljd för underlåtenhet att uppfylla
                förpliktelse om underlåtenheten beror på omständighet utanför
                partens kontroll (t.ex. naturkatastrof, krig, pandemi, kritiskt
                infrastrukturbortfall) som parten inte skäligen kunde ha förutsett
                vid avtalets ingående.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">9. Tillämplig lag och tvistelösning</h2>
              <p>
                Dessa Villkor regleras av svensk rätt. Tvister ska i första hand
                lösas genom förhandling. Om parterna inte kan nå en uppgörelse
                ska tvisten avgöras av svensk allmän domstol med Stockholms
                tingsrätt som första instans.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-text">10. Kontakt</h2>
              <p>
                Frågor om dessa villkor skickas till{" "}
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
