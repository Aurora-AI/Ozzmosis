export type BrainInput = {
  input_version: "1.0";
  intent: string;
  facts: Record<string, unknown>;
};

export type BrainStep = {
  kind: "assertion" | "check" | "recommendation";
  message: string;
  reason_codes: string[];
};

export type BrainOutput = {
  engine_version: "1.0.0";
  input_version: "1.0";
  steps: BrainStep[];
  ok: boolean;
};

export type ElysianBrain = {
  readonly engine_version: "1.0.0";
  run(input: BrainInput): BrainOutput;
};
