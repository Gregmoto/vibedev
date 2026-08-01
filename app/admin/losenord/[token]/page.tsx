import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/admin/password-reset-form";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createMetadata(
    "Välj nytt lösenord",
    "Ange ett nytt lösenord för ditt adminkonto.",
    "/admin/losenord",
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface-elevated w-full max-w-md px-6 py-8 sm:px-8">
        <p className="eyebrow">Admin</p>
        <h1 className="heading-md mt-4">Välj nytt lösenord</h1>
        <p className="body-md mt-3">
          Ange ditt nya lösenord nedan. Länken kan bara användas en gång.
        </p>
        <div className="mt-8">
          <PasswordResetForm token={token} />
        </div>
      </div>
    </div>
  );
}
