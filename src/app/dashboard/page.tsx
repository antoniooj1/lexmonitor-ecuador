"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileSearch,
  FolderOpen,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import type { Alert, JudicialAction, JudicialProcess } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  appendActionsAsync,
  appendAlertsAsync,
  getActionsAsync,
  getAlertsAsync,
  getPortfolioAsync,
  savePortfolioAsync
} from "@/lib/storage";
import { runDailyMonitoring } from "@/services/monitoringService";
import { formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const [processes, setProcesses] = useState<JudicialProcess[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actions, setActions] = useState<JudicialAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const [portfolioData, alertData, actionData] = await Promise.all([
        getPortfolioAsync(),
        getAlertsAsync(),
        getActionsAsync()
      ]);
      setProcesses(portfolioData);
      setAlerts(alertData);
      setActions(actionData);
    }

    void loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const pendingAlerts = alerts.filter((alert) => alert.status === "pendiente");
    const urgentAlerts = pendingAlerts.filter((alert) => alert.urgencyLevel === "alta");
    const upcomingDeadlines = alerts.filter((alert) => alert.dueDate && alert.status === "pendiente");
    const upcomingHearings = actions.filter((action) => action.actionType.toLowerCase().includes("audiencia"));
    const staleProcesses = processes.filter((process) => {
      const diff = Date.now() - new Date(process.lastActionDate).getTime();
      return diff > 1000 * 60 * 60 * 24 * 30;
    });

    return {
      total: processes.length,
      urgent: urgentAlerts.length,
      newActions: actions.filter((action) => !action.reviewed).length,
      upcomingDeadlines: upcomingDeadlines.length,
      upcomingHearings: upcomingHearings.length,
      stale: staleProcesses.length,
      satjeFailures: 1,
      pendingReview: pendingAlerts.length
    };
  }, [actions, alerts, processes]);

  const onRunMonitoring = async () => {
    setLoading(true);
    const result = await runDailyMonitoring(processes);
    await savePortfolioAsync(result.updatedProcesses);
    await appendActionsAsync(result.newActions);
    await appendAlertsAsync(result.generatedAlerts);
    setProcesses(result.updatedProcesses);
    setActions(await getActionsAsync());
    setAlerts(await getAlertsAsync());
    setLastRun(result.checkedAt);
    setLoading(false);
  };

  return (
    <AppShell
      title="Dashboard"
      subtitle="Vista ejecutiva del portafolio judicial y monitoreo simulado SATJE"
    >
      <div className="space-y-6">
        <Card className="overflow-hidden border-blue-200 bg-white">
          <div className="h-1 bg-navy" />
          <CardContent className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">Modo SATJE mock</Badge>
                <Badge variant="green">Sin scraping ni evasión de controles</Badge>
              </div>
              <h2 className="mt-3 text-xl font-black text-ink">Control diario del portafolio judicial</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Ejecuta una revisión simulada de los procesos con monitoreo activo, identifica
                nuevas actuaciones, aplica reglas de análisis jurídico inicial y registra alertas
                operativas para revisión del equipo legal.
              </p>
              {lastRun ? (
                <p className="mt-2 text-xs font-semibold text-success">
                  Última ejecución: {formatDateTime(lastRun)}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Button onClick={onRunMonitoring} isLoading={loading} className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Ejecutar monitoreo ahora
              </Button>
              <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
                Revisión local con datos de prueba
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <StatusPanel
            label="Pendiente crítico"
            value={`${metrics.urgent} alerta(s) urgente(s)`}
            description="Revise de inmediato providencias con término, citación o audiencia."
            tone="red"
          />
          <StatusPanel
            label="Agenda procesal"
            value={`${metrics.upcomingDeadlines + metrics.upcomingHearings} evento(s)`}
            description="Incluye plazos tentativos, audiencias y acciones pendientes."
            tone="blue"
          />
          <StatusPanel
            label="Portafolio activo"
            value={`${processes.filter((process) => process.monitoringEnabled).length} proceso(s)`}
            description="Procesos habilitados para control diario simulado."
            tone="green"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Procesos controlados"
            value={metrics.total}
            description="Causas incorporadas al portafolio personal."
            icon={FolderOpen}
            tone="blue"
          />
          <DashboardCard
            title="Alertas urgentes"
            value={metrics.urgent}
            description="Requieren atención prioritaria."
            icon={AlertTriangle}
            tone="red"
          />
          <DashboardCard
            title="Nuevas actuaciones"
            value={metrics.newActions}
            description="Actuaciones no revisadas por el equipo."
            icon={FileSearch}
            tone="orange"
          />
          <DashboardCard
            title="Plazos próximos"
            value={metrics.upcomingDeadlines}
            description="Fechas que requieren validación manual."
            icon={CalendarClock}
            tone="yellow"
          />
          <DashboardCard
            title="Audiencias próximas"
            value={metrics.upcomingHearings}
            description="Diligencias registradas en actuaciones."
            icon={Clock3}
            tone="green"
          />
          <DashboardCard
            title="Procesos sin movimiento reciente"
            value={metrics.stale}
            description="Causas que podrían requerir impulso."
            icon={Clock3}
            tone="slate"
          />
          <DashboardCard
            title="Consultas fallidas SATJE"
            value={metrics.satjeFailures}
            description="Control operativo del servicio externo."
            icon={Bell}
            tone="orange"
          />
          <DashboardCard
            title="Alertas pendientes de revisión"
            value={metrics.pendingReview}
            description="Pendientes de validación jurídica."
            icon={CheckCircle2}
            tone="blue"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <RecentActivity title="Últimas actuaciones detectadas" actions={actions.slice(0, 4)} />
          <RecentActivity title="Últimas alertas generadas por IA" alerts={alerts.slice(0, 4)} />
          <RecentActivity
            title="Procesos con monitoreo activo"
            processes={processes.filter((process) => process.monitoringEnabled).slice(0, 4)}
          />
        </div>
      </div>
    </AppShell>
  );
}

function StatusPanel({
  label,
  value,
  description,
  tone
}: {
  label: string;
  value: string;
  description: string;
  tone: "red" | "blue" | "green";
}) {
  const toneClasses = {
    red: "border-red-200 bg-red-50 text-danger",
    blue: "border-blue-200 bg-blue-50 text-navy",
    green: "border-green-200 bg-green-50 text-success"
  };

  return (
    <div className={`rounded-lg border p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-black uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
      <p className="mt-1 text-sm leading-5 text-slate-700">{description}</p>
    </div>
  );
}
