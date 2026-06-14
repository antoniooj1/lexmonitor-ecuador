"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, ListChecks } from "lucide-react";
import type { CalendarEvent } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

type CalendarMode = "month" | "week" | "list";

interface CalendarViewProps {
  events: CalendarEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>("month");

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events]
  );

  const monthDays = useMemo(() => buildCurrentMonthDays(), []);
  const weekEvents = sortedEvents.filter((event) => isWithinNextDays(event.date, 7));

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="flex gap-3 text-sm text-review">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Fecha tentativa calculada automáticamente. Verifique manualmente el cómputo del término
            judicial.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <CalendarDays className="h-5 w-5 text-navy" aria-hidden="true" />
            Calendario de plazos y audiencias
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "month" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("month")}
            >
              Mensual
            </Button>
            <Button
              variant={mode === "week" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("week")}
            >
              Semanal
            </Button>
            <Button
              variant={mode === "list" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("list")}
            >
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mode === "month" ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
              {monthDays.map((day) => {
                const dayEvents = sortedEvents.filter((event) => event.date === day.iso);
                return (
                  <div
                    key={day.iso}
                    className={`min-h-28 rounded-md border p-3 ${
                      dayEvents.length ? "border-blue-200 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase text-muted">{day.weekday}</p>
                    <p className="mt-1 text-lg font-black text-ink">{day.day}</p>
                    <div className="mt-3 space-y-2">
                      {dayEvents.map((event) => (
                        <EventPill key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {mode === "week" ? (
            <div className="space-y-3">
              {weekEvents.length ? (
                weekEvents.map((event) => <EventRow key={event.id} event={event} />)
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">
                  No hay plazos, audiencias ni recordatorios en los próximos 7 días.
                </p>
              )}
            </div>
          ) : null}

          {mode === "list" ? (
            <div className="space-y-3">
              {sortedEvents.length ? (
                sortedEvents.map((event) => <EventRow key={event.id} event={event} />)
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">
                  No hay eventos procesales registrados en el calendario del MVP.
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
      <div className="flex flex-wrap gap-1">
        <Badge variant={event.confirmed ? "green" : "orange"}>{event.confirmed ? "Confirmada" : "Tentativa"}</Badge>
      </div>
      <p className="mt-1 text-xs font-bold text-ink">{event.title}</p>
      <p className="text-xs text-muted">{event.processNumber}</p>
    </div>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-black text-ink">{formatDate(event.date)}</p>
        <p className="text-xs text-muted">{event.type}</p>
      </div>
      <div>
        <p className="font-bold text-ink">{event.title}</p>
        <p className="text-sm text-muted">{event.processNumber}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <AlertBadge urgencyLevel={event.urgencyLevel} />
        <Badge variant={event.confirmed ? "green" : "orange"}>
          {event.confirmed ? "Confirmada" : "Tentativa"}
        </Badge>
      </div>
    </div>
  );
}

function buildCurrentMonthDays() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const last = new Date(year, month + 1, 0);
  const days = [];

  for (let day = 1; day <= last.getDate(); day += 1) {
    const current = new Date(year, month, day);
    days.push({
      day,
      weekday: new Intl.DateTimeFormat("es-EC", { weekday: "short" }).format(current),
      iso: current.toISOString().slice(0, 10)
    });
  }

  return days;
}

function isWithinNextDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setDate(limit.getDate() + days);
  return date >= today && date <= limit;
}
