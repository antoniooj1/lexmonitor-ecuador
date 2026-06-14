"use client";

import { useEffect, useMemo, useState } from "react";
import type { Alert, CalendarEvent, Deadline, JudicialAction, JudicialProcess } from "@/types";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DeadlineList } from "@/components/calendar/DeadlineList";
import { AppShell } from "@/components/layout/AppShell";
import { getActionsAsync, getAlertsAsync, getDeadlinesAsync, getPortfolioAsync } from "@/lib/storage";

export default function CalendarPage() {
  const [processes, setProcesses] = useState<JudicialProcess[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actions, setActions] = useState<JudicialAction[]>([]);

  useEffect(() => {
    async function loadCalendarData() {
      const [portfolioData, deadlineData, alertData, actionData] = await Promise.all([
        getPortfolioAsync(),
        getDeadlinesAsync(),
        getAlertsAsync(),
        getActionsAsync()
      ]);
      setProcesses(portfolioData);
      setDeadlines(deadlineData);
      setAlerts(alertData);
      setActions(actionData);
    }

    void loadCalendarData();
  }, []);

  const events = useMemo<CalendarEvent[]>(() => {
    const byId = new Map(processes.map((process) => [process.id, process]));

    const deadlineEvents = deadlines
      .filter((deadline) => deadline.confirmedDueDate || deadline.tentativeDueDate)
      .map<CalendarEvent>((deadline) => {
        const process = byId.get(deadline.processId);
        return {
          id: deadline.id,
          processId: deadline.processId,
          processNumber: process?.processNumber ?? "Proceso",
          title: deadline.deadlineType,
          type: deadline.deadlineType.toLowerCase().includes("audiencia") ? "audiencia" : "plazo",
          date: deadline.confirmedDueDate ?? deadline.tentativeDueDate ?? "",
          confirmed: Boolean(deadline.confirmedDueDate),
          urgencyLevel: process?.urgencyLevel ?? "media"
        };
      });

    const alertEvents = alerts
      .filter((alert) => alert.dueDate)
      .map<CalendarEvent>((alert) => ({
        id: `event-${alert.id}`,
        processId: alert.processId,
        processNumber: alert.processNumber ?? "Proceso",
        title: alert.title,
        type: "accion",
        date: alert.dueDate ?? "",
        confirmed: false,
        urgencyLevel: alert.urgencyLevel
      }));

    const hearingEvents = actions
      .filter((action) => action.actionType.toLowerCase().includes("audiencia") && action.tentativeDueDate)
      .map<CalendarEvent>((action) => {
        const process = byId.get(action.processId);
        return {
          id: `hearing-${action.id}`,
          processId: action.processId,
          processNumber: process?.processNumber ?? "Proceso",
          title: action.actionType,
          type: "audiencia",
          date: action.confirmedDueDate ?? action.tentativeDueDate ?? "",
          confirmed: Boolean(action.confirmedDueDate),
          urgencyLevel: action.urgencyLevel
        };
      });

    return [...deadlineEvents, ...alertEvents, ...hearingEvents].filter((event) => event.date);
  }, [actions, alerts, deadlines, processes]);

  return (
    <AppShell title="Calendario" subtitle="Plazos judiciales, audiencias y acciones pendientes">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <CalendarView events={events} />
        <DeadlineList events={events} />
      </div>
    </AppShell>
  );
}
