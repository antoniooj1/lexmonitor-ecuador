import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  description?: string;
  variant?: "inline" | "panel";
}

export function LoadingState({
  label = "Cargando información...",
  description,
  variant = "panel"
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-slate-200 bg-white text-sm text-muted",
        variant === "panel" ? "justify-center p-8" : "p-3"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-navy">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
      <div>
        <p className="font-bold text-ink">{label}</p>
        {description ? <p className="mt-0.5 leading-5">{description}</p> : null}
      </div>
    </div>
  );
}
