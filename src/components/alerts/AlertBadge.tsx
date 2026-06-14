import type { UrgencyLevel } from "@/types";
import { URGENCY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { urgencyDotClasses } from "@/lib/utils";

interface AlertBadgeProps {
  urgencyLevel: UrgencyLevel;
}

export function AlertBadge({ urgencyLevel }: AlertBadgeProps) {
  const variant = urgencyLevel === "alta" ? "red" : urgencyLevel === "media" ? "orange" : "blue";

  return (
    <Badge variant={variant}>
      <span className={`h-2 w-2 rounded-full ${urgencyDotClasses(urgencyLevel)}`} />
      {URGENCY_LABELS[urgencyLevel]}
    </Badge>
  );
}
