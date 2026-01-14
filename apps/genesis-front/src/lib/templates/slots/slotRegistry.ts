export const TRUSTWARE_SLOT_TYPES = ["SuitabilityAlphaSlot", "TCOMirrorSlot"] as const;

export type TrustwareSlotType = (typeof TRUSTWARE_SLOT_TYPES)[number];

export function isTrustwareSlotType(value: unknown): value is TrustwareSlotType {
  return typeof value === "string" && (TRUSTWARE_SLOT_TYPES as readonly string[]).includes(value);
}

/**
 * Contrato mínimo para roteamento determinístico.
 * Não valida schema completo (isso é responsabilidade do validator do template contract);
 * aqui apenas garante a existência de um slot_type roteável.
 */
export type SlotEnvelope = {
  slot_type: string;
  [k: string]: unknown;
};

export function getSlotType(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const st = p["slot_type"];
  return typeof st === "string" ? st : null;
}
