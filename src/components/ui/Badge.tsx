import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "slate" | "blue" | "green" | "yellow" | "orange" | "red";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  blue: "border-blue-200 bg-blue-50 text-navy",
  green: "border-green-200 bg-green-50 text-success",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
  orange: "border-orange-200 bg-orange-50 text-review",
  red: "border-red-200 bg-red-50 text-danger"
};

export function Badge({ children, className, variant = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
