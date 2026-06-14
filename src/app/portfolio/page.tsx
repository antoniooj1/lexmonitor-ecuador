"use client";

import { useEffect, useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import type { JudicialProcess } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { ProcessCard } from "@/components/processes/ProcessCard";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { getPortfolioAsync, toggleProcessMonitoringAsync } from "@/lib/storage";
import { MATTERS, PROCESS_STATUSES, PROVINCES } from "@/lib/constants";

export default function PortfolioPage() {
  const [processes, setProcesses] = useState<JudicialProcess[]>([]);
  const [urgency, setUrgency] = useState("all");
  const [matter, setMatter] = useState("all");
  const [status, setStatus] = useState("all");
  const [province, setProvince] = useState("all");

  useEffect(() => {
    void getPortfolioAsync().then(setProcesses);
  }, []);

  const filteredProcesses = useMemo(
    () =>
      processes.filter((process) => {
        const urgencyMatch = urgency === "all" || process.urgencyLevel === urgency;
        const matterMatch = matter === "all" || process.matter === matter;
        const statusMatch = status === "all" || process.currentStatus === status;
        const provinceMatch = province === "all" || process.province === province;
        return urgencyMatch && matterMatch && statusMatch && provinceMatch;
      }),
    [matter, processes, province, status, urgency]
  );

  const onToggleMonitoring = (processId: string) => {
    void toggleProcessMonitoringAsync(processId).then(setProcesses);
  };

  return (
    <AppShell title="Portafolio" subtitle="Procesos guardados y estado de monitoreo personal">
      <div className="space-y-6">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
          <Select
            label="Urgencia"
            value={urgency}
            onChange={(event) => setUrgency(event.target.value)}
            options={[
              { label: "Todas", value: "all" },
              { label: "Alta", value: "alta" },
              { label: "Media", value: "media" },
              { label: "Baja", value: "baja" }
            ]}
          />
          <Select
            label="Materia"
            value={matter}
            onChange={(event) => setMatter(event.target.value)}
            options={[{ label: "Todas", value: "all" }, ...MATTERS.map((item) => ({ label: item, value: item }))]}
          />
          <Select
            label="Estado"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: "Todos", value: "all" },
              ...PROCESS_STATUSES.map((item) => ({ label: item, value: item }))
            ]}
          />
          <Select
            label="Provincia"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
            options={[
              { label: "Todas", value: "all" },
              ...PROVINCES.map((item) => ({ label: item, value: item }))
            ]}
          />
        </div>

        {filteredProcesses.length ? (
          <div className="space-y-4">
            {filteredProcesses.map((process) => (
              <ProcessCard
                key={process.id}
                process={process}
                onToggleMonitoring={onToggleMonitoring}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay procesos en el portafolio"
            description="Busque procesos judiciales en el modo SATJE simulado, seleccione una o varias causas y agréguelas para activar el control operativo."
            icon={FileSearch}
            tone="blue"
            action={
              <LinkButton href="/search" variant="primary">
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar procesos
              </LinkButton>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
