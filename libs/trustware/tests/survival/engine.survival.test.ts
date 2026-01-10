// libs/trustware/tests/survival/engine.survival.test.ts

import { describe, expect, it } from "vitest";
import { DefaultTrustwareEngine, TrustwareRequest } from "../../src";

describe("trustware-engine survival", () => {
  it("denies structurally invalid request deterministically", () => {
    const engine = new DefaultTrustwareEngine();
    // @ts-expect-error intentional invalid
    const verdict = engine.evaluate(null);

    expect(verdict.decision).toBe("deny");
    expect(verdict.reason_codes.length).toBeGreaterThan(0);
  });

  it("allows valid request in warn mode even with missing optional required_fields (warn)", () => {
    const engine = new DefaultTrustwareEngine();

    const req: TrustwareRequest = {
      request_version: "1.0",
      subject: { kind: "proposal", id: "p1" },
      context: { source: "chronos-backoffice", request_id: "r1" },
      facts: { amount: 123 },
      policies: {
        policy_version: "1.0",
        mode: "warn",
        required_fields: ["facts.cnpj"], // missing -> warn
      },
    };

    const verdict = engine.evaluate(req);
    expect(verdict.decision).toBe("allow");
    expect(verdict.issues.length).toBeGreaterThan(0);
  });

  it("denies blocked subject kind in error mode", () => {
    const engine = new DefaultTrustwareEngine();

    const req: TrustwareRequest = {
      request_version: "1.0",
      subject: { kind: "blocked_kind" },
      context: { source: "alvaro-core" },
      facts: {},
      policies: {
        policy_version: "1.0",
        mode: "error",
        blocked_subject_kinds: ["blocked_kind"],
      },
    };

    const verdict = engine.evaluate(req);
    expect(verdict.decision).toBe("deny");
    expect(verdict.reason_codes).toContain("POLICY_MODE_ERROR_BLOCK");
    expect(verdict.issues.some((i) => i.code === "POLICY_BLOCKED")).toBe(true);
  });
});
