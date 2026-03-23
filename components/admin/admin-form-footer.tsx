import { Button } from "@/components/ui/button";

type AdminFormFooterProps = {
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  helperText: string;
  error?: string;
  success?: string;
};

export function AdminFormFooter({
  isPending,
  submitLabel,
  pendingLabel,
  helperText,
  error,
  success,
}: AdminFormFooterProps) {
  return (
    <section className="surface p-6">
      {error ? <p className="mb-4 text-sm text-warning">{error}</p> : null}
      {success ? <p className="mb-4 text-sm text-success">{success}</p> : null}
      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" disabled={isPending} aria-busy={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        <p className="text-sm text-muted">{helperText}</p>
      </div>
    </section>
  );
}
