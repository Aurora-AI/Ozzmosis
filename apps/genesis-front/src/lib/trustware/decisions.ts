import { spawnSync } from "node:child_process";
import * as path from "node:path";
import { TrustwareState } from "../../../components/trustware/TrustwareStateBadge";
import { SuitabilityAlphaSlotModel } from "../../../components/templates/slots/SuitabilityAlphaSlot";
import { TCOMirrorSlotModel } from "../../../components/templates/slots/TCOMirrorSlot";

export interface TrustwareDecision {
  slot_type: "SuitabilityAlphaSlot" | "TCOMirrorSlot";
  state: TrustwareState;
  headline: string;
  summary?: string;
  reasons: Array<{ code: string; message: string; evidence?: string }>;
  missing_fields: string[];
  version: "1.0";
  metadata?: Record<string, unknown>;
}

/** Política de income source para agregação conservadora */
export interface IncomeSource {
  type: "clt" | "variable" | "investment";
  amount: number;
  stability_coefficient?: number; // Default: CLT=1.0, variable=0.7, investment=0.5
}

/** Parâmetros expandidos para Suitability Alpha */
export interface SuitabilityParams {
  pv: number;
  rate: number;
  nper: number;
  income_sources?: IncomeSource[];
  liquidity_months?: number; // Reserva em meses de parcela
}

/**
 * Bridge per-decisão para o Toolbelt.
 * Executa em ambiente Node (Server-side) para invocar o núcleo Python.
 */
export function runToolbeltSync(tool: string, input: Record<string, unknown>) {
  const repoRoot = process.cwd();
  const pythonSrc = path.join(repoRoot, "libs/elysian-brain/src");

  const payload = { tool, input };

  const proc = spawnSync("python", ["-m", "elysian_brain.toolbelt.cli"], {
    input: JSON.stringify(payload),
    encoding: "utf-8",
    env: {
      ...process.env,
      PYTHONPATH: pythonSrc + (process.platform === "win32" ? ";" : ":") + (process.env.PYTHONPATH || "")
    },
  });

  if (proc.error) {
    throw new Error(`TOOLBELT_EXEC_ERROR: ${proc.error.message}`);
  }

  if (proc.status !== 0) {
    const stderr = (proc.stderr ?? "").toString();
    throw new Error(`TOOLBELT_FAILED (status ${proc.status}): ${stderr}`);
  }

  return JSON.parse(proc.stdout.toString());
}

/**
 * Agrega múltiplas fontes de renda usando coeficientes conservadores
 */
function aggregateIncome(sources: IncomeSource[]): number {
  const STABILITY_DEFAULTS: Record<string, number> = {
    clt: 1.0,
    variable: 0.7,
    investment: 0.5
  };

  return sources.reduce((total, source) => {
    const coefficient = source.stability_coefficient ?? STABILITY_DEFAULTS[source.type] ?? 0.7;
    return total + (source.amount * coefficient);
  }, 0);
}

/**
 * Orquestração: Suitability Alpha (EXPANDIDA)
 */
export async function getSuitabilityDecision(params: SuitabilityParams): Promise<SuitabilityAlphaSlotModel> {
  const missing: string[] = [];
  const reasons: Array<{ code: string; message: string; evidence?: string }> = [];

  try {
    // Calcula PMT usando Toolbelt
    const res = runToolbeltSync("finance", {
      op: "pmt",
      pv: params.pv,
      rate: params.rate,
      nper: params.nper
    });

    if (!res.ok) {
      return {
        slot_type: "SuitabilityAlphaSlot",
        version: "1.0",
        state: "blocked",
        headline: "Falha na validação de integridade.",
        summary: "O motor de cálculo retornou um erro inesperado.",
        reasons: [{ code: "ENGINE_ERROR", message: String(res.reason_codes?.[0] || "Unknown error") }],
        missing_fields: []
      };
    }

    const pmt = Math.abs(res.output.value);

    // Agrega income se disponível
    let effectiveIncome: number | null = null;
    if (params.income_sources && params.income_sources.length > 0) {
      effectiveIncome = aggregateIncome(params.income_sources);
      reasons.push({
        code: "INCOME_COMPOSITE_APPLIED",
        message: "Renda agregada com ponderação conservadora aplicada.",
        evidence: `sources: ${params.income_sources.length}, effective: ${effectiveIncome}`
      });
    } else {
      missing.push("income_sources");
    }

    // Liquidity depth check (regra crítica)
    if (params.liquidity_months !== undefined) {
      if (params.liquidity_months < 3 && pmt > 3000) {
        return {
          slot_type: "SuitabilityAlphaSlot",
          version: "1.0",
          state: "blocked",
          headline: "Reserva de liquidez crítica.",
          summary: "Perfil com menos de 3 meses de reserva e comprometimento elevado.",
          reasons: [
            {
              code: "LIQUIDITY_CRITICAL_BLOCK",
              message: "Liquidez insuficiente para comprometimento proposto.",
              evidence: `liquidity_months: ${params.liquidity_months}, pmt: ${pmt}`
            }
          ],
          missing_fields: [],
          metadata: {
            engine: "toolbelt/finance",
            policy_version: "2026.01.v2",
            pmt,
            liquidity_months: params.liquidity_months
          }
        };
      }

      if (params.liquidity_months < 6 && pmt > 2000) {
        reasons.push({
          code: "LIQUIDITY_SHALLOW_WARN",
          message: "Reserva abaixo de 6 meses com comprometimento moderado.",
          evidence: `liquidity_months: ${params.liquidity_months}`
        });
      }
    } else {
      missing.push("liquidity_months");
    }

    // Commitment ratio (tiered policy)
    let state: TrustwareState = "pass";
    let headline = "Integridade financeira validada.";
    let summary = `Parcela de ${pmt.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} dentro dos parâmetros.`;

    if (effectiveIncome !== null) {
      const commitmentRatio = pmt / effectiveIncome;

      if (commitmentRatio > 0.40) {
        state = "blocked";
        headline = "Comprometimento excede limite seguro.";
        summary = "Relação parcela/renda acima de 40% representa risco elevado.";
        reasons.push({
          code: "COMMITMENT_EXCEEDS_SAFE_LIMIT",
          message: "Comprometimento > 40% da renda efetiva.",
          evidence: `ratio: ${(commitmentRatio * 100).toFixed(1)}%`
        });
      } else if (commitmentRatio > 0.30) {
        state = "warn";
        headline = "Atenção: Comprometimento elevado detectado.";
        summary = "Relação parcela/renda entre 30-40% requer atenção.";
        reasons.push({
          code: "HIGH_COMMITMENT_TIER_2",
          message: "Comprometimento entre 30-40% da renda efetiva.",
          evidence: `ratio: ${(commitmentRatio * 100).toFixed(1)}%`
        });
      }
    } else {
      // Fallback: threshold simples se income não disponível
      if (pmt > 5000) {
        state = "warn";
        headline = "Atenção: Comprometimento elevado (renda não declarada).";
        summary = "Parcela acima do threshold sem validação de renda.";
        reasons.push({
          code: "HIGH_COMMITMENT_NO_INCOME",
          message: "PMT elevado sem dados de renda para cálculo de ratio.",
          evidence: `pmt: ${pmt}`
        });
      }
    }

    // Se há missing_fields críticos e nenhuma regra definitiva foi aplicada
    if (missing.length > 0 && state === "pass" && reasons.length === 0) {
      return {
        slot_type: "SuitabilityAlphaSlot",
        version: "1.0",
        state: "insufficient_data",
        headline: "Dados insuficientes para decisão completa.",
        summary: "Faltam parâmetros críticos para análise de integridade.",
        reasons: [],
        missing_fields: missing,
        metadata: {
          engine: "toolbelt/finance",
          policy_version: "2026.01.v2",
          pmt
        }
      };
    }

    return {
      slot_type: "SuitabilityAlphaSlot",
      version: "1.0",
      state,
      headline,
      summary,
      reasons,
      missing_fields: missing,
      metadata: {
        engine: "toolbelt/finance",
        policy_version: "2026.01.v2",
        pmt,
        effective_income: effectiveIncome,
        liquidity_months: params.liquidity_months
      }
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      slot_type: "SuitabilityAlphaSlot",
      version: "1.0",
      state: "insufficient_data",
      headline: "Erro técnico na orquestração.",
      summary: error.message,
      reasons: [],
      missing_fields: ["connection_to_engine"]
    };
  }
}

/** Categorização semântica de custos */
type CostSemantics = "certain" | "probable" | "estimable";

interface TCOLine {
  key: string;
  label: string;
  amount: number | null;
  note?: string;
  semantics: CostSemantics;
}

/**
 * Orquestração: TCO Mirror (EXPANDIDA)
 */
export async function getTCODecision(principal: number): Promise<TCOMirrorSlotModel> {
  const lines: TCOLine[] = [];

  // Custos certos (fixos e conhecidos)
  lines.push({
    key: "admin_fee",
    label: "Taxa Administrativa",
    amount: 25,
    note: "manutenção mensal fixa",
    semantics: "certain"
  });

  lines.push({
    key: "credit_analysis",
    label: "Análise de Crédito",
    amount: 450,
    note: "taxa obrigatória de análise",
    semantics: "certain"
  });

  // Custos prováveis (baseados em alíquotas determinísticas)
  const itbi = principal * 0.03;
  lines.push({
    key: "itbi",
    label: "ITBI (Estimado 3%)",
    amount: itbi,
    note: "alíquota municipal média",
    semantics: "probable"
  });

  const registry = principal * 0.01;
  lines.push({
    key: "registry",
    label: "Registro de Imóvel",
    amount: registry,
    note: "estimativa baseada em Valor Venal",
    semantics: "probable"
  });

  const deed = principal * 0.005;
  lines.push({
    key: "deed",
    label: "Escritura Pública",
    amount: deed,
    note: "estimativa de emolumentos",
    semantics: "probable"
  });

  lines.push({
    key: "insurance",
    label: "Seguro Obrigatório",
    amount: principal * 0.0005,
    note: "MIP/DFP estimado",
    semantics: "probable"
  });

  // Avaliação (condicional)
  if (principal > 500000) {
    lines.push({
      key: "property_evaluation",
      label: "Avaliação do Imóvel",
      amount: 1200,
      note: "obrigatória para valores > R$ 500k",
      semantics: "certain"
    });
  }

  // Custos estimáveis (parcela base e tarifas)
  lines.push({
    key: "parcel",
    label: "Parcela Base",
    amount: principal / 120,
    note: "sem juros (exemplo simplificado)",
    semantics: "estimable"
  });

  lines.push({
    key: "post_contemplation_cost",
    label: "Tarifas Adicionais",
    amount: 1500,
    note: "análise de garantias estimada",
    semantics: "estimable"
  });

  // Transfer tax (state-specific - exemplo simplificado)
  // Em produção, isso seria um lookup table por UF
  lines.push({
    key: "transfer_tax",
    label: "Taxa de Transferência",
    amount: null,
    note: "não calculável sem UF específica",
    semantics: "estimable"
  });

  return {
    slot_type: "TCOMirrorSlot",
    version: "1.0",
    disclaimer: "valores baseados em alíquotas fixas e políticas determinísticas (v2026.01.v2)",
    headline: "Custo Total de Aquisição (Projeção Expandida)",
    lines: lines.map(l => ({
      key: l.key as any,
      label: l.label,
      amount: l.amount,
      note: l.note
    })),
    bank_alternative: {
      headline: "Projeção Bancária (CET 10.5% p.a.)",
      monthly_cost: principal * 0.008,
      total_cost: principal * 1.8,
      note: "baseado em taxas médias de mercado atuais"
    }
  };
}
