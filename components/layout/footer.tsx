import Link from "next/link";
import { navigation } from "@/content/navigation";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-text">VibeDev</p>
          <p className="max-w-md text-sm leading-6 text-muted">
            Vi bygger moderna digitala produkter för bolag som vill röra sig snabbare, smartare och mer
            fokuserat.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-text">Sidor</p>
          <div className="space-y-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-muted transition hover:text-text">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-text">Kontakt</p>
          <div className="space-y-3 text-sm text-muted">
            <p>hello@vibedev.se</p>
            <p>Stockholm, Sverige</p>
            <Link href="/kontakt" className="text-brand transition hover:text-text">
              Skicka förfrågan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
