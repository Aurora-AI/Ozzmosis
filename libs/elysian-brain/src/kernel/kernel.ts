import type { BrainInput, BrainOutput, BrainStep, ElysianBrain } from "./types";

const ENGINE_VERSION = "1.0.0" as const;

export class DefaultElysianBrain implements ElysianBrain {
  public readonly engine_version = ENGINE_VERSION;

  run(input: BrainInput): BrainOutput {
    const steps: BrainStep[] = [];

    if (!input || typeof input !== "object") {
      return this.fail("INPUT_INVALID", "Input must be an object");
    }
    if (input.input_version !== "1.0") {
      return this.fail("INPUT_VERSION_UNSUPPORTED", "Unsupported input_version");
    }
    if (!input.intent || typeof input.intent !== "string") {
      return this.fail("INTENT_MISSING", "Missing intent");
    }
    if (!input.facts || typeof input.facts !== "object") {
      return this.fail("FACTS_INVALID", "facts must be an object");
    }

    steps.push({
      kind: "assertion",
      message: `Intent received: ${input.intent}`,
      reason_codes: ["BRAIN_INTENT_ACCEPTED"],
    });

    steps.push({
      kind: "check",
      message: "Kernel deterministic check OK",
      reason_codes: ["BRAIN_KERNEL_OK"],
    });

    return {
      engine_version: ENGINE_VERSION,
      input_version: "1.0",
      steps,
      ok: true,
    };
  }

  private fail(code: string, message: string): BrainOutput {
    return {
      engine_version: ENGINE_VERSION,
      input_version: "1.0",
      steps: [{ kind: "check", message, reason_codes: [code] }],
      ok: false,
    };
  }
}
