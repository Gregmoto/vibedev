import { redirect } from "next/navigation";

export default function LegacyAdminSeoPage() {
  redirect("/admin/settings");
}
