import type { Alert, NotificationSettings } from "@/types";

export function shouldNotify(alert: Alert, settings: NotificationSettings) {
  if (!settings.urgentAlertsEnabled && alert.urgencyLevel === "alta") return false;
  if (!settings.emailEnabled && !settings.dailySummaryEnabled) return false;
  return settings.alertTypes.includes(alert.actionType ?? "General") || settings.alertTypes.includes("Todas");
}

export function simulateNotificationDispatch(alerts: Alert[], settings: NotificationSettings) {
  return alerts
    .filter((alert) => shouldNotify(alert, settings))
    .map((alert) => ({
      alertId: alert.id,
      channel: settings.emailEnabled ? "email" : "interno",
      status: "simulado",
      message: `Notificación simulada: ${alert.title}`
    }));
}
