# Databas-setup — vibedev

Steg-för-steg för att sätta upp Supabase PostgreSQL och köra Prisma-migrationerna.

---

## 1. Skapa Supabase-projekt

1. Gå till [supabase.com/dashboard](https://supabase.com/dashboard) och logga in.
2. Klicka **New project**.
3. Välj din organisation, ange ett projektnamn (t.ex. `vibedev`).
4. Välj region: **eu-north-1 (Stockholm)**.
5. Sätt ett starkt databaslösenord — spara det på ett säkert ställe.
6. Klicka **Create new project** och vänta (~2 min).

---

## 2. Hämta connection strings

1. I Supabase-dashboarden: klicka **Connect** (uppe till höger).
2. Välj fliken **ORM** eller **Direct**.
3. Hämta **två** strängar:

### DATABASE_URL — Transaction pooler (används av appen)
- Connection Method: **Transaction pooler**
- Aktivera **"Use IPv4 connection (Shared Pooler)"** om ditt nätverk inte stödjer IPv6
- Type: **URI**
- Lägg till `?pgbouncer=true` i slutet om det inte redan finns

```
postgresql://postgres.[projekt-ref]:[lösenord]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### DIRECT_URL — Session pooler (används av Prisma migrate)
- Connection Method: **Session pooler** (eller Direct connection)
- Type: **URI**

```
postgresql://postgres.[projekt-ref]:[lösenord]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres
```

---

## 3. Konfigurera .env.local

Skapa filen `.env.local` i projektets rot (den finns redan om du klonat repot):

```env
# Databas
DATABASE_URL="postgresql://postgres.[projekt-ref]:[lösenord]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[projekt-ref]:[lösenord]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="kör: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Admin-konto
ADMIN_EMAIL="admin@vibedev.se"
ADMIN_PASSWORD="ditt-starka-lösenord"
SEED_ADMIN_PASSWORD="ditt-starka-lösenord"

# E-post (Resend)
RESEND_API_KEY="re_..."
CONTACT_EMAIL_TO="hello@vibedev.se"
CONTACT_EMAIL_FROM="noreply@vibedev.se"
```

> `.env.local` är i `.gitignore` och committas aldrig.

---

## 4. Generera Prisma-klienten

```bash
npx prisma generate
```

---

## 5. Kör migrationerna

```bash
npx prisma migrate deploy
```

Förväntat output:
```
2 migrations found in prisma/migrations
Applying migration `20250323223000_init_cms_models`
Applying migration `20250525000000_add_contact_submission`
All migrations have been successfully applied.
```

Om du får felet **"database schema is not empty"** har Supabase redan skapat tabeller. Kör då:

```bash
npx prisma migrate resolve --applied "20250323223000_init_cms_models"
npx prisma migrate resolve --applied "20250525000000_add_contact_submission"
```

---

## 6. Seeda testdata

```bash
npm run seed
```

Skapar:
- 1 admin-användare (`admin@vibedev.se`)
- 3 publicerade blogginlägg
- 1 publicerat podcast-avsnitt
- 4 publicerade case studies
- Default site-inställningar

Seed är idempotent — du kan köra den flera gånger utan duplikatfel.

---

## 7. Verifiera

Starta dev-servern och kontrollera att admin-panelen fungerar:

```bash
npm run dev
```

Öppna [http://localhost:3000/admin](http://localhost:3000/admin) och logga in med `admin@vibedev.se` och lösenordet du satte i `SEED_ADMIN_PASSWORD`.

---

## Återställ databasen (dev)

```bash
npm run db:reset
```

> ⚠️ Raderar all data och kör om alla migrationerna från scratch. Använd bara i utvecklingsmiljö.
