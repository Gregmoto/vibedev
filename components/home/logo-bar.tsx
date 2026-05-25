import Link from "next/link";

type Client = {
  name:      string;
  slug:      string;
  color:     string;
  tagline:   string;
  upcoming?: boolean;
};

const clients: Client[] = [
  {
    name:    "CMS Online",
    slug:    "cms-online",
    color:   "#0066CC",
    tagline: "E-handel & SaaS",
  },
  {
    name:    "Bookiz",
    slug:    "bookiz",
    color:   "#E8601C",
    tagline: "Community & Bok",
  },
  {
    name:    "Mittbrottmål",
    slug:    "mittbrottmal",
    color:   "#1B4F72",
    tagline: "Legal Tech",
  },
  {
    name:    "Min Odling",
    slug:    "min-odling",
    color:   "#1E8449",
    tagline: "Community & Odling",
  },
  {
    name:     "Endoo",
    slug:     "endoo",
    color:    "#7D3C98",
    tagline:  "SaaS & Ekonomi",
    upcoming: true,
  },
];

export function LogoBar() {
  return (
    <section aria-label="Projekt vi byggt" className="border-y border-line/60 bg-[#F8F9FB]">
      <div className="container-shell py-10 sm:py-12">

        {/* Label row */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted/70">
            Projekt vi byggt
          </p>
          <Link
            href="/case-studies"
            className="text-xs font-medium text-muted transition hover:text-brand"
          >
            Se alla case studies →
          </Link>
        </div>

        {/* Project tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => (
            <Link
              key={client.slug}
              href={`/case-studies/${client.slug}`}
              className="group relative flex flex-col gap-2 rounded-xl border border-line bg-bg px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-panel"
            >
              {/* Accent dot + name */}
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full transition duration-200"
                  style={{ backgroundColor: client.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-text transition group-hover:text-brand">
                  {client.name}
                </span>
              </div>

              {/* Tagline */}
              <span className="text-[11px] leading-tight text-muted">
                {client.tagline}
              </span>

              {/* Upcoming badge */}
              {client.upcoming && (
                <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                  Kommande
                </span>
              )}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
