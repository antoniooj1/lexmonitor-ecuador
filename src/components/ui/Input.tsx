import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink placeholder:text-slate-400",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-danger">{error}</span> : null}
    </label>
  );
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      ) : null}
      <textarea
        id={inputId}
        className={cn(
          "focus-ring min-h-28 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-ink placeholder:text-slate-400",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-danger">{error}</span> : null}
    </label>
  );
}
