import type { BrainPort, ConductorEvent } from "../index.js";

export class BrainStub implements BrainPort {
  async enrich(event: ConductorEvent): Promise<ConductorEvent> {
    return event;
  }
}
