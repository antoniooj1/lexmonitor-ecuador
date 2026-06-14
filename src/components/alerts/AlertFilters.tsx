"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface AlertFiltersProps {
  urgency: string;
  status: string;
  processQuery: string;
  actionType: string;
  date: string;
  onChange: (filters: {
    urgency: string;
    status: string;
    processQuery: string;
    actionType: string;
    date: string;
  }) => void;
}

type AlertFilterKey = "urgency" | "status" | "processQuery" | "actionType" | "date";

export function AlertFilters({
  urgency,
  status,
  processQuery,
  actionType,
  date,
  onChange
}: AlertFiltersProps) {
  const setFilter = (key: AlertFilterKey, value: string) =>
    onChange({ urgency, status, processQuery, actionType, date, [key]: value });

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-5">
      <Select
        label="Urgencia"
        value={urgency}
        onChange={(event) => setFilter("urgency", event.target.value)}
        options={[
          { label: "Todas", value: "all" },
          { label: "Alta urgencia", value: "alta" },
          { label: "Media urgencia", value: "media" },
          { label: "Baja urgencia", value: "baja" }
        ]}
      />
      <Select
        label="Estado"
        value={status}
        onChange={(event) => setFilter("status", event.target.value)}
        options={[
          { label: "Todas", value: "all" },
          { label: "Pendientes", value: "pendiente" },
          { label: "Revisadas", value: "revisada" }
        ]}
      />
      <Input
        label="Proceso"
        value={processQuery}
        onChange={(event) => setFilter("processQuery", event.target.value)}
        placeholder="Número de proceso"
      />
      <Input
        label="Tipo de actuación"
        value={actionType}
        onChange={(event) => setFilter("actionType", event.target.value)}
        placeholder="Audiencia, citación..."
      />
      <Input
        label="Fecha"
        type="date"
        value={date}
        onChange={(event) => setFilter("date", event.target.value)}
      />
    </div>
  );
}
