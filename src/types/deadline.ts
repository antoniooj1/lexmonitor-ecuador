export type DeadlineStatus = "pendiente" | "confirmado" | "vencido" | "cumplido";

export interface Deadline {
  id: string;
  processId: string;
  actionId: string;
  deadlineType: string;
  detectedText: string;
  tentativeDueDate: string | null;
  confirmedDueDate: string | null;
  manuallyAdjusted: boolean;
  status: DeadlineStatus;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  processId: string;
  processNumber: string;
  title: string;
  type: "plazo" | "audiencia" | "accion" | "recordatorio";
  date: string;
  confirmed: boolean;
  urgencyLevel: "alta" | "media" | "baja";
}
