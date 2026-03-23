type AdminCheckboxFieldProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
};

export function AdminCheckboxField({
  name,
  label,
  defaultChecked = false,
  hint,
}: AdminCheckboxFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text">{label}</span>
      <span className="flex items-center gap-3 text-sm text-text">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-white/20 bg-transparent"
        />
        <span>{label}</span>
      </span>
      {hint ? <span className="block text-xs leading-6 text-muted">{hint}</span> : null}
    </label>
  );
}
