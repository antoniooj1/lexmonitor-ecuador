"use client";

import { useMemo, useState } from "react";
import { FileSearch, FolderOpen, RefreshCw } from "lucide-react";
import type { JudicialProcess } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { SearchForm } from "@/components/forms/SearchForm";
import { ProcessTable } from "@/components/processes/ProcessTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Button, LinkButton } from "@/components/ui/Button";
import { addProcessesToPortfolioAsync } from "@/lib/storage";
import { satjeService } from "@/services/satjeService";

export default function SearchPage() {
  const [results, setResults] = useState<JudicialProcess[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const selectedProcesses = useMemo(
    () => results.filter((process) => selectedIds.includes(process.id)),
    [results, selectedIds]
  );

  const onSearch = async (query: string) => {
    setLoading(true);
    setError(false);
    setMessage("");
    setSearched(true);
    setLastQuery(query);

    try {
      const found = await satjeService.searchProcesses(query);
      setResults(found);
      setSelectedIds([]);
    } catch {
      setError(true);
      setResults([]);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const onAddSelected = () => {
    void addProcessesToPortfolioAsync(selectedProcesses).then((result) => {
      setMessage(
        result.addedCount
          ? `${result.addedCount} proceso(s) incorporado(s) al portafolio. ${result.existingCount ? `${result.existingCount} ya constaba(n) en cartera.` : ""}`
          : "Los procesos seleccionados ya constaban en el portafolio de monitoreo."
      );
      setSelectedIds([]);
    });
  };

  return (
    <AppShell
      title="Buscar procesos"
      subtitle="Consulta simulada SATJE con datos de prueba para el MVP"
    >
      <div className="space-y-6">
        <SearchForm onSearch={onSearch} loading={loading} />
        {message ? (
          <div className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-success sm:flex-row sm:items-center sm:justify-between">
            <span>{message}</span>
            <LinkButton href="/portfolio" variant="success" size="sm">
              <FolderOpen className="h-4 w-4" aria-hidden="true" />
              Ver portafolio
            </LinkButton>
          </div>
        ) : null}
        {loading ? (
          <LoadingState
            label="Consultando procesos judiciales en SATJE..."
            description="Esta consulta usa datos simulados del MVP y no accede al sistema público real."
          />
        ) : null}
        {error ? (
          <ErrorState
            title="No fue posible consultar SATJE"
            message="No fue posible consultar SATJE. Intente nuevamente más tarde."
            action={
              lastQuery ? (
                <Button variant="outline" size="sm" onClick={() => onSearch(lastQuery)}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reintentar
                </Button>
              ) : null
            }
          />
        ) : null}
        {!loading && !error && searched && results.length ? (
          <ProcessTable
            processes={results}
            selectedIds={selectedIds}
            onSelectedChange={setSelectedIds}
            onAddSelected={onAddSelected}
          />
        ) : null}
        {!loading && !error && searched && !results.length ? (
          <EmptyState
            title="No se encontraron procesos"
            description="No existen coincidencias en los datos simulados para el criterio ingresado. Revise número de proceso, partes procesales, provincia o materia."
            icon={FileSearch}
            tone="blue"
          />
        ) : null}
        {!searched ? (
          <EmptyState
            title="Ingrese un criterio de consulta judicial"
            description="Puede buscar por número de proceso, número de demanda, actor, demandado, materia, provincia o texto relacionado con la causa."
            icon={FileSearch}
            tone="blue"
          />
        ) : null}
      </div>
    </AppShell>
  );
}
