/**
 * Logo bar — social proof strip displayed directly after the hero.
 *
 * TODO: Ersätt med riktiga SVG-loggor i public/logos/ — placeholders
 *       genererade med klientnamn och unika accent-färger.
 */

type LogoClient = {
  name: string;
  /** Accent colour used for the text wordmark before grayscale is applied. */
  color: string;
  badge?: string;
};

const clients: LogoClient[] = [
  { name: "CMS Online",   color: "#0066CC" },
  { name: "Bookiz",       color: "#E8601C" },
  { name: "Mittbrottmål", color: "#1B4F72" },
  { name: "Min Odling",   color: "#1E8449" },
  { name: "Endoo",        color: "#7D3C98", badge: "kommande" },
  // TODO: lägg till sjätte logo
];

function Wordmark({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="whitespace-nowrap text-xs font-bold tracking-tight sm:text-sm"
      style={{ color }}
    >
      {name}
    </span>
  );
}

export function LogoBar() {
  return (
    <section aria-label="Utvalda klienter" className="bg-[#F4F5F8]">
      <div className="container-shell py-12 sm:py-16">

        {/* Label */}
        <p className="mb-10 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-muted/60">
          Bolag och projekt vi byggt för
        </p>

        {/* Logo grid — 3 cols mobile → 6 cols desktop */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-8 lg:grid-cols-6">

          {clients.map((client) => (
            <div key={client.name} className="flex flex-col items-center gap-2.5">
              {/* Wordmark: grayscaled + dimmed by default, full colour on hover */}
              <div className="flex h-10 items-center justify-center grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100">
                <Wordmark name={client.name} color={client.color} />
              </div>

              {client.badge ? (
                <span className="rounded-full border border-line bg-panel px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {client.badge}
                </span>
              ) : null}
            </div>
          ))}

          {/* TODO: lägg till sjätte logo */}
          <div className="flex flex-col items-center justify-center opacity-30">
            <div className="flex h-10 w-full max-w-[100px] items-center justify-center rounded-lg border border-dashed border-lineStrong">
              <span className="text-xs text-muted">+</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
