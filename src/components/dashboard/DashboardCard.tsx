import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "yellow" | "orange" | "red" | "slate";
}

const tones = {
  blue: "bg-blue-50 text-navy border-blue-100",
  green: "bg-green-50 text-success border-green-100",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  orange: "bg-orange-50 text-review border-orange-100",
  red: "bg-red-50 text-danger border-red-100",
  slate: "bg-slate-100 text-slate-700 border-slate-200"
};

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "blue"
}: DashboardCardProps) {
  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "h-1",
          tone === "blue" && "bg-navy",
          tone === "green" && "bg-success",
          tone === "yellow" && "bg-warning",
          tone === "orange" && "bg-review",
          tone === "red" && "bg-danger",
          tone === "slate" && "bg-slate-400"
        )}
      />
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{title}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          <p className="mt-2 text-sm leading-5 text-muted">{description}</p>
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border", tones[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <ArrowUpRight className="hidden h-4 w-4 text-slate-300 sm:block" aria-hidden="true" />
      </CardContent>
    </Card>
  );
}
