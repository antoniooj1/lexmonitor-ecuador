import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "slate" | "blue" | "orange";
  compact?: boolean;
}

const tones = {
  slate: "bg-slate-100 text-slate-500",
  blue: "bg-blue-50 text-navy",
  orange: "bg-orange-50 text-review"
};

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = SearchX,
  tone = "slate",
  compact = false
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center gap-3 text-center",
          compact ? "py-7" : "py-12"
        )}
      >
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", tones[tone])}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="mt-1 max-w-lg text-sm leading-6 text-muted">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
