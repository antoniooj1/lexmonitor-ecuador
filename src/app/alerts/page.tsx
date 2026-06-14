"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Search } from "lucide-react";
import type { Alert } from "@/types";
import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertFilters } from "@/components/alerts/AlertFilters";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getAlertsAsync, markAlertAsReviewedAsync, saveAlertsAsync } from "@/lib/storage";
import { matchesSearch } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState({
    urgency: "all",
    status: "all",
    processQuery: "",
    actionType: "",
    date: ""
  });
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    void getAlertsAsync().then(setAlerts);
  }, []);

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const urgencyMatch = filters.urgency === "all" || alert.urgencyLevel === filters.urgency;
        const statusMatch = filters.status === "all" || alert.status === filters.status;
        const processMatch =
          !filters.processQuery || matchesSearch(alert.processNumber ?? "", filters.processQuery);
        const actionMatch =
          !filters.actionType || matchesSearch(alert.actionType ?? "", filters.actionType);
        const dateMatch =
          !filters.date || alert.createdAt.slice(0, 10) === filters.date || alert.dueDate === filters.date;
        return urgencyMatch && statusMatch && processMatch && actionMatch && dateMatch;
      }),
    [alerts, filters]
  );

  const onMarkReviewed = (alertId: string) => {
    void markAlertAsReviewedAsync(alertId).then(setAlerts);
  };

  const onOpenEditDeadline = (alert: Alert) => {
    setEditingAlert(alert);
    setDueDate(alert.dueDate ?? "");
  };

  const onSaveDeadline = () => {
    if (!editingAlert) return;
    const updatedAlerts = alerts.map((alert) =>
      alert.id === editingAlert.id ? { ...alert, dueDate: dueDate || null } : alert
    );
    void saveAlertsAsync(updatedAlerts).then(() => {
      setAlerts(updatedAlerts);
      setEditingAlert(null);
    });
  };

  return (
    <AppShell title="Alertas inteligentes" subtitle="Alertas IA simuladas por actuación judicial">
      <div className="space-y-6">
        <AlertFilters {...filters} onChange={setFilters} />
        {filteredAlerts.length ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkReviewed={onMarkReviewed}
                onEditDeadline={onOpenEditDeadline}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay alertas con los filtros aplicados"
            description="Revise urgencia, estado, proceso, fecha o tipo de actuación. Las alertas revisadas se conservan para trazabilidad operativa."
            icon={BellRing}
            tone="blue"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    urgency: "all",
                    status: "all",
                    processQuery: "",
                    actionType: "",
                    date: ""
                  })
                }
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Limpiar filtros
              </Button>
            }
          />
        )}

        <Modal
          open={Boolean(editingAlert)}
          title="Editar plazo de alerta"
          onClose={() => setEditingAlert(null)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingAlert(null)}>
                Cancelar
              </Button>
              <Button onClick={onSaveDeadline}>Guardar plazo</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted">
              La fecha editada queda como referencia operativa del MVP. Verifique manualmente el
              cómputo del término judicial antes de actuar.
            </p>
            <Input
              label="Fecha tentativa o confirmada"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
