import type { GenesisTemplate } from "../types"
import { loadGenesisTemplate } from "../load"
import { enforceGenesisConstraints } from "../constraints"

export type BuilderLoadResult =
  | { ok: true; template: GenesisTemplate }
  | {
      ok: false
      stage: "schema" | "constraints"
      issues: Array<{ path: string; code: string; message: string }>
    }

export function loadTemplateForRender(input: unknown): BuilderLoadResult {
  const loaded = loadGenesisTemplate(input)
  if (!loaded.ok) return { ok: false, stage: "schema", issues: loaded.issues }

  const enforced = enforceGenesisConstraints(loaded.template)
  if (!enforced.ok)
    return { ok: false, stage: "constraints", issues: enforced.issues }

  return { ok: true, template: loaded.template }
}
