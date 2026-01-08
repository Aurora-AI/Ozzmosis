// apps/butantan-shield/src/core/verifier.ts
/**
 * Verificador determinístico mínimo.
 *
 * Importante: este módulo existe para materializar o contrato público do Shield
 * sem inventar semântica de segurança. Ele deve evoluir para validar regras
 * reais (TrustwareEngine) quando as policies estiverem integradas.
 */

export type ShieldDecision =
  | { status: "ALLOW"; reason: string }
  | { status: "DENY"; reason: string }
  | { status: "ERROR"; reason: string };

/**
 * verifyToken NÃO deve "validar" token de forma enganosa.
 * Neste estágio, ele é um verificador determinístico mínimo:
 * - token vazio -> DENY
 * - token presente -> ERROR (indica que a validação real ainda não está conectada)
 */
export function verifyToken(token: string): ShieldDecision {
  const t = (token ?? "").trim();

  if (!t) {
    return { status: "DENY", reason: "empty_token" };
  }

  return {
    status: "ERROR",
    reason: "verifier_not_integrated_with_trustware_engine_yet",
  };
}
