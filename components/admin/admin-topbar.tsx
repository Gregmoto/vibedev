"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

type AdminTopbarProps = {
  title: string;
  description: string;
};

export function AdminTopbar({ title, description }: AdminTopbarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);

  return (
    <header className="surface-elevated sticky top-4 z-30 px-6 py-5 sm:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <Link href="/admin" className="transition hover:text-text">
              Admin
            </Link>
            {segments.map((segment) => (
              <span key={segment} className="flex items-center gap-2">
                <span>/</span>
                <span>{segment.replaceAll("-", " ")}</span>
              </span>
            ))}
          </nav>
          <div>
            <h1 className="heading-md text-3xl">{title}</h1>
            <p className="body-md mt-2 max-w-2xl">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="button-secondary px-4 py-2 text-sm">
            Visa sajt
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Logga ut
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
