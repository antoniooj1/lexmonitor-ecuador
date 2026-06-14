export type {
  AIAnalysisResult,
  JudicialAction,
  JudicialProcess,
  ProcessStatus,
  UrgencyLevel,
  User,
  UserRole
} from "./process";
export type { Alert, AlertStatus } from "./alert";
export type { CalendarEvent, Deadline, DeadlineStatus } from "./deadline";

export interface Note {
  id: string;
  processId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  processId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  urgentAlertsEnabled: boolean;
  dailySummaryEnabled: boolean;
  preferredHour: string;
  alertTypes: string[];
  createdAt: string;
  updatedAt: string;
}
