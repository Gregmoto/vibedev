import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell
      title="Analytics"
      description="En plats för GA4, trafiköversikt och kommande analyswidgets i adminpanelen."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="heading-md text-2xl">GA4</h2>
          <p className="body-md mt-3">Här kopplas measurement ID och eventuella kompletterande scripts från site settings.</p>
        </Card>
        <Card className="p-6">
          <h2 className="heading-md text-2xl">Rapportgenvägar</h2>
          <p className="body-md mt-3">Nästa steg är att koppla denna vy till riktiga KPI-kort och externa dashboards.</p>
        </Card>
      </div>
    </AdminShell>
  );
}
