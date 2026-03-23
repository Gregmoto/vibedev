import Link from "next/link";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section className="pt-24">
      <div className="surface px-8 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Sidan kunde inte hittas</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Länken kan vara gammal eller så har sidan flyttats. Gå tillbaka till startsidan eller fortsätt till
          våra tjänster.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-text px-6 py-3 text-sm font-medium text-bg">
            Till startsidan
          </Link>
          <Link href="/tjanster" className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-text">
            Se tjänster
          </Link>
        </div>
      </div>
    </Section>
  );
}
