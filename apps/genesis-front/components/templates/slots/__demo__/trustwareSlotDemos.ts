import type { SuitabilityAlphaSlotModel } from "../SuitabilityAlphaSlot";
import type { TCOMirrorSlotModel } from "../TCOMirrorSlot";

export const suitabilityDemos: Record<
  "pass" | "warn" | "blocked" | "insufficient_data",
  SuitabilityAlphaSlotModel
> = {
  pass: {
    slot_type: "SuitabilityAlphaSlot",
    version: "1.0",
    state: "pass",
    headline: "Integridade atendida para este cenário (exposição sem inferência).",
    summary: "Resultado ilustrativo. Nenhum cálculo foi executado.",
    reasons: [{ code: "EVIDENCE_OK", message: "Fatos mínimos declarados e consistentes.", evidence: "demo payload" }],
    missing_fields: []
  },
  warn: {
    slot_type: "SuitabilityAlphaSlot",
    version: "1.0",
    state: "warn",
    headline: "Atenção: há risco de inadequação dependendo de liquidez e horizonte.",
    summary: "Resultado ilustrativo. Nenhum cálculo foi executado.",
    reasons: [{ code: "LIQUIDITY_WARN", message: "Condição exige atenção.", evidence: "demo payload" }],
    missing_fields: []
  },
  blocked: {
    slot_type: "SuitabilityAlphaSlot",
    version: "1.0",
    state: "blocked",
    headline: "Bloqueado: este cenário exige revisão antes de qualquer decisão.",
    summary: "Resultado ilustrativo. Nenhum cálculo foi executado.",
    reasons: [{ code: "INTEGRITY_BLOCK", message: "Condição de integridade não atendida.", evidence: "demo payload" }],
    missing_fields: []
  },
  insufficient_data: {
    slot_type: "SuitabilityAlphaSlot",
    version: "1.0",
    state: "insufficient_data",
    headline: "Dados insuficientes — não inferimos sem fatos mínimos.",
    summary: "Este estado é ético e não é erro.",
    reasons: [],
    missing_fields: ["liquidity", "horizon_months", "income_commitment"]
  }
};

export const tcoDemo: TCOMirrorSlotModel = {
  slot_type: "TCOMirrorSlot",
  version: "1.0",
  disclaimer: "valores estimados — cálculo não conectado",
  headline: "Custo total de vida (TCO) — exposição (demo)",
  lines: [
    { key: "parcel", label: "Parcela", amount: null, note: "pendente de cálculo" },
    { key: "admin_fee", label: "Taxa administrativa", amount: null, note: "pendente de cálculo" },
    { key: "itbi", label: "ITBI", amount: null, note: "pendente de cálculo" },
    { key: "deed", label: "Escritura", amount: null, note: "pendente de cálculo" },
    { key: "registry", label: "Registro", amount: null, note: "pendente de cálculo" },
    { key: "insurance", label: "Seguro", amount: null, note: "pendente de cálculo" },
    { key: "post_contemplation_cost", label: "Custo pós-contemplação", amount: null, note: "pendente de cálculo" }
  ],
  bank_alternative: {
    headline: "Alternativa bancária (placeholder)",
    monthly_cost: null,
    total_cost: null,
    note: "comparação ilustrativa — sem simulação"
  }
};
