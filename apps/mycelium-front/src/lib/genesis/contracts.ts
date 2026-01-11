export const GENESIS_CONTRACT_VERSION = "1.0" as const;

export type ProductType = "consortium" | "insurance" | "mixed";

export type GenesisIntent = {
  contract_version: typeof GENESIS_CONTRACT_VERSION;
  product_type: ProductType;
  parameters: Record<string, number>;
  user_session_id: string;
};

export type DecisionStep = {
  tool_used: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  reasoning: string;
};

export type GenesisArtifact = {
  contract_version: typeof GENESIS_CONTRACT_VERSION;
  decision_id: string;
  verdict: Record<string, unknown>;
  steps: DecisionStep[];
  integrity_hash: string;
  pdf_ref?: string | null;
};

export function assertGenesisIntent(x: unknown): asserts x is GenesisIntent {
  if (!x || typeof x !== "object") throw new Error("GENESIS_INTENT_INVALID");
  const o = x as Record<string, unknown>;

  if (o.contract_version !== GENESIS_CONTRACT_VERSION) {
    throw new Error("GENESIS_CONTRACT_VERSION_INVALID");
  }
  if (!["consortium", "insurance", "mixed"].includes(String(o.product_type))) {
    throw new Error("GENESIS_PRODUCT_TYPE_INVALID");
  }
  if (!o.user_session_id || typeof o.user_session_id !== "string" || o.user_session_id.length < 6) {
    throw new Error("GENESIS_SESSION_INVALID");
  }

  if (o.parameters == null || typeof o.parameters !== "object") {
    throw new Error("GENESIS_PARAMS_INVALID");
  }
  for (const [key, value] of Object.entries(o.parameters as Record<string, unknown>)) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error(`GENESIS_PARAM_NOT_NUMBER:${key}`);
    }
  }
}
