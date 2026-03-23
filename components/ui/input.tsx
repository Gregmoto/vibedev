import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, id, ...props },
  ref,
) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      {label ? <span className="text-sm font-medium text-text">{label}</span> : null}
      <input ref={ref} id={fieldId} className={cn("field-base", className)} {...props} />
      {hint ? <span className="block text-xs leading-6 text-muted">{hint}</span> : null}
    </label>
  );
});
