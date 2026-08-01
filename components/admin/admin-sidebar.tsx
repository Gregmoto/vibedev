"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/content/admin-navigation";
import { cn } from "@/lib/utils";

const ADMIN_VERSION = "2.1";

type AdminSidebarProps = {
  /** Antal olästa ärenden. Visas som en siffra bredvid "Ärenden". */
  unreadTickets?: number;
};

function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      aria-label={`${count} olästa ärenden`}
      className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-bg"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function AdminSidebar({ unreadTickets = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const badgeFor = (href: string) =>
    href === "/admin/arenden" && unreadTickets > 0 ? <UnreadBadge count={unreadTickets} /> : null;

  return (
    <>
      <aside className="surface-elevated hidden h-fit p-4 lg:block">
        <div className="mb-4 border-b border-white/5 px-3 pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text">VibeDev Admin</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-brand">Version {ADMIN_VERSION}</p>
          <p className="mt-2 text-sm text-muted">Innehåll, SEO och webbplatsdata</p>
        </div>
        <nav className="grid gap-1" aria-label="Admin navigation">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-2xl px-3 py-3 text-sm font-medium transition",
                  isActive ? "bg-white/[0.07] text-text" : "text-muted hover:bg-white/[0.04] hover:text-text",
                )}
              >
                {item.label}
                {badgeFor(item.href)}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="overflow-x-auto lg:hidden">
        <nav aria-label="Admin navigation mobile" className="flex gap-2 pb-2">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive ? "bg-white/[0.08] text-text" : "border border-white/10 text-muted hover:text-text",
                )}
              >
                {item.label}
                {badgeFor(item.href)}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
