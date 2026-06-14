import type { Alert, JudicialAction, JudicialProcess } from "@/types";
import { mockNewActions } from "@/data/mockActions";
import { analyzeJudicialAction } from "@/services/aiAnalysisService";

export interface MonitoringResult {
  checkedAt: string;
  checkedProcesses: number;
  newActions: JudicialAction[];
  generatedAlerts: Alert[];
  updatedProcesses: JudicialProcess[];
}

function generateUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-000000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ ((Math.random() * 16) >> (Number(char) / 4))).toString(16)
  );
}

export function compareLastAction(oldAction: JudicialAction | null, newAction: JudicialAction) {
  if (!oldAction) return true;
  return oldAction.rawText !== newAction.rawText || oldAction.actionDate !== newAction.actionDate;
}

export function generateAlertsFromNewActions(actions: JudicialAction[], processes: JudicialProcess[]) {
  return actions.map<Alert>((action) => {
    const process = processes.find((item) => item.id === action.processId);
    const analysis = analyzeJudicialAction(action.rawText);

    return {
      id: generateUuid(),
      processId: action.processId,
      actionId: action.id,
      title: analysis.generatedAlertTitle,
      description: analysis.generatedAlertDescription,
      urgencyLevel: analysis.urgencyLevel,
      suggestedAction: analysis.suggestedAction,
      dueDate: analysis.tentativeDueDate,
      status: "pendiente",
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      processNumber: process?.processNumber,
      actionType: analysis.actionType
    };
  });
}

export function updateProcessStatus(
  process: JudicialProcess,
  action: JudicialAction | undefined
): JudicialProcess {
  if (!action) {
    return {
      ...process,
      lastCheckedAt: new Date().toISOString()
    };
  }

  const analysis = analyzeJudicialAction(action.rawText);

  return {
    ...process,
    currentStatus: analysis.actionType === "Audiencia" ? "Audiencia señalada" : process.currentStatus,
    lastAction: action.rawText,
    lastActionDate: action.actionDate,
    lastCheckedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    urgencyLevel: analysis.urgencyLevel,
    nextPendingAction: analysis.suggestedAction,
    activeAlertsCount: process.activeAlertsCount + 1
  };
}

export async function runDailyMonitoring(processes: JudicialProcess[] = []): Promise<MonitoringResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const monitoredProcesses = processes.filter((process) => process.monitoringEnabled);
  const newActions = mockNewActions
    .filter((action) => monitoredProcesses.some((process) => process.id === action.processId))
    .map((action) => {
      const analysis = analyzeJudicialAction(action.rawText);
      return {
        ...action,
        id: generateUuid(),
        aiSummary: analysis.summary,
        suggestedAction: analysis.suggestedAction,
        urgencyLevel: analysis.urgencyLevel,
        actionType: analysis.actionType,
        hasDeadline: analysis.hasDeadline,
        detectedDeadlineText: analysis.detectedDeadlineText,
        tentativeDueDate: analysis.tentativeDueDate,
        createdAt: new Date().toISOString(),
        generatedAlert: true
      };
    });

  const generatedAlerts = generateAlertsFromNewActions(newActions, monitoredProcesses);
  const updatedProcesses = processes.map((process) =>
    updateProcessStatus(
      process,
      newActions.find((action) => action.processId === process.id)
    )
  );

  return {
    checkedAt: new Date().toISOString(),
    checkedProcesses: monitoredProcesses.length,
    newActions,
    generatedAlerts,
    updatedProcesses
  };
}
