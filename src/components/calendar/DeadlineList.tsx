import type { CalendarEvent } from "@/types";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

interface DeadlineListProps {
  events: CalendarEvent[];
}

export function DeadlineList({ events }: DeadlineListProps) {
  const upcoming = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-bold text-ink">Próximos vencimientos y audiencias</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length ? (
          upcoming.map((event) => (
            <div key={event.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <AlertBadge urgencyLevel={event.urgencyLevel} />
                <Badge variant={event.confirmed ? "green" : "orange"}>
                  {event.confirmed ? "Fecha confirmada" : "Fecha tentativa"}
                </Badge>
                <Badge variant="slate">{event.type}</Badge>
              </div>
              <p className="mt-2 font-bold text-ink">{event.title}</p>
              <p className="mt-1 text-sm text-muted">{event.processNumber}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{formatDate(event.date)}</p>
            </div>
          ))
        ) : (
          <p className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-muted">
            No hay vencimientos próximos. Mantenga el monitoreo activo y verifique manualmente
            cualquier término que surja de nuevas providencias.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
