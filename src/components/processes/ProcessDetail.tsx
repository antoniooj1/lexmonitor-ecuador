import {
  AlertTriangle,
  Bell,
  CalendarDays,
  FileText,
  PauseCircle,
  Pencil,
  PlayCircle,
  StickyNote
} from "lucide-react";
import type {
  Alert,
  Deadline,
  Document as LegalDocument,
  JudicialAction,
  JudicialProcess,
  Note
} from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { AlertCard } from "@/components/alerts/AlertCard";
import { ProcessInfoItem } from "@/components/processes/ProcessInfoItem";
import { ProcessTimeline } from "@/components/processes/ProcessTimeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ProcessDetailProps {
  process: JudicialProcess;
  actions: JudicialAction[];
  alerts: Alert[];
  deadlines: Deadline[];
  notes: Note[];
  documents: LegalDocument[];
  onMarkAlertReviewed: (alertId: string) => void;
  onConfirmDeadline: (deadlineId: string, date: string) => void;
  onSuspendMonitoring: (processId: string) => void;
}

export function ProcessDetail({
  process,
  actions,
  alerts,
  deadlines,
  notes,
  documents,
  onMarkAlertReviewed,
  onConfirmDeadline,
  onSuspendMonitoring
}: ProcessDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <AlertBadge urgencyLevel={process.urgencyLevel} />
                <Badge variant={process.monitoringEnabled ? "green" : "slate"}>
                  {process.monitoringEnabled ? "Monitoreo activo" : "Monitoreo suspendido"}
                </Badge>
                <Badge variant="blue">{process.matter}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-black text-ink">{process.processNumber}</h2>
              <p className="mt-1 text-sm text-muted">
                {process.actors.join(", ")} vs. {process.defendants.join(", ")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onSuspendMonitoring(process.id)}
              className="w-full sm:w-auto"
            >
              {process.monitoringEnabled ? (
                <PauseCircle className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
              )}
              {process.monitoringEnabled ? "Suspender monitoreo" : "Activar monitoreo"}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProcessInfoItem label="Judicatura" value={process.court} />
            <ProcessInfoItem label="Provincia" value={process.province} />
            <ProcessInfoItem label="Cantón" value={process.canton} />
            <ProcessInfoItem label="Tipo de proceso" value={process.processType} />
            <ProcessInfoItem label="Estado actual" value={process.currentStatus} />
            <ProcessInfoItem label="Última actuación" value={process.lastAction} />
            <ProcessInfoItem label="Fecha última actuación" value={formatDate(process.lastActionDate)} />
            <ProcessInfoItem label="Última consulta SATJE" value={formatDateTime(process.lastCheckedAt)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-base font-bold text-ink">
                <FileText className="h-5 w-5 text-navy" aria-hidden="true" />
                Historial completo de actuaciones
              </h3>
            </CardHeader>
          </Card>
          <ProcessTimeline actions={actions} />
        </section>

        <aside className="space-y-4">
          <section className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-5">
              <Bell className="h-5 w-5 text-review" aria-hidden="true" />
              <h3 className="text-base font-bold text-ink">Alertas generadas por IA</h3>
            </div>
            {alerts.length ? (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onMarkReviewed={onMarkAlertReviewed} />
              ))
            ) : (
              <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-muted">
                Sin alertas asociadas.
              </p>
            )}
          </section>

          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-base font-bold text-ink">
                <CalendarDays className="h-5 w-5 text-navy" aria-hidden="true" />
                Plazos y audiencias
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-review">
                <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden="true" />
                Fecha tentativa calculada automáticamente. Verifique manualmente el cómputo del
                término judicial.
              </div>
              {deadlines.map((deadline) => (
                <div key={deadline.id} className="rounded-md border border-slate-200 p-3">
                  <p className="font-bold text-ink">{deadline.deadlineType}</p>
                  <p className="mt-1 text-sm text-muted">{deadline.detectedText}</p>
                  <p className="mt-2 text-sm text-ink">
                    Tentativa: {formatDate(deadline.tentativeDueDate)}
                  </p>
                  <label className="mt-3 block text-sm font-semibold text-slate-700">
                    Confirmar o modificar plazo
                    <input
                      type="date"
                      className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
                      value={deadline.confirmedDueDate ?? deadline.tentativeDueDate ?? ""}
                      onChange={(event) => onConfirmDeadline(deadline.id, event.target.value)}
                    />
                  </label>
                </div>
              ))}
              {!deadlines.length ? (
                <p className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-muted">
                  No hay plazos o audiencias asociados a este proceso. Cualquier fecha generada por
                  el análisis simulado deberá confirmarse manualmente.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-base font-bold text-ink">
                <StickyNote className="h-5 w-5 text-navy" aria-hidden="true" />
                Notas internas
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {notes.length ? (
                notes.map((note) => (
                  <div key={note.id} className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm text-ink">{note.content}</p>
                    <p className="mt-2 text-xs text-muted">{formatDateTime(note.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">Sin notas internas.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 text-base font-bold text-ink">
                <Pencil className="h-5 w-5 text-navy" aria-hidden="true" />
                Documentos relacionados
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.length ? (
                documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
                  >
                    <div>
                      <p className="font-semibold text-ink">{document.fileName}</p>
                      <p className="text-xs text-muted">
                        {document.fileType} · {formatDateTime(document.uploadedAt)}
                      </p>
                    </div>
                    <Badge variant="slate">Simulado</Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">
                  Sin documentos asociados.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
