import { CalendarClock, CheckCircle2, Pencil, Scale } from "lucide-react";
import type { Alert } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";

interface AlertCardProps {
  alert: Alert;
  onMarkReviewed?: (alertId: string) => void;
  onEditDeadline?: (alert: Alert) => void;
}

export function AlertCard({ alert, onMarkReviewed, onEditDeadline }: AlertCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge urgencyLevel={alert.urgencyLevel} />
              <Badge variant={alert.status === "pendiente" ? "yellow" : "green"}>
                {alert.status === "pendiente" ? "Pendiente" : "Revisada"}
              </Badge>
              {alert.actionType ? <Badge variant="slate">{alert.actionType}</Badge> : null}
            </div>
            <div>
              <h3 className="text-lg font-black text-ink">{alert.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{alert.description}</p>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-muted">
            <p className="font-semibold text-ink">{alert.processNumber ?? "Proceso asociado"}</p>
            <p>Detectada: {formatDateTime(alert.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Acción sugerida</p>
            <p className="mt-1 text-sm text-ink">{alert.suggestedAction}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Fecha tentativa de vencimiento
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{formatDate(alert.dueDate)}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap">
          {alert.status === "pendiente" ? (
            <Button variant="success" onClick={() => onMarkReviewed?.(alert.id)} className="w-full sm:w-auto">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Marcar como revisada
            </Button>
          ) : null}
          <LinkButton href={`/processes/${alert.processId}`} variant="outline" className="w-full sm:w-auto">
            <Scale className="h-4 w-4" aria-hidden="true" />
            Ver proceso
          </LinkButton>
          <Button variant="ghost" onClick={() => onEditDeadline?.(alert)} className="w-full sm:w-auto">
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar plazo
          </Button>
          {alert.dueDate ? (
            <Badge variant="orange">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(alert.dueDate)}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
