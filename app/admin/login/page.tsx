import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createMetadata("Admin login", "Logga in för att hantera innehåll och inställningar i VibeDev CMS.", "/admin/login"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface-elevated w-full max-w-md px-6 py-8 sm:px-8">
        <p className="eyebrow">Admin</p>
        <h1 className="heading-md mt-4">Logga in i VibeDev CMS</h1>
        <p className="body-md mt-3">
          Hantera blogg, podcast, case studies, sidor, inställningar och teknisk SEO från ett ställe.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
