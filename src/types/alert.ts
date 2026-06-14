import type { UrgencyLevel } from "./process";

export type AlertStatus = "pendiente" | "revisada";

export interface Alert {
  id: string;
  processId: string;
  actionId: string;
  title: string;
  description: string;
  urgencyLevel: UrgencyLevel;
  suggestedAction: string;
  dueDate: string | null;
  status: AlertStatus;
  reviewedAt: string | null;
  createdAt: string;
  processNumber?: string;
  actionType?: string;
}
