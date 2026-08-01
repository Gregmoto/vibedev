import type { Metadata } from "next";
import { PasswordResetRequestForm } from "@/components/admin/password-reset-request-form";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createMetadata(
    "Återställ lösenord",
    "Begär en länk för att återställa lösenordet till ditt adminkonto.",
    "/admin/losenord",
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface-elevated w-full max-w-md px-6 py-8 sm:px-8">
        <p className="eyebrow">Admin</p>
        <h1 className="heading-md mt-4">Återställ lösenord</h1>
        <p className="body-md mt-3">
          Ange e-postadressen till ditt adminkonto så skickar vi en länk där du kan välja ett
          nytt lösenord.
        </p>
        <div className="mt-8">
          <PasswordResetRequestForm />
        </div>
      </div>
    </div>
  );
}
