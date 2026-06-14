export type UserRole = "admin" | "lawyer" | "client";

export type UrgencyLevel = "alta" | "media" | "baja";

export type ProcessStatus =
  | "En trámite"
  | "Audiencia señalada"
  | "Citación en curso"
  | "Sin movimiento reciente"
  | "Archivado"
  | "Suspendido";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface JudicialProcess {
  id: string;
  userId: string;
  processNumber: string;
  court: string;
  province: string;
  canton: string;
  matter: string;
  processType: string;
  actors: string[];
  defendants: string[];
  currentStatus: ProcessStatus;
  lastAction: string;
  lastActionDate: string;
  satjeSourceUrl: string;
  monitoringEnabled: boolean;
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
  urgencyLevel: UrgencyLevel;
  nextPendingAction: string;
  activeAlertsCount: number;
}

export interface JudicialAction {
  id: string;
  processId: string;
  actionDate: string;
  actionType: string;
  rawText: string;
  aiSummary: string;
  suggestedAction: string;
  urgencyLevel: UrgencyLevel;
  hasDeadline: boolean;
  detectedDeadlineText: string | null;
  tentativeDueDate: string | null;
  confirmedDueDate: string | null;
  reviewed: boolean;
  createdAt: string;
  generatedAlert?: boolean;
}

export interface AIAnalysisResult {
  summary: string;
  suggestedAction: string;
  urgencyLevel: UrgencyLevel;
  actionType: string;
  hasDeadline: boolean;
  detectedDeadlineText: string | null;
  tentativeDueDate: string | null;
  generatedAlertTitle: string;
  generatedAlertDescription: string;
}
