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

/**
 * Bridge per-decisão para o Toolbelt.
 * Executa em ambiente Node (Server-side) para invocar o núcleo Python.
 */
export function runToolbeltSync(tool: string, input: Record<string, unknown>) {
  // Ajuste de caminhos para o monorepo Ozzmosis
  const repoRoot = process.cwd(); // Assume c:\Aurora\Ozzmosis
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
 * Orquestração: Suitability Alpha
 * Mapeia ferramentas de finanças para o contrato do Slot.
 */
export async function getSuitabilityDecision(params: {
  pv: number;
  rate: number;
  nper: number;
}): Promise<SuitabilityAlphaSlotModel> {
  try {
    const res = runToolbeltSync("finance", {
      op: "pmt",
      ...params
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

    // Lógica determinística de Suitability (Exemplo: PMT > Threshold)
    const pmt = Math.abs(res.output.value);
    const threshold = 5000; // Hardcoded apenas para este WP experimental

    let state: TrustwareState = "pass";
    let headline = "Integridade financeira validada.";
    let summary = `A parcela de ${pmt.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} está dentro do parâmetro de segurança.`;
    const reasons = [];

    if (pmt > threshold) {
      state = "warn";
      headline = "Atenção: Comprometimento elevado detectado.";
      summary = "A parcela excede o threshold de segurança para o perfil padrão.";
      reasons.push({
        code: "HIGH_COMMITMENT",
        message: "Comprometimento mensal acima do teto recomendado.",
        evidence: `pmt: ${pmt} > threshold: ${threshold}`
      });
    }

    return {
      slot_type: "SuitabilityAlphaSlot",
      version: "1.0",
      state,
      headline,
      summary,
      reasons,
      missing_fields: [],
      metadata: {
        engine: "toolbelt/finance",
        policy_version: "2026.01.v1",
        pmt
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

/**
 * Orquestração: TCO Mirror
 */
export async function getTCODecision(principal: number): Promise<TCOMirrorSlotModel> {
  // Simplificado para o WP atual: calcula apenas os custos de cartório baseados em % fixos
  // No futuro, isso usará ferramentas específicas do Toolbelt.

  const itbi = principal * 0.03;
  const registry = principal * 0.01;
  const deed = principal * 0.005;

  return {
    slot_type: "TCOMirrorSlot",
    version: "1.0",
    disclaimer: "valores baseados em alíquotas fixas (auditoria determinística)",
    headline: "Custo Total de Aquisição (Projeção)",
    lines: [
      { key: "itbi", label: "ITBI (Estimado 3%)", amount: itbi, note: "alíquota municipal média" },
      { key: "registry", label: "Registro de Imóvel", amount: registry, note: "estimativa baseada em Valor Venal" },
      { key: "deed", label: "Escritura Pública", amount: deed, note: "estimativa de emolumentos" },
      { key: "insurance", label: "Seguro Obrigatório", amount: principal * 0.0005, note: "MIP/DFP" },
      { key: "admin_fee", label: "Taxa Administrativa", amount: 25, note: "manutenção mensal" },
      { key: "parcel", label: "Parcela Base", amount: principal / 120, note: "sem juros (exemplo)" },
      { key: "post_contemplation_cost", label: "Tarifas Adicionais", amount: 1500, note: "análise de garantias" }
    ],
    bank_alternative: {
      headline: "Projeção Bancária (CET 10.5% p.a.)",
      monthly_cost: principal * 0.008,
      total_cost: principal * 1.8,
      note: "baseado em taxas médias de mercado atuais"
    }
  };
}
