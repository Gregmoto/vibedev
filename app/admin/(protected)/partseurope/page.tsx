import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PartsEuropeCredentialsForm } from "@/components/admin/partseurope-credentials-form";
import { hasDatabaseUrl } from "@/lib/admin-action-utils";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export default async function AdminPartsEuropePage() {
  // Bara användarnamnet läses ut. Det krypterade lösenordet lämnar aldrig
  // servern — det finns ingen väg att visa det igen, bara att ersätta det.
  const credential = hasDatabaseUrl()
    ? await db.integrationCredential.findUnique({
        where: { provider: "partseurope" },
        select: { username: true, updatedAt: true },
      })
    : null;

  return (
    <AdminShell
      title="Parts Europe"
      description="Hämtar prisfilen en gång per dygn och lägger den på en fast länk som fungerar utan inloggning."
    >
      <PartsEuropeCredentialsForm
        savedUsername={credential?.username}
        savedAt={credential ? formatDateTime(credential.updatedAt) : undefined}
      />

      <section className="surface p-6">
        <h2 className="text-sm font-semibold text-text">Status</h2>
        {credential ? (
          <p className="mt-2 text-sm text-muted">
            Uppgifter sparade för <span className="text-text">{credential.username}</span>. Själva
            hämtningen är ännu inte aktiverad — den byggs härnäst och kommer att köra en gång per
            dygn samt visa de tio senaste körningarna här.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Inga uppgifter sparade än. Fyll i formuläret ovan för att komma igång.
          </p>
        )}
      </section>
    </AdminShell>
  );
}
