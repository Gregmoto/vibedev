import type { ReactNode } from "react";

type AdminFormLayoutProps = {
  main: ReactNode;
  aside: ReactNode;
};

export function AdminFormLayout({ main, aside }: AdminFormLayoutProps) {
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">{main}<div className="space-y-6">{aside}</div></div>;
}
