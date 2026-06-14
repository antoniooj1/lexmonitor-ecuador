import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProcessInfoItemProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function ProcessInfoItem({ label, value, className }: ProcessInfoItemProps) {
  return (
    <div className={cn("rounded-md border border-slate-200 bg-white p-3", className)}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1 text-sm font-semibold leading-5 text-ink">{value}</div>
    </div>
  );
}
