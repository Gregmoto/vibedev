import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
};

type AdminTableProps<T> = {
  title: string;
  description?: string;
  columns: Array<Column<T>>;
  rows: T[];
  actions?: ReactNode;
  emptyState?: ReactNode;
  rowKey?: (item: T, index: number) => string;
  /** Tätare rader och smalare cellmarginaler. För tabeller med många kolumner,
   *  där standardmåtten annars gör tabellen bredare än adminytan. */
  dense?: boolean;
};

export function AdminTable<T>({
  title,
  description,
  columns,
  rows,
  actions,
  emptyState,
  rowKey,
  dense = false,
}: AdminTableProps<T>) {
  const cellPadding = dense ? "px-4 py-3" : "px-6 py-4";
  // table-fixed låter kolumnerna följa angivna procentbredder i stället för
  // innehållets naturliga bredd. Då kan tabellen aldrig bli bredare än ytan,
  // oavsett hur långa ämnesrader eller adresser som råkar dyka upp.
  const tableWidth = dense ? "w-full table-fixed" : "min-w-full";
  return (
    <section className="surface-elevated overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {actions}
      </div>

      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="px-6 py-12">
            {emptyState || (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                <p className="text-base font-medium text-text">Inget innehåll ännu</p>
                <p className="mt-2 text-sm text-muted">När innehåll finns skapat visas det här.</p>
              </div>
            )}
          </div>
        ) : (
        <table className={cn(tableWidth, "border-collapse")}>
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(cellPadding, "text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey ? rowKey(row, index) : index} className="border-b border-white/5 last:border-0">
                {columns.map((column) => (
                  <td key={column.key} className={cn(cellPadding, "align-top text-sm text-text", column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </section>
  );
}
