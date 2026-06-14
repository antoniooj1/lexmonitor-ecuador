import type { JudicialAction } from "@/types";

export const mockNewActions: JudicialAction[] = [
  {
    id: "11333000-2026-4001-8000-000000000099",
    processId: "11333000-2026-4000-8000-000000000452",
    actionDate: "2026-06-13",
    actionType: "Providencia",
    rawText:
      "Previo a calificar la demanda, subsane la omisión advertida en el término de cinco días.",
    aiSummary: "",
    suggestedAction: "",
    urgencyLevel: "alta",
    hasDeadline: true,
    detectedDeadlineText: "cinco días",
    tentativeDueDate: null,
    confirmedDueDate: null,
    reviewed: false,
    createdAt: "2026-06-13T13:00:00.000Z",
    generatedAlert: true
  },
  {
    id: "17230000-2024-4001-8000-000000000099",
    processId: "17230000-2024-4000-8000-000000001234",
    actionDate: "2026-06-13",
    actionType: "Citación",
    rawText:
      "Cítese a la parte demandada mediante comisión, dejando constancia de la diligencia en autos.",
    aiSummary: "",
    suggestedAction: "",
    urgencyLevel: "alta",
    hasDeadline: false,
    detectedDeadlineText: null,
    tentativeDueDate: null,
    confirmedDueDate: null,
    reviewed: false,
    createdAt: "2026-06-13T13:10:00.000Z",
    generatedAlert: true
  },
  {
    id: "13337000-2026-4001-8000-000000000099",
    processId: "13337000-2026-4000-8000-000000002110",
    actionDate: "2026-06-13",
    actionType: "Sentencia",
    rawText:
      "Sentencia: se acepta parcialmente la demanda. Notifíquese a las partes conforme derecho.",
    aiSummary: "",
    suggestedAction: "",
    urgencyLevel: "media",
    hasDeadline: false,
    detectedDeadlineText: null,
    tentativeDueDate: null,
    confirmedDueDate: null,
    reviewed: false,
    createdAt: "2026-06-13T13:20:00.000Z",
    generatedAlert: true
  }
];
