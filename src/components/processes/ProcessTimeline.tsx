import type { JudicialAction } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ProcessTimelineProps {
  actions: JudicialAction[];
}

export function ProcessTimeline({ actions }: ProcessTimelineProps) {
  if (!actions.length) {
    return (
      <EmptyState
        title="Sin actuaciones registradas"
        description="El proceso no tiene actuaciones cargadas en el repositorio local del MVP. El monitoreo simulado agregará nuevas actuaciones cuando las detecte."
        compact
      />
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <Card key={action.id}>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue">{action.actionType}</Badge>
              <AlertBadge urgencyLevel={action.urgencyLevel} />
              <Badge variant={action.reviewed ? "green" : "yellow"}>
                {action.reviewed ? "Revisada" : "Pendiente de revisión"}
              </Badge>
              {action.generatedAlert ? <Badge variant="orange">Generó alerta</Badge> : <Badge>Sin alerta</Badge>}
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{formatDate(action.actionDate)}</p>
              <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {action.rawText}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Resumen IA simulado</p>
                <p className="mt-1 text-sm text-ink">{action.aiSummary}</p>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Acción sugerida</p>
                <p className="mt-1 text-sm text-ink">{action.suggestedAction}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              <span>Plazo detectado: {action.detectedDeadlineText ?? "No"}</span>
              <span>Vencimiento tentativo: {formatDate(action.tentativeDueDate)}</span>
              <span>Confirmado: {formatDate(action.confirmedDueDate)}</span>
              <span>Detección: {formatDateTime(action.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
