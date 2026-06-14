import { Bell, Clock, Eye, PauseCircle, PlayCircle } from "lucide-react";
import type { JudicialProcess } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProcessInfoItem } from "@/components/processes/ProcessInfoItem";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ProcessCardProps {
  process: JudicialProcess;
  onToggleMonitoring?: (processId: string) => void;
}

export function ProcessCard({ process, onToggleMonitoring }: ProcessCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge urgencyLevel={process.urgencyLevel} />
              <Badge variant={process.monitoringEnabled ? "green" : "slate"}>
                {process.monitoringEnabled ? "Monitoreo activo" : "Monitoreo suspendido"}
              </Badge>
              <Badge variant="blue">{process.matter}</Badge>
            </div>
            <h3 className="mt-3 text-xl font-black text-ink">{process.processNumber}</h3>
            <p className="mt-1 text-sm text-muted">
              {process.actors.join(", ")} vs. {process.defendants.join(", ")}
            </p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <LinkButton href={`/processes/${process.id}`} variant="outline" className="w-full sm:w-auto">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Ver detalle
            </LinkButton>
            <Button
              variant="ghost"
              onClick={() => onToggleMonitoring?.(process.id)}
              className="w-full sm:w-auto"
            >
              {process.monitoringEnabled ? (
                <PauseCircle className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
              )}
              {process.monitoringEnabled ? "Suspender" : "Activar"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProcessInfoItem label="Judicatura" value={process.court} />
          <ProcessInfoItem label="Ubicación" value={`${process.province}, ${process.canton}`} />
          <ProcessInfoItem label="Tipo de proceso" value={process.processType} />
          <ProcessInfoItem label="Estado actual" value={process.currentStatus} />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Última actuación</p>
            <p className="mt-1 text-sm text-ink">{process.lastAction}</p>
            <p className="mt-2 text-xs text-muted">{formatDate(process.lastActionDate)}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Próxima acción</p>
            <p className="mt-1 text-sm text-ink">{process.nextPendingAction}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Control</p>
            <div className="mt-2 space-y-2 text-sm text-ink">
              <p className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-review" aria-hidden="true" />
                {process.activeAlertsCount} alerta(s) activa(s)
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-navy" aria-hidden="true" />
                {formatDateTime(process.lastCheckedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
