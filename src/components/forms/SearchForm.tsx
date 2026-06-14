"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

interface SearchFormProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [processNumber, setProcessNumber] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [actor, setActor] = useState("");
  const [defendant, setDefendant] = useState("");
  const [criteria, setCriteria] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const query = [processNumber, claimNumber, actor, defendant, criteria].filter(Boolean).join(" ");
    if (!query.trim()) {
      setError("Ingrese al menos un criterio de búsqueda.");
      return;
    }

    onSearch(query);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Input
              label="Número de proceso judicial"
              value={processNumber}
              onChange={(event) => setProcessNumber(event.target.value)}
              placeholder="11333-2026-00452"
            />
            <Input
              label="Número de demanda"
              value={claimNumber}
              onChange={(event) => setClaimNumber(event.target.value)}
              placeholder="Demanda o expediente"
            />
            <Input
              label="Nombre del actor"
              value={actor}
              onChange={(event) => setActor(event.target.value)}
              placeholder="María Pérez"
            />
            <Input
              label="Nombre del demandado"
              value={defendant}
              onChange={(event) => setDefendant(event.target.value)}
              placeholder="Juan Rodríguez"
            />
            <Input
              label="Criterio relacionado"
              value={criteria}
              onChange={(event) => setCriteria(event.target.value)}
              placeholder="Civil, audiencia, provincia..."
            />
          </div>
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{error}</p> : null}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted">
              SATJE se consulta en modo simulado para el MVP. No se realiza scraping ni evasión de
              controles.
            </p>
            <Button type="submit" isLoading={loading} className="md:w-auto">
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar en SATJE
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
