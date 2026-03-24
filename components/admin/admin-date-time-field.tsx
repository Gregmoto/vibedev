"use client";

import { useId, useRef } from "react";
import { Button } from "@/components/ui/button";

type AdminDateTimeFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
};

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function AdminDateTimeField({
  name,
  label,
  defaultValue = "",
}: AdminDateTimeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="datetime-local"
          defaultValue={defaultValue}
          className="field-base flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = toDateTimeLocalValue(new Date());
            }
          }}
        >
          Nu
        </Button>
      </div>
    </div>
  );
}
