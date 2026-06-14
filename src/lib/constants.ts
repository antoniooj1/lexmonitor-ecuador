import type { UrgencyLevel } from "@/types";

export const APP_NAME = "LexMonitor Ecuador";

export const DEMO_USER_ID = "demo-user-ecuador";

export const SATJE_COMPLIANCE_NOTICE =
  "La integración con SATJE debe realizarse únicamente mediante mecanismos autorizados y respetando las condiciones de uso de la Función Judicial.";

export const SATJE_OFFICIAL_SEARCH_URL =
  "https://procesosjudiciales.funcionjudicial.gob.ec/busqueda";

export const LEGAL_DISCLAIMER =
  "LexMonitor Ecuador es una herramienta de apoyo operativo. No reemplaza el criterio jurídico del abogado. Las fechas de vencimiento son tentativas y deben ser verificadas manualmente conforme a la normativa aplicable, días hábiles, feriados, notificación y reglas procesales.";

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  alta: "Urgente",
  media: "Requiere revisión",
  baja: "Informativo"
};

export const MATTERS = ["Civil", "Familia", "Laboral", "Constitucional", "Mercantil"];

export const PROVINCES = ["Loja", "Guayas", "Pichincha", "Azuay", "Manabí", "El Oro"];

export const PROCESS_STATUSES = [
  "En trámite",
  "Audiencia señalada",
  "Citación en curso",
  "Sin movimiento reciente",
  "Archivado",
  "Suspendido"
] as const;
