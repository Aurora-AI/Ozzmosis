import type { ChronosPort, ConductorEvent, OrchestrationResult } from "../index.js";

export type ChronosRecord = {
  event: ConductorEvent;
  result: OrchestrationResult;
};

export class ChronosStub implements ChronosPort {
  readonly records: ChronosRecord[] = [];

  async record(event: ConductorEvent, result: OrchestrationResult): Promise<void> {
    this.records.push({ event, result });
  }
}
