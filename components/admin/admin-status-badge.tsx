import { Badge } from "@/components/ui/badge";

type AdminStatusBadgeProps = {
  status: "DRAFT" | "PUBLISHED";
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  if (status === "PUBLISHED") {
    return <Badge tone="success">Publicerad</Badge>;
  }

  return <Badge tone="neutral">Utkast</Badge>;
}
