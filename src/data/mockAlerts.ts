import type { Alert } from "@/types";

export const mockAlerts: Alert[] = [
  {
    id: "11333000-2026-4002-8000-000000000001",
    processId: "11333000-2026-4000-8000-000000000452",
    actionId: "11333000-2026-4001-8000-000000000001",
    title: "Completar demanda",
    description:
      "Existe una orden judicial que requiere completar la demanda dentro del término concedido.",
    urgencyLevel: "alta",
    suggestedAction:
      "Completar requisitos observados y presentar el escrito antes del vencimiento tentativo.",
    dueDate: "2026-06-17",
    status: "pendiente",
    reviewedAt: null,
    createdAt: "2026-06-10T14:05:00.000Z",
    processNumber: "11333-2026-00452",
    actionType: "Mandato de completar demanda"
  },
  {
    id: "09332000-2025-4002-8000-000000000001",
    processId: "09332000-2025-4000-8000-000000001891",
    actionId: "09332000-2025-4001-8000-000000000001",
    title: "Audiencia única señalada",
    description: "Se detectó audiencia para el 20 de junio de 2026 a las 09h00.",
    urgencyLevel: "alta",
    suggestedAction: "Preparar comparecencia, prueba y agenda del equipo jurídico.",
    dueDate: "2026-06-20",
    status: "pendiente",
    reviewedAt: null,
    createdAt: "2026-06-08T11:42:00.000Z",
    processNumber: "09332-2025-01891",
    actionType: "Audiencia"
  },
  {
    id: "17230000-2024-4002-8000-000000000001",
    processId: "17230000-2024-4000-8000-000000001234",
    actionId: "17230000-2024-4001-8000-000000000001",
    title: "Citación agregada",
    description:
      "Se incorporó razón de citación. Conviene revisar si activa términos procesales.",
    urgencyLevel: "media",
    suggestedAction: "Validar razón de citación y preparar impulso o contestación si corresponde.",
    dueDate: null,
    status: "pendiente",
    reviewedAt: null,
    createdAt: "2026-06-04T16:20:00.000Z",
    processNumber: "17230-2024-01234",
    actionType: "Citación"
  },
  {
    id: "13337000-2026-4002-8000-000000000001",
    processId: "13337000-2026-4000-8000-000000002110",
    actionId: "13337000-2026-4001-8000-000000000001",
    title: "Providencia para revisión",
    description: "La providencia incorpora un escrito y lo pone en conocimiento de las partes.",
    urgencyLevel: "media",
    suggestedAction: "Revisar contenido del escrito agregado y decidir respuesta.",
    dueDate: null,
    status: "revisada",
    reviewedAt: "2026-06-05T15:00:00.000Z",
    createdAt: "2026-06-01T10:06:00.000Z",
    processNumber: "13337-2026-02110",
    actionType: "Providencia"
  }
];
