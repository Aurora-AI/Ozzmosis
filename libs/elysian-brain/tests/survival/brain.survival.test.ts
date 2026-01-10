import { describe, expect, it } from "vitest";
import { DefaultElysianBrain } from "../../src";

describe("elysian-brain survival", () => {
  it("initializes and runs deterministically with valid input", () => {
    const brain = new DefaultElysianBrain();

    const out = brain.run({
      input_version: "1.0",
      intent: "validate-decision",
      facts: { x: 1 },
    });

    expect(out.ok).toBe(true);
    expect(out.engine_version).toBe("1.0.0");
    expect(out.steps.length).toBeGreaterThan(0);
  });

  it("fails deterministically on invalid input", () => {
    const brain = new DefaultElysianBrain();
    // @ts-expect-error intentional invalid
    const out = brain.run(null);

    expect(out.ok).toBe(false);
    expect(out.steps[0].reason_codes.length).toBeGreaterThan(0);
  });
});
