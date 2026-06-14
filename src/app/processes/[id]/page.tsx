"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type {
  Alert,
  Deadline,
  Document as LegalDocument,
  JudicialAction,
  JudicialProcess,
  Note
} from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { ProcessDetail } from "@/components/processes/ProcessDetail";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  confirmDeadlineAsync,
  getActionsAsync,
  getAlertsAsync,
  getDeadlinesAsync,
  getDocumentsAsync,
  getNotesAsync,
  getPortfolioAsync,
  markAlertAsReviewedAsync,
  toggleProcessMonitoringAsync
} from "@/lib/storage";

export default function ProcessDetailPage() {
  const params = useParams<{ id: string }>();
  const [processes, setProcesses] = useState<JudicialProcess[]>([]);
  const [actions, setActions] = useState<JudicialAction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);

  useEffect(() => {
    async function loadProcessData() {
      const [portfolioData, actionData, alertData, deadlineData, noteData, documentData] =
        await Promise.all([
          getPortfolioAsync(),
          getActionsAsync(),
          getAlertsAsync(),
          getDeadlinesAsync(),
          getNotesAsync(),
          getDocumentsAsync()
        ]);
      setProcesses(portfolioData);
      setActions(actionData);
      setAlerts(alertData);
      setDeadlines(deadlineData);
      setNotes(noteData);
      setDocuments(documentData);
    }

    void loadProcessData();
  }, []);

  const process = useMemo(
    () => processes.find((item) => item.id === params.id || item.processNumber === params.id),
    [params.id, processes]
  );

  const scopedActions = useMemo(
    () =>
      process
        ? actions
            .filter((action) => action.processId === process.id)
            .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime())
        : [],
    [actions, process]
  );

  const scopedAlerts = useMemo(
    () => (process ? alerts.filter((alert) => alert.processId === process.id) : []),
    [alerts, process]
  );

  const scopedDeadlines = useMemo(
    () => (process ? deadlines.filter((deadline) => deadline.processId === process.id) : []),
    [deadlines, process]
  );

  const scopedNotes = useMemo(
    () => (process ? notes.filter((note) => note.processId === process.id) : []),
    [notes, process]
  );

  const scopedDocuments = useMemo(
    () => (process ? documents.filter((document) => document.processId === process.id) : []),
    [documents, process]
  );

  if (!process) {
    return (
      <AppShell title="Detalle del proceso" subtitle="Proceso no encontrado">
        <EmptyState
          title="Proceso no encontrado"
          description="El proceso solicitado no existe en el portafolio local del MVP."
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Detalle del proceso" subtitle={process.processNumber}>
      <ProcessDetail
        process={process}
        actions={scopedActions}
        alerts={scopedAlerts}
        deadlines={scopedDeadlines}
        notes={scopedNotes}
        documents={scopedDocuments}
        onMarkAlertReviewed={(alertId) => void markAlertAsReviewedAsync(alertId).then(setAlerts)}
        onConfirmDeadline={(deadlineId, date) => void confirmDeadlineAsync(deadlineId, date).then(setDeadlines)}
        onSuspendMonitoring={(processId) => void toggleProcessMonitoringAsync(processId).then(setProcesses)}
      />
    </AppShell>
  );
}
