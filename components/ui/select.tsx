import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, id, children, ...props },
  ref,
) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      {label ? <span className="text-sm font-medium text-text">{label}</span> : null}
      <select ref={ref} id={fieldId} className={cn("field-base appearance-none", className)} {...props}>
        {children}
      </select>
      {hint ? <span className="block text-xs leading-6 text-muted">{hint}</span> : null}
    </label>
  );
});
