import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, hint, id, ...props },
  ref,
) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      {label ? <span className="text-sm font-medium text-text">{label}</span> : null}
      <textarea
        ref={ref}
        id={fieldId}
        className={cn("field-base min-h-[140px] resize-y", className)}
        {...props}
      />
      {hint ? <span className="block text-xs leading-6 text-muted">{hint}</span> : null}
    </label>
  );
});
