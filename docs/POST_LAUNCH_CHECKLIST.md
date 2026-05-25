# Post-Launch Checklist — VibeDev

Samlade TODO-markeringar från kodbasen. Bocka av varje punkt innan webbplatsen anses lanserad.

---

## 🔴 Kritiskt — måste åtgärdas innan lansering

### Juridik

- [ ] **Juridisk granskning av integritetspolicyn** (`app/integritetspolicy/page.tsx`)
  - Verifiera lagringstider med juridisk rådgivare
  - Kontrollera DPA-avtal med Resend, Cal.com, Vercel, Google
  - Uppdatera datum vid godkänd version
- [ ] **Juridisk granskning av allmänna villkoren** (`app/villkor/page.tsx`)
  - Tydliggör IP-klausuler, särskilt kring AI-genererat material
  - Verifiera ansvarsbegränsningsklausul
  - Verifiera ränteberäkning med revisor
  - Upprätta SOW-mall som bilaga till villkoren
- [ ] **Juridisk granskning av cookiepolicyn** (`app/cookies/page.tsx`)

### Företagsuppgifter

- [ ] **Fyll i korrekt org.nr** i `lib/config/contact.ts` — ersätt `XXXXXX-XXXX`
- [ ] **Fyll i korrekt VAT-nummer** — ersätt `SEXXXXXXXXXXXX`
- [ ] **Bekräfta F-skattsedel** — sätt `fSkatt: true` om korrekt (redan satt)
- [ ] **Bekräfta firmanamn** — är "Holmfred Ecommerce AB" korrekt juridiskt namn?

### Cookie-samtycke

- [ ] **Implementera cookie-banner** innan GA4 aktiveras — se `app/cookies/page.tsx`
  - GA4-scriptet i `app/layout.tsx` ska inte köra utan samtycke
  - Rekommenderat: integrera Cookiebot, CookieYes eller motsvarande

---

## 🟡 Viktigt — bör åtgärdas tidigt post-launch

### Innehåll och media

- [ ] **Ersätt placeholder-logos** i `components/home/logo-bar.tsx`
  - 6 klientlogotyper som SVG — koordinera med respektive klient
- [ ] **Ladda upp riktiga PDF:er** för lead magnets:
  - `/public/downloads/mvp-checklist.pdf` → kopplad till `"mvp-checklist"` i resurser
  - `/public/downloads/vibecoding-guide-2026.pdf` → kopplad till `"vibecoding-guide"`
  - `/public/downloads/ai-decision-model.pdf` → kopplad till `"ai-decision-model"`
  - Uppdatera `RESOURCE_CONFIG` i `lib/actions/lead-magnet-actions.ts` med rätt sökvägar/URLs
- [ ] **Granska stub-innehåll** i `content/blog.ts` — 6 stub-poster med `body: ""`
  - cursor-vs-claude-code-2026
  - sa-skar-du-scope-pa-en-mvp
  - fortnox-integration-e-handel
  - react-native-eller-native-beslutsguide-2026
  - sakra-dina-llm-anrop
  - fast-pris-vs-timpris
- [ ] **Granska stub-avsnitt** i `content/podcast.ts` — 5 avsnitt utan `embedUrl`
  - vad-ar-vibecoding-en-introduktion
  - cursor-vs-claude-code-vs-copilot-2026
  - bygga-mvp-pa-8-veckor-var-process
  - ai-i-kundsupport-nar-det-fungerar
  - hur-vi-tanker-scope-80-20-regeln-for-mvps

### Externa tjänster

- [ ] **Cal.com** — skapa event med slug `30min`
  - Titel: "30 min fokuserat samtal med en senior utvecklare"
  - Varighet: 30 minuter
  - Verifiera att `NEXT_PUBLIC_CAL_USERNAME=vibedev` matchar ditt Cal.com-konto
- [ ] **Google Analytics 4** — lägg in Measurement ID i admin-inställningarna
  - Inställning: `ga4MeasurementId` i databasen via `/admin`
  - Aktiveras bara om cookie-samtycke är implementerat (se ovan)
- [ ] **Bekräfta LinkedIn-URL** i `lib/config/contact.ts` → `CONTACT.social.linkedin`
- [ ] **Bekräfta Instagram-URL** i `lib/config/contact.ts` → `CONTACT.social.instagram`
- [ ] **Google Search Console** — verifiera domän och lägg in verifieringskod i admin-inställningarna

### Sociala medier

- [ ] **Lägg upp VibeDev på Instagram** (om ej befintligt konto)
- [ ] **Uppdatera LinkedIn-företagssida** med rätt webbadress och beskrivning

---

## 🟢 Nice-to-have — post-launch iterationer

### SEO och analys

- [ ] **Skicka in sitemap** till Google Search Console: `https://vibedev.se/sitemap.xml`
- [ ] **Verifiera OG-bilder** för alla sidor via [opengraph.xyz](https://www.opengraph.xyz)
- [ ] **Lägg in strukturerad data för FAQ** på tjänstesidor (om FAQ-sektioner finns)
- [ ] **Uppdatera `lastModified`** i sitemap till faktiska datum vid commits

### Notifieringsprocess

- [ ] **Sätt upp process** för att notifiera nyhetsbrevsprenumeranter vid uppdatering av integritetspolicyn

### Prestanda

- [ ] **Kontrollera Core Web Vitals** via PageSpeed Insights / Vercel Analytics
- [ ] **Verifiera bildoptimering** — alla bilder via `next/image` med korrekt `sizes`-prop

### Drift och underhåll

- [ ] **Sätt upp Uptime-monitoring** (t.ex. Betterstack, UptimeRobot)
- [ ] **Sätt upp felrapportering** (t.ex. Sentry)
- [ ] **Dokumentera secrets** i säkert lösenordsvalv — se `docs/SETUP_DATABASE.md` för databasuppgifter

---

## Filer med TODO-kommentarer

Snabbreferens — alla filer med inline `// TODO:`-kommentarer:

| Fil | Antal TODOs | Ämne |
|-----|-------------|-------|
| `lib/config/contact.ts` | 4 | org.nr, VAT, social URLs, firmanamn |
| `app/integritetspolicy/page.tsx` | 4 | juridik, lagringstider, DPA-avtal |
| `app/villkor/page.tsx` | 3 | juridik, IP, SOW-mall |
| `app/cookies/page.tsx` | 1 | cookie-banner |
| `lib/actions/lead-magnet-actions.ts` | 2 | PDF-sökvägar |
| `components/home/logo-bar.tsx` | 1 | klientlogotyper |
| `components/layout/footer.tsx` | 1 | org.nr-synkronisering |
| `.env.local` | 1 | Cal.com-event-slug |

---

_Skapat: maj 2026 — uppdatera listan löpande._
