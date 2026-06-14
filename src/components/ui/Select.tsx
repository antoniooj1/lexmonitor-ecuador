import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ label: string; value: string }>;
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      ) : null}
      <select
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
