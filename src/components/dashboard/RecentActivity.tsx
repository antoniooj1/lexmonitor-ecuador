import type { Alert, JudicialAction, JudicialProcess } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface RecentActivityProps {
  title: string;
  actions?: JudicialAction[];
  alerts?: Alert[];
  processes?: JudicialProcess[];
}

export function RecentActivity({ title, actions = [], alerts = [], processes = [] }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-bold text-ink">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue">{action.actionType}</Badge>
              <AlertBadge urgencyLevel={action.urgencyLevel} />
              <span className="text-xs font-medium text-muted">{formatDate(action.actionDate)}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{action.aiSummary}</p>
            <p className="mt-1 text-sm text-muted">{action.suggestedAction}</p>
          </div>
        ))}

        {alerts.map((alert) => (
          <div key={alert.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge urgencyLevel={alert.urgencyLevel} />
              <Badge variant={alert.status === "pendiente" ? "orange" : "green"}>
                {alert.status === "pendiente" ? "Pendiente" : "Revisada"}
              </Badge>
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{alert.title}</p>
            <p className="mt-1 text-sm text-muted">{alert.description}</p>
          </div>
        ))}

        {processes.map((process) => (
          <div key={process.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={process.monitoringEnabled ? "green" : "slate"}>
                {process.monitoringEnabled ? "Monitoreo activo" : "Pausado"}
              </Badge>
              <AlertBadge urgencyLevel={process.urgencyLevel} />
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{process.processNumber}</p>
            <p className="mt-1 text-sm text-muted">{process.court}</p>
          </div>
        ))}

        {!actions.length && !alerts.length && !processes.length ? (
          <p className="text-sm text-muted">Sin registros para mostrar.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
