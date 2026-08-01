# Migration: vibedev.se från Vercel → Cloudflare (Workers / OpenNext)

Status: **kod implementerad och lokalt verifierad på workerd** (branch `migrate-to-cloudflare`).
Återstår: dina konto-/DNS-steg (Hyperdrive, secrets, domän). Ingen produktion är rörd — allt
ligger på branchen, Vercel är kvar som fallback.

---

## Vad som är gjort och verifierat

Bygget (`npm run preview:cf` → `opennextjs-cloudflare build`) går igenom, och Workern kördes lokalt
på **workerd** (`wrangler dev`) mot er Supabase via Hyperdrive-emulering. Verifierat:

- ✅ Alla routes svarar 200 (startsida, `/case-studies/vibeshops`, `/blogg`, enskilda inlägg, `/admin/login`, `/sitemap.xml`)
- ✅ **Databasläsningar fungerar på workerd** — sitemap genereras DB-inklusive (74 URL:er) med **noll** "Database read failed"-fel
- ✅ Prisma kör motorfritt via driver-adapter (ingen native binär, ingen fs-baserad WASM-laddning)
- ✅ Admin-skyddet fungerar utan middleware (server-side layout-vakt)
- ✅ `tsc --noEmit` rent

---

## De faktiska kodändringarna

### A. OpenNext-adapter + wrangler
- `@opennextjs/cloudflare`, `wrangler`, `@prisma/adapter-pg`, `pg`, `pg-cloudflare` tillagda
- `open-next.config.ts`, `wrangler.jsonc` (nodejs_compat, ASSETS, HYPERDRIVE-binding)
- `package.json`: `preview:cf`, `deploy:cf`, `cf-typegen`
- `worker-configuration.d.ts` genererad och committad (typer för HYPERDRIVE-bindingen)
- `initOpenNextCloudflareForDev()` används **inte** — lokalt faller `lib/db.ts` tillbaka på DATABASE_URL

### B. Prisma → driver-adapter + Hyperdrive  *(den kluriga biten)*
- `prisma/schema.prisma`: `previewFeatures = ["driverAdapters"]`, **ingen** output-katalog (OpenNext
  patchar klienten i node_modules för workerd)
- `next.config.ts`: `serverExternalPackages: ["@prisma/client", ".prisma/client", "@prisma/adapter-pg", "pg", "pg-cloudflare"]`
  — nyckeln till att OpenNext kan patcha klienten och att pg:s Node-built-ins/socket löser vid runtime
- `lib/db.ts`: **per-request** klient via React `cache()` + `PrismaPg({ connectionString, maxUses: 1 })`
  (pool får inte återanvändas mellan requests på Workers). Anslutning: Hyperdrive-binding i produktion,
  DATABASE_URL som fallback lokalt/build. Bakåtkompatibel `db`-proxy → **noll ändringar** i de 19 anropsställena
- `lib/db.ts` exporterar `hasDatabase()`; de fyra `hasDatabaseUrl()`-kopiorna pekar dit så Hyperdrive känns av
- `lib/social-links.ts` (ny, db-fri): pure social-link-helpers flyttade hit så att klientkomponenten
  `settings-form.tsx` inte drar in `pg` i klient-bundlen

### C. Auth utan middleware  *(annorlunda än ursprungsplanen)*
Next 16 döpte om middleware → "proxy" och kör den **Node-only**; OpenNext stödjer inte Node-middleware.
Lösning i stället för edge-middleware:
- Middleware borttagen (`proxy.ts` raderad)
- Skyddade admin-routes flyttade till route-gruppen `app/admin/(protected)/` med en **server-side
  layout-vakt** (`auth()` + redirect) — `/admin/login` ligger utanför gruppen. URL:er oförändrade.
- `auth.config.ts` (edge-säker) skapad och `auth.ts` bygger ovanpå den (förberett; middleware behövs inte längre)

---

## Återstår — dina konto-/DNS-steg (jag guidar)

1. **Skapa Hyperdrive** mot Supabase (direkta connection-stringen, port 5432):
   ```
   npx wrangler hyperdrive create vibedev-db --connection-string="postgres://<user>:<pass>@<host>:5432/postgres"
   ```
   Klistra in id:t i `wrangler.jsonc` (`hyperdrive[0].id`, ersätt `REPLACE_WITH_HYPERDRIVE_ID`).
2. **Skapa Cloudflare Worker-projekt** och koppla GitHub-repo (Workers Builds) för auto-deploy på `main`
   — build-kommando `npx opennextjs-cloudflare build`, deploy via adaptern. Workers **Paid** är redan aktivt.
3. **Secrets** i Cloudflare: `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
   **Vars**: `NEXT_PUBLIC_CAL_USERNAME`, `NEXT_PUBLIC_CAL_EVENT_SLUG`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`, `NEXTAUTH_URL=https://vibedev.se`.
4. **Deploya en preview** och verifiera admin-login (skriver/läser DB) + kontakt-/bokningsformulär.
5. **DNS-cutover:** flytta `vibedev.se` från hitme.net.pl till Cloudflare (lägg till zonen → verifiera att
   MX/SPF/DKIM följde med → byt nameservers), lägg sedan Workers custom domain (`vibedev.se` + `www`).
6. Låt Vercel leva ~1 vecka som fallback innan avveckling.

---

## Följdfixar (rekommenderas, ej blockerare)
- **In-memory rate-limiting** (`lib/rate-limit.ts` + login-limitern i `auth.ts`) delas inte mellan
  isolat på Workers → flytta till Cloudflare KV/Durable Objects.
- **`next/image`**: används ej idag; konfigurera OpenNext-bildoptimering när riktiga case-skärmdumpar läggs in.
- **compatibility_date** i wrangler.jsonc kan bumpas till ett nyare datum (bara en varning idag).

---

## Rollback
Inget mergas till `main` förrän CF-previewen är verifierad → Vercel-produktionen är orörd. Efter DNS-cutover:
peka nameservers tillbaka till hitme om något strular. Databasen (Supabase) är oförändrad — endast
anslutningsvägen byts.
