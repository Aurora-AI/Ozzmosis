import type { GenesisTemplate } from "./types"
import { validateGenesisV0Template } from "./schema"

/**
 * Helper soberano para o futuro Antigravity/Construtor:
 * - recebe unknown (JSON)
 * - valida
 * - retorna template tipado ou erro
 */
export function loadGenesisTemplate(
  input: unknown,
):
  | {
      ok: true
      template: GenesisTemplate
    }
  | {
      ok: false
      issues: Array<{ path: string; code: string; message: string }>
    } {
  const v = validateGenesisV0Template(input)
  if (!v.ok) return { ok: false, issues: v.issues }
  return { ok: true, template: input as GenesisTemplate }
}
