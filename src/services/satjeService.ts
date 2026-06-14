import type { JudicialAction, JudicialProcess } from "@/types";
import { matchesSearch, normalizeText } from "@/lib/utils";
import { mockActionsByProcessNumber, mockProcesses } from "@/data/mockSatjeData";
import { mockNewActions } from "@/data/mockActions";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function matchesProcess(process: JudicialProcess, query: string) {
  const normalizedQuery = normalizeText(query);
  const haystack = normalizeText(
    [
      process.processNumber,
      process.court,
      process.province,
      process.canton,
      process.matter,
      process.processType,
      process.actors.join(" "),
      process.defendants.join(" "),
      process.currentStatus,
      process.lastAction
    ].join(" ")
  );

  return matchesSearch(haystack, normalizedQuery);
}

export const satjeService = {
  /**
   * Este servicio usa datos simulados. La integración real con SATJE debe realizarse únicamente
   * mediante mecanismos autorizados y respetando condiciones de uso, restricciones técnicas
   * y normativa aplicable.
   */
  async searchProcesses(query: string): Promise<JudicialProcess[]> {
    await delay(850);

    const trimmed = query.trim();
    if (!trimmed) return mockProcesses;

    if (normalizeText(trimmed).includes("error")) {
      throw new Error("SATJE_MOCK_ERROR");
    }

    return mockProcesses.filter((process) => matchesProcess(process, trimmed));
  },

  async getProcessDetails(processNumber: string): Promise<JudicialProcess> {
    await delay(350);
    const process = mockProcesses.find(
      (item) => item.processNumber === processNumber || item.id === processNumber
    );

    if (!process) {
      throw new Error("Proceso no encontrado en datos simulados.");
    }

    return process;
  },

  async getProcessActions(processNumber: string): Promise<JudicialAction[]> {
    await delay(350);
    return mockActionsByProcessNumber[processNumber] ?? [];
  },

  async checkForUpdates(process: JudicialProcess): Promise<JudicialAction[]> {
    await delay(450);
    return mockNewActions.filter((action) => action.processId === process.id);
  }
};
