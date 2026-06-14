import type { AIAnalysisResult, UrgencyLevel } from "@/types";
import { addBusinessDays, normalizeText, toISODate } from "@/lib/utils";

function detectDeadlineText(text: string) {
  if (text.includes("cinco dias") || text.includes("5 dias")) return "cinco días";
  if (text.includes("termino")) return "término judicial";
  if (text.includes("plazo")) return "plazo judicial";
  return null;
}

function buildDueDate(deadlineText: string | null) {
  if (!deadlineText) return null;
  const businessDays = deadlineText.includes("cinco") || deadlineText.includes("5") ? 5 : 3;
  return toISODate(addBusinessDays(new Date(), businessDays));
}

function result(params: {
  summary: string;
  suggestedAction: string;
  urgencyLevel: UrgencyLevel;
  actionType: string;
  hasDeadline?: boolean;
  detectedDeadlineText?: string | null;
  generatedAlertTitle: string;
  generatedAlertDescription: string;
}): AIAnalysisResult {
  const detectedDeadlineText = params.detectedDeadlineText ?? null;

  return {
    summary: params.summary,
    suggestedAction: params.suggestedAction,
    urgencyLevel: params.urgencyLevel,
    actionType: params.actionType,
    hasDeadline: params.hasDeadline ?? Boolean(detectedDeadlineText),
    detectedDeadlineText,
    tentativeDueDate: buildDueDate(detectedDeadlineText),
    generatedAlertTitle: params.generatedAlertTitle,
    generatedAlertDescription: params.generatedAlertDescription
  };
}

export function analyzeJudicialAction(rawText: string): AIAnalysisResult {
  const text = normalizeText(rawText);
  const detectedDeadlineText = detectDeadlineText(text);
  const hasDeadline = Boolean(detectedDeadlineText);

  // En producción, esta función puede conectarse a un modelo de IA para analizar textos judiciales
  // y devolver JSON estructurado con resumen, acción sugerida, urgencia, plazo y tipo de actuación.
  if (
    text.includes("complete la demanda") ||
    text.includes("completar la demanda") ||
    text.includes("subsanar") ||
    text.includes("subsane") ||
    text.includes("previo a calificar")
  ) {
    return result({
      summary:
        "El juez dispuso que la parte actora complete o subsane la demanda dentro del término concedido.",
      suggestedAction:
        "Revisar la providencia, completar los requisitos solicitados y presentar el escrito dentro del término legal.",
      urgencyLevel: "alta",
      actionType: "Mandato de completar demanda",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Completar demanda",
      generatedAlertDescription:
        "Existe una orden judicial que requiere completar la demanda dentro del término concedido."
    });
  }

  if (text.includes("audiencia")) {
    return result({
      summary: "Se detectó una actuación relacionada con una audiencia judicial.",
      suggestedAction:
        "Confirmar fecha, hora, modalidad, comparecientes y preparar la estrategia de audiencia.",
      urgencyLevel: "alta",
      actionType: "Audiencia",
      hasDeadline: true,
      detectedDeadlineText: detectedDeadlineText ?? "audiencia señalada",
      generatedAlertTitle: "Audiencia judicial",
      generatedAlertDescription:
        "Existe una audiencia registrada que requiere preparación y verificación manual."
    });
  }

  if (text.includes("citacion") || text.includes("cite") || text.includes("citese")) {
    return result({
      summary: "Se detectó una actuación relacionada con citación procesal.",
      suggestedAction:
        "Verificar la razón de citación, sus efectos procesales y cualquier término que pudiera activarse.",
      urgencyLevel: "alta",
      actionType: "Citación",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Revisar citación",
      generatedAlertDescription:
        "La actuación involucra citación y puede activar consecuencias procesales relevantes."
    });
  }

  if (text.includes("medida cautelar")) {
    return result({
      summary: "Se detectó una actuación vinculada con medida cautelar.",
      suggestedAction:
        "Revisar alcance de la medida, cumplimiento inmediato y vías de oposición o ejecución.",
      urgencyLevel: "alta",
      actionType: "Medida cautelar",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Medida cautelar",
      generatedAlertDescription:
        "La actuación puede requerir respuesta inmediata por su naturaleza cautelar."
    });
  }

  if (text.includes("sentencia")) {
    const highRisk = text.includes("improcedente") || text.includes("rechaza") || text.includes("niega");
    return result({
      summary: "Se detectó una sentencia o resolución de fondo en el proceso.",
      suggestedAction:
        "Revisar contenido íntegro, fecha de notificación y posibles recursos dentro del término aplicable.",
      urgencyLevel: highRisk ? "alta" : "media",
      actionType: "Sentencia",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Sentencia detectada",
      generatedAlertDescription:
        "La sentencia debe revisarse para evaluar recursos, ejecución o cumplimiento."
    });
  }

  if (text.includes("archivo") || text.includes("abandono")) {
    return result({
      summary: "Se detectó una actuación sobre archivo o abandono del proceso.",
      suggestedAction:
        "Revisar de inmediato la providencia y evaluar impugnación, revocatoria o impulso procesal.",
      urgencyLevel: "alta",
      actionType: "Archivo o abandono",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Riesgo de archivo o abandono",
      generatedAlertDescription:
        "La actuación puede afectar la continuidad del proceso y requiere revisión prioritaria."
    });
  }

  if (text.includes("providencia")) {
    return result({
      summary: "Se detectó una providencia que debe ser revisada por el equipo jurídico.",
      suggestedAction: "Leer la providencia completa y determinar si exige respuesta o seguimiento.",
      urgencyLevel: "media",
      actionType: "Providencia",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Providencia para revisión",
      generatedAlertDescription: "La providencia puede requerir seguimiento operativo."
    });
  }

  if (hasDeadline) {
    return result({
      summary: "Se detectó una referencia a plazo o término judicial.",
      suggestedAction:
        "Validar manualmente el cómputo del término y registrar la fecha confirmada.",
      urgencyLevel: "media",
      actionType: "Plazo judicial",
      hasDeadline,
      detectedDeadlineText,
      generatedAlertTitle: "Plazo detectado",
      generatedAlertDescription:
        "La actuación contiene una referencia a plazo que debe verificarse manualmente."
    });
  }

  return result({
    summary: "No se detectaron riesgos procesales críticos en esta actuación.",
    suggestedAction: "Mantener monitoreo y revisar en el siguiente control diario.",
    urgencyLevel: "baja",
    actionType: "Actuación informativa",
    generatedAlertTitle: "Actuación informativa",
    generatedAlertDescription: "La actuación fue clasificada como informativa."
  });
}
