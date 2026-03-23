import Link from "next/link";
import { navigation } from "@/content/navigation";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.24em] text-text uppercase">
          VibeDev
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/boka-mote"
          className="rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand/20"
        >
          Boka möte
        </Link>
      </div>
    </header>
  );
}
