import type { Deadline, Document, JudicialAction, JudicialProcess, Note } from "@/types";
import { DEMO_USER_ID } from "@/lib/constants";

export const mockProcesses: JudicialProcess[] = [
  {
    id: "11333000-2026-4000-8000-000000000452",
    userId: DEMO_USER_ID,
    processNumber: "11333-2026-00452",
    court: "Unidad Judicial Civil de Loja",
    province: "Loja",
    canton: "Loja",
    matter: "Civil",
    processType: "Ejecutivo",
    actors: ["María Pérez"],
    defendants: ["Juan Rodríguez"],
    currentStatus: "En trámite",
    lastAction:
      "Previo a calificar la demanda, complete la parte actora en el término de cinco días.",
    lastActionDate: "2026-06-10",
    satjeSourceUrl: "https://satje.funcionjudicial.gob.ec/mock/11333-2026-00452",
    monitoringEnabled: true,
    lastCheckedAt: "2026-06-13T08:30:00.000Z",
    createdAt: "2026-06-10T14:00:00.000Z",
    updatedAt: "2026-06-13T08:30:00.000Z",
    urgencyLevel: "alta",
    nextPendingAction: "Completar demanda y presentar escrito dentro del término concedido.",
    activeAlertsCount: 2
  },
  {
    id: "09332000-2025-4000-8000-000000001891",
    userId: DEMO_USER_ID,
    processNumber: "09332-2025-01891",
    court: "Unidad Judicial Civil de Guayaquil",
    province: "Guayas",
    canton: "Guayaquil",
    matter: "Civil",
    processType: "Ordinario",
    actors: ["Compañía Alfa S.A."],
    defendants: ["Carlos Zambrano"],
    currentStatus: "Audiencia señalada",
    lastAction: "Se señala audiencia única para el día 20 de junio de 2026 a las 09h00.",
    lastActionDate: "2026-06-08",
    satjeSourceUrl: "https://satje.funcionjudicial.gob.ec/mock/09332-2025-01891",
    monitoringEnabled: true,
    lastCheckedAt: "2026-06-13T08:31:00.000Z",
    createdAt: "2026-06-08T11:30:00.000Z",
    updatedAt: "2026-06-13T08:31:00.000Z",
    urgencyLevel: "alta",
    nextPendingAction: "Preparar intervención, revisar prueba y confirmar logística de audiencia.",
    activeAlertsCount: 1
  },
  {
    id: "17230000-2024-4000-8000-000000001234",
    userId: DEMO_USER_ID,
    processNumber: "17230-2024-01234",
    court: "Unidad Judicial de Familia de Quito",
    province: "Pichincha",
    canton: "Quito",
    matter: "Familia",
    processType: "Alimentos",
    actors: ["Ana Torres"],
    defendants: ["Pedro Molina"],
    currentStatus: "Citación en curso",
    lastAction: "Agréguese la razón de citación sentada por el actuario.",
    lastActionDate: "2026-06-04",
    satjeSourceUrl: "https://satje.funcionjudicial.gob.ec/mock/17230-2024-01234",
    monitoringEnabled: true,
    lastCheckedAt: "2026-06-13T08:32:00.000Z",
    createdAt: "2026-06-04T16:15:00.000Z",
    updatedAt: "2026-06-13T08:32:00.000Z",
    urgencyLevel: "media",
    nextPendingAction: "Verificar validez de la citación y preparar siguiente impulso procesal.",
    activeAlertsCount: 1
  },
  {
    id: "11203000-2023-4000-8000-000000000987",
    userId: DEMO_USER_ID,
    processNumber: "11203-2023-00987",
    court: "Unidad Judicial Civil de Cuenca",
    province: "Azuay",
    canton: "Cuenca",
    matter: "Civil",
    processType: "Monitorio",
    actors: ["Banco Andino"],
    defendants: ["Luis Cárdenas"],
    currentStatus: "Sin movimiento reciente",
    lastAction: "No registra actuaciones recientes.",
    lastActionDate: "2026-05-02",
    satjeSourceUrl: "https://satje.funcionjudicial.gob.ec/mock/11203-2023-00987",
    monitoringEnabled: false,
    lastCheckedAt: "2026-06-12T09:15:00.000Z",
    createdAt: "2026-05-02T09:20:00.000Z",
    updatedAt: "2026-06-12T09:15:00.000Z",
    urgencyLevel: "baja",
    nextPendingAction: "Evaluar impulso procesal si se mantiene sin movimiento.",
    activeAlertsCount: 0
  },
  {
    id: "13337000-2026-4000-8000-000000002110",
    userId: DEMO_USER_ID,
    processNumber: "13337-2026-02110",
    court: "Unidad Judicial de Trabajo de Manta",
    province: "Manabí",
    canton: "Manta",
    matter: "Laboral",
    processType: "Procedimiento sumario",
    actors: ["Roberto Véliz"],
    defendants: ["Exportadora Pacífico Cía. Ltda."],
    currentStatus: "En trámite",
    lastAction: "Providencia: agréguese escrito presentado y póngase en conocimiento de las partes.",
    lastActionDate: "2026-06-01",
    satjeSourceUrl: "https://satje.funcionjudicial.gob.ec/mock/13337-2026-02110",
    monitoringEnabled: true,
    lastCheckedAt: "2026-06-13T09:00:00.000Z",
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-06-13T09:00:00.000Z",
    urgencyLevel: "media",
    nextPendingAction: "Revisar providencia y definir si corresponde contestación.",
    activeAlertsCount: 1
  }
];

export const mockActionsByProcessNumber: Record<string, JudicialAction[]> = {
  "11333-2026-00452": [
    {
      id: "11333000-2026-4001-8000-000000000001",
      processId: "11333000-2026-4000-8000-000000000452",
      actionDate: "2026-06-10",
      actionType: "Mandato de completar demanda",
      rawText:
        "Previo a calificar la demanda, complete la parte actora en el término de cinco días.",
      aiSummary:
        "El juez dispuso que la parte actora complete la demanda dentro del término concedido.",
      suggestedAction:
        "Revisar la providencia, completar los requisitos solicitados y presentar el escrito dentro del término legal.",
      urgencyLevel: "alta",
      hasDeadline: true,
      detectedDeadlineText: "cinco días",
      tentativeDueDate: "2026-06-17",
      confirmedDueDate: null,
      reviewed: false,
      createdAt: "2026-06-10T14:04:00.000Z",
      generatedAlert: true
    },
    {
      id: "11333000-2026-4001-8000-000000000000",
      processId: "11333000-2026-4000-8000-000000000452",
      actionDate: "2026-06-06",
      actionType: "Ingreso de demanda",
      rawText: "Avóquese conocimiento de la demanda presentada por María Pérez.",
      aiSummary: "La judicatura recibió la demanda y avocó conocimiento.",
      suggestedAction: "Esperar calificación y monitorear nuevas providencias.",
      urgencyLevel: "baja",
      hasDeadline: false,
      detectedDeadlineText: null,
      tentativeDueDate: null,
      confirmedDueDate: null,
      reviewed: true,
      createdAt: "2026-06-06T12:10:00.000Z",
      generatedAlert: false
    }
  ],
  "09332-2025-01891": [
    {
      id: "09332000-2025-4001-8000-000000000001",
      processId: "09332000-2025-4000-8000-000000001891",
      actionDate: "2026-06-08",
      actionType: "Audiencia",
      rawText: "Se señala audiencia única para el día 20 de junio de 2026 a las 09h00.",
      aiSummary: "Existe audiencia única fijada para el 20 de junio de 2026 a las 09h00.",
      suggestedAction:
        "Confirmar asistencia, revisar expediente, preparar teoría del caso y evidencias.",
      urgencyLevel: "alta",
      hasDeadline: true,
      detectedDeadlineText: "audiencia 20 de junio de 2026 09h00",
      tentativeDueDate: "2026-06-20",
      confirmedDueDate: "2026-06-20",
      reviewed: false,
      createdAt: "2026-06-08T11:40:00.000Z",
      generatedAlert: true
    }
  ],
  "17230-2024-01234": [
    {
      id: "17230000-2024-4001-8000-000000000001",
      processId: "17230000-2024-4000-8000-000000001234",
      actionDate: "2026-06-04",
      actionType: "Citación",
      rawText: "Agréguese la razón de citación sentada por el actuario.",
      aiSummary: "Se incorporó al expediente una razón relacionada con la citación.",
      suggestedAction: "Verificar si la citación es válida y si abre término para contestación.",
      urgencyLevel: "media",
      hasDeadline: false,
      detectedDeadlineText: null,
      tentativeDueDate: null,
      confirmedDueDate: null,
      reviewed: false,
      createdAt: "2026-06-04T16:18:00.000Z",
      generatedAlert: true
    }
  ],
  "11203-2023-00987": [
    {
      id: "11203000-2023-4001-8000-000000000001",
      processId: "11203000-2023-4000-8000-000000000987",
      actionDate: "2026-05-02",
      actionType: "Sin movimiento",
      rawText: "No registra actuaciones recientes.",
      aiSummary: "El proceso no registra movimientos recientes en el periodo consultado.",
      suggestedAction: "Revisar necesidad de impulso procesal.",
      urgencyLevel: "baja",
      hasDeadline: false,
      detectedDeadlineText: null,
      tentativeDueDate: null,
      confirmedDueDate: null,
      reviewed: true,
      createdAt: "2026-05-02T09:25:00.000Z",
      generatedAlert: false
    }
  ],
  "13337-2026-02110": [
    {
      id: "13337000-2026-4001-8000-000000000001",
      processId: "13337000-2026-4000-8000-000000002110",
      actionDate: "2026-06-01",
      actionType: "Providencia",
      rawText:
        "Providencia: agréguese escrito presentado y póngase en conocimiento de las partes.",
      aiSummary: "La judicatura agregó un escrito y lo puso en conocimiento de las partes.",
      suggestedAction: "Revisar el escrito incorporado y definir si corresponde pronunciamiento.",
      urgencyLevel: "media",
      hasDeadline: false,
      detectedDeadlineText: null,
      tentativeDueDate: null,
      confirmedDueDate: null,
      reviewed: false,
      createdAt: "2026-06-01T10:05:00.000Z",
      generatedAlert: true
    }
  ]
};

export const mockDeadlines: Deadline[] = [
  {
    id: "11333000-2026-4003-8000-000000000001",
    processId: "11333000-2026-4000-8000-000000000452",
    actionId: "11333000-2026-4001-8000-000000000001",
    deadlineType: "Término para completar demanda",
    detectedText: "cinco días",
    tentativeDueDate: "2026-06-17",
    confirmedDueDate: null,
    manuallyAdjusted: false,
    status: "pendiente",
    createdAt: "2026-06-10T14:04:00.000Z"
  },
  {
    id: "09332000-2025-4003-8000-000000000001",
    processId: "09332000-2025-4000-8000-000000001891",
    actionId: "09332000-2025-4001-8000-000000000001",
    deadlineType: "Audiencia única",
    detectedText: "20 de junio de 2026 a las 09h00",
    tentativeDueDate: "2026-06-20",
    confirmedDueDate: "2026-06-20",
    manuallyAdjusted: true,
    status: "confirmado",
    createdAt: "2026-06-08T11:40:00.000Z"
  }
];

export const mockNotes: Note[] = [
  {
    id: "11333000-2026-4004-8000-000000000001",
    processId: "11333000-2026-4000-8000-000000000452",
    userId: DEMO_USER_ID,
    content: "Verificar requisitos observados antes de presentar escrito de complemento.",
    createdAt: "2026-06-11T09:00:00.000Z",
    updatedAt: "2026-06-11T09:00:00.000Z"
  }
];

export const mockDocuments: Document[] = [
  {
    id: "11333000-2026-4005-8000-000000000001",
    processId: "11333000-2026-4000-8000-000000000452",
    userId: DEMO_USER_ID,
    fileName: "demanda-ejecutiva.pdf",
    fileUrl: "#",
    fileType: "PDF",
    uploadedAt: "2026-06-10T13:50:00.000Z"
  },
  {
    id: "09332000-2025-4005-8000-000000000001",
    processId: "09332000-2025-4000-8000-000000001891",
    userId: DEMO_USER_ID,
    fileName: "matriz-prueba-audiencia.xlsx",
    fileUrl: "#",
    fileType: "XLSX",
    uploadedAt: "2026-06-09T10:20:00.000Z"
  }
];
