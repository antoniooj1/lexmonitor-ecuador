"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, FilePlus2, ShieldCheck } from "lucide-react";
import type { Alert, JudicialAction, JudicialProcess } from "@/types";
import {
  DEMO_USER_ID,
  MATTERS,
  PROCESS_STATUSES,
  PROVINCES,
  SATJE_COMPLIANCE_NOTICE,
  SATJE_OFFICIAL_SEARCH_URL
} from "@/lib/constants";
import {
  addProcessesToPortfolioAsync,
  appendActionsAsync,
  appendAlertsAsync,
  getCurrentUserAsync,
  getPortfolioAsync
} from "@/lib/storage";
import { toISODate } from "@/lib/utils";
import { analyzeJudicialAction } from "@/services/aiAnalysisService";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface OfficialSatjeImportProps {
  onImported?: (message: string) => void;
}

interface ManualImportForm {
  processNumber: string;
  court: string;
  province: string;
  canton: string;
  matter: string;
  processType: string;
  actors: string;
  defendants: string;
  currentStatus: JudicialProcess["currentStatus"];
  lastAction: string;
  lastActionDate: string;
}

const today = toISODate(new Date());

const initialForm: ManualImportForm = {
  processNumber: "",
  court: "",
  province: PROVINCES[0],
  canton: "",
  matter: MATTERS[0],
  processType: "",
  actors: "",
  defendants: "",
  currentStatus: PROCESS_STATUSES[0],
  lastAction: "",
  lastActionDate: today
};

function createUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-000000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ ((Math.random() * 16) >> (Number(char) / 4))).toString(16)
  );
}

function splitParties(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function OfficialSatjeImport({ onImported }: OfficialSatjeImportProps) {
  const [form, setForm] = useState<ManualImportForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <Key extends keyof ManualImportForm>(key: Key, value: ManualImportForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const processNumber = form.processNumber.trim();
    if (!processNumber) {
      setError("Ingrese el número de proceso obtenido desde el portal oficial.");
      return;
    }

    setSaving(true);

    try {
      const portfolio = await getPortfolioAsync();
      const exists = portfolio.some((process) => process.processNumber === processNumber);
      if (exists) {
        const duplicateMessage = `El proceso ${processNumber} ya consta en el portafolio de monitoreo.`;
        setError(duplicateMessage);
        onImported?.(duplicateMessage);
        return;
      }

      const user = await getCurrentUserAsync();
      const now = new Date().toISOString();
      const actionText =
        form.lastAction.trim() ||
        "Actuación registrada manualmente desde una consulta realizada por el usuario en el portal oficial de la Función Judicial.";
      const analysis = analyzeJudicialAction(actionText);
      const processId = createUuid();
      const actionId = createUuid();
      const shouldCreateAlert = analysis.urgencyLevel !== "baja" || analysis.hasDeadline;

      const process: JudicialProcess = {
        id: processId,
        userId: user.id || DEMO_USER_ID,
        processNumber,
        court: form.court.trim() || "Judicatura registrada desde consulta oficial",
        province: form.province,
        canton: form.canton.trim() || "Por verificar",
        matter: form.matter,
        processType: form.processType.trim() || "Por clasificar",
        actors: splitParties(form.actors),
        defendants: splitParties(form.defendants),
        currentStatus: form.currentStatus,
        lastAction: actionText,
        lastActionDate: form.lastActionDate || today,
        satjeSourceUrl: SATJE_OFFICIAL_SEARCH_URL,
        monitoringEnabled: true,
        lastCheckedAt: now,
        createdAt: now,
        updatedAt: now,
        urgencyLevel: analysis.urgencyLevel,
        nextPendingAction: analysis.suggestedAction,
        activeAlertsCount: shouldCreateAlert ? 1 : 0
      };

      const action: JudicialAction = {
        id: actionId,
        processId,
        actionDate: process.lastActionDate,
        actionType: analysis.actionType,
        rawText: actionText,
        aiSummary: analysis.summary,
        suggestedAction: analysis.suggestedAction,
        urgencyLevel: analysis.urgencyLevel,
        hasDeadline: analysis.hasDeadline,
        detectedDeadlineText: analysis.detectedDeadlineText,
        tentativeDueDate: analysis.tentativeDueDate,
        confirmedDueDate: null,
        reviewed: false,
        createdAt: now,
        generatedAlert: shouldCreateAlert
      };

      const alert: Alert | null = shouldCreateAlert
        ? {
            id: createUuid(),
            processId,
            actionId,
            title: analysis.generatedAlertTitle,
            description: analysis.generatedAlertDescription,
            urgencyLevel: analysis.urgencyLevel,
            suggestedAction: analysis.suggestedAction,
            dueDate: analysis.tentativeDueDate,
            status: "pendiente",
            reviewedAt: null,
            createdAt: now,
            processNumber,
            actionType: analysis.actionType
          }
        : null;

      await addProcessesToPortfolioAsync([process]);
      await appendActionsAsync([action]);
      if (alert) await appendAlertsAsync([alert]);

      onImported?.(
        `Proceso ${processNumber} agregado desde una consulta oficial registrada manualmente.`
      );
      setForm(initialForm);
    } catch {
      setError("No fue posible registrar el proceso oficial. Revise los datos e intente nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Consulta oficial asistida
            </div>
            <h2 className="text-lg font-bold text-ink">Investigar en la Función Judicial</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
              Abra el portal oficial, consulte el caso y registre aquí los datos relevantes para
              incorporarlo al portafolio de monitoreo de LexMonitor.
            </p>
          </div>
          <LinkButton
            href={SATJE_OFFICIAL_SEARCH_URL}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            className="w-full lg:w-auto"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Abrir portal oficial
          </LinkButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-ink">Uso permitido para este MVP</p>
          <p>
            Esta función no extrae información automáticamente, no evade controles y no reemplaza
            la revisión profesional del expediente. {SATJE_COMPLIANCE_NOTICE}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input
              label="Número de proceso"
              value={form.processNumber}
              onChange={(event) => setField("processNumber", event.target.value)}
              placeholder="11333-2026-00452"
            />
            <Input
              label="Judicatura"
              value={form.court}
              onChange={(event) => setField("court", event.target.value)}
              placeholder="Unidad Judicial Civil de Loja"
            />
            <Select
              label="Provincia"
              value={form.province}
              onChange={(event) => setField("province", event.target.value)}
              options={PROVINCES.map((province) => ({ label: province, value: province }))}
            />
            <Input
              label="Cantón"
              value={form.canton}
              onChange={(event) => setField("canton", event.target.value)}
              placeholder="Loja"
            />
            <Select
              label="Materia"
              value={form.matter}
              onChange={(event) => setField("matter", event.target.value)}
              options={MATTERS.map((matter) => ({ label: matter, value: matter }))}
            />
            <Input
              label="Tipo de proceso"
              value={form.processType}
              onChange={(event) => setField("processType", event.target.value)}
              placeholder="Ejecutivo, ordinario, alimentos..."
            />
            <Select
              label="Estado procesal"
              value={form.currentStatus}
              onChange={(event) =>
                setField("currentStatus", event.target.value as JudicialProcess["currentStatus"])
              }
              options={PROCESS_STATUSES.map((status) => ({ label: status, value: status }))}
            />
            <Input
              label="Fecha de última actuación"
              type="date"
              value={form.lastActionDate}
              onChange={(event) => setField("lastActionDate", event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Textarea
              label="Actor o actores"
              value={form.actors}
              onChange={(event) => setField("actors", event.target.value)}
              placeholder="María Pérez; Compañía Alfa S.A."
              className="min-h-24"
            />
            <Textarea
              label="Demandado o demandados"
              value={form.defendants}
              onChange={(event) => setField("defendants", event.target.value)}
              placeholder="Juan Rodríguez; Carlos Zambrano"
              className="min-h-24"
            />
          </div>

          <Textarea
            label="Última actuación copiada o resumida desde la consulta oficial"
            value={form.lastAction}
            onChange={(event) => setField("lastAction", event.target.value)}
            placeholder="Previo a calificar la demanda, complete la parte actora en el término de cinco días."
          />

          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              El análisis de urgencia se genera con reglas internas simuladas y debe ser revisado
              por el abogado responsable.
            </p>
            <Button type="submit" isLoading={saving} className="sm:w-auto">
              <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              Agregar al portafolio
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
