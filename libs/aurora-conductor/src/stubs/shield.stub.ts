import type { ConductorEvent, PolicyVerdict, ShieldPort } from "../index.js";

export class ShieldStub implements ShieldPort {
  async validate(_: ConductorEvent): Promise<PolicyVerdict> {
    return { allowed: true, reason_code: "OK" };
  }
}
