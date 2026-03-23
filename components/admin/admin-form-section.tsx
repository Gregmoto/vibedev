import type { ReactNode } from "react";

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  elevated?: boolean;
};

export function AdminFormSection({
  title,
  description,
  children,
  elevated = false,
}: AdminFormSectionProps) {
  return (
    <section className={elevated ? "surface-elevated p-6 sm:p-8" : "surface p-6 sm:p-8"}>
      <h2 className="heading-md text-2xl">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-7 text-muted">{description}</p> : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}
