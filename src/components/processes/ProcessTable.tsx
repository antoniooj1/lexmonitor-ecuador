"use client";

import { useMemo, useState } from "react";
import { Building2, CalendarClock, CheckCircle2, Plus, Search } from "lucide-react";
import type { JudicialProcess } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, matchesSearch } from "@/lib/utils";

interface ProcessTableProps {
  processes: JudicialProcess[];
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
  onAddSelected: () => void;
}

type SortKey = "lastActionDate" | "matter" | "province" | "currentStatus";

export function ProcessTable({
  processes,
  selectedIds,
  onSelectedChange,
  onAddSelected
}: ProcessTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastActionDate");

  const visibleProcesses = useMemo(() => {
    const filtered = processes.filter((process) => {
      if (!query.trim()) return true;
      const haystack = [
        process.processNumber,
        process.court,
        process.province,
        process.canton,
        process.matter,
        process.processType,
        process.currentStatus,
        process.actors.join(" "),
        process.defendants.join(" "),
        process.lastAction
      ].join(" ");
      return matchesSearch(haystack, query);
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === "lastActionDate") {
        return new Date(b.lastActionDate).getTime() - new Date(a.lastActionDate).getTime();
      }
      return String(a[sortKey]).localeCompare(String(b[sortKey]), "es");
    });
  }, [processes, query, sortKey]);

  const toggleSelected = (id: string) => {
    onSelectedChange(
      selectedIds.includes(id) ? selectedIds.filter((selected) => selected !== id) : [...selectedIds, id]
    );
  };

  const allVisibleSelected =
    visibleProcesses.length > 0 && visibleProcesses.every((process) => selectedIds.includes(process.id));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px_auto]">
        <Input
          label="Buscar dentro de resultados"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Número, materia, actor, demandado..."
        />
        <Select
          label="Ordenar por"
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          options={[
            { label: "Fecha última actuación", value: "lastActionDate" },
            { label: "Materia", value: "matter" },
            { label: "Provincia", value: "province" },
            { label: "Estado", value: "currentStatus" }
          ]}
        />
        <div className="flex items-end">
          <Button onClick={onAddSelected} disabled={!selectedIds.length} className="w-full md:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar al portafolio
          </Button>
        </div>
      </div>

      {!visibleProcesses.length ? (
        <EmptyState
          title="Sin resultados visibles"
          description="No hay coincidencias con el filtro aplicado. Puede ajustar el texto interno o realizar una nueva consulta simulada."
          compact
        />
      ) : (
        <>
        <div className="space-y-3 lg:hidden">
          {visibleProcesses.map((process) => (
            <MobileProcessResult
              key={process.id}
              process={process}
              selected={selectedIds.includes(process.id)}
              onToggle={() => toggleSelected(process.id)}
            />
          ))}
        </div>

        <Card className="hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-navy"
                      checked={allVisibleSelected}
                      onChange={(event) =>
                        onSelectedChange(
                          event.target.checked
                            ? Array.from(new Set([...selectedIds, ...visibleProcesses.map((process) => process.id)]))
                            : selectedIds.filter(
                                (selected) => !visibleProcesses.some((process) => process.id === selected)
                              )
                        )
                      }
                      aria-label="Seleccionar resultados visibles"
                    />
                  </th>
                  <th className="px-4 py-3">Número de proceso</th>
                  <th className="px-4 py-3">Judicatura</th>
                  <th className="px-4 py-3">Provincia</th>
                  <th className="px-4 py-3">Cantón</th>
                  <th className="px-4 py-3">Materia</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Demandado</th>
                  <th className="px-4 py-3">Ingreso</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Última actuación judicial</th>
                  <th className="px-4 py-3">Fecha última actuación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {visibleProcesses.map((process) => (
                  <tr key={process.id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-navy"
                        checked={selectedIds.includes(process.id)}
                        onChange={() => toggleSelected(process.id)}
                        aria-label={`Seleccionar proceso ${process.processNumber}`}
                      />
                    </td>
                    <td className="px-4 py-4 font-bold text-ink">
                      <span className="block whitespace-nowrap">{process.processNumber}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{process.court}</td>
                    <td className="px-4 py-4 text-slate-700">
                      <span className="whitespace-nowrap">{process.province}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{process.canton}</td>
                    <td className="px-4 py-4 text-slate-700">{process.matter}</td>
                    <td className="px-4 py-4 text-slate-700">{process.processType}</td>
                    <td className="px-4 py-4 text-slate-700">{process.actors.join(", ")}</td>
                    <td className="px-4 py-4 text-slate-700">{process.defendants.join(", ")}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatDate(process.createdAt.slice(0, 10))}
                    </td>
                    <td className="px-4 py-4">
                      <AlertBadge urgencyLevel={process.urgencyLevel} />
                      <p className="mt-2 text-xs text-muted">{process.currentStatus}</p>
                    </td>
                    <td className="max-w-sm px-4 py-4 leading-6 text-slate-700">{process.lastAction}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(process.lastActionDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </>
      )}

      <div className="flex items-center gap-2 text-sm text-muted">
        <Search className="h-4 w-4" aria-hidden="true" />
        {visibleProcesses.length} resultado(s), {selectedIds.length} seleccionado(s)
      </div>
    </div>
  );
}

function MobileProcessResult({
  process,
  selected,
  onToggle
}: {
  process: JudicialProcess;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-lg border bg-white p-4 text-left shadow-sm transition ${
        selected ? "border-navy ring-2 ring-blue-100" : "border-slate-200"
      }`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-base font-black text-ink">{process.processNumber}</p>
          <p className="mt-1 text-sm leading-5 text-muted">
            {process.actors.join(", ")} vs. {process.defendants.join(", ")}
          </p>
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-navy bg-navy text-white" : "border-slate-300 bg-white text-transparent"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <AlertBadge urgencyLevel={process.urgencyLevel} />
        <Badge variant="blue">{process.matter}</Badge>
        <Badge variant="slate">{process.currentStatus}</Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p className="flex gap-2">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
          <span>
            {process.court} · {process.province}, {process.canton}
          </span>
        </p>
        <p className="flex gap-2">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-review" aria-hidden="true" />
          <span>
            Última actuación: {formatDate(process.lastActionDate)} · {process.lastAction}
          </span>
        </p>
      </div>
    </button>
  );
}
