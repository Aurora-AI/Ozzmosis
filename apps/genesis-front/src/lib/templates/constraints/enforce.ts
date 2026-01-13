import type { BlockId, GenesisTemplate } from "../types"

export type ConstraintIssue = {
  path: string
  code: "ORDER" | "CONSTRAINT" | "NO_SELL_HEURISTIC"
  message: string
}

export type ConstraintResult =
  | { ok: true }
  | { ok: false; issues: ConstraintIssue[] }

const CANON_ORDER: BlockId[] = ["hero", "proof", "intentions", "govern", "footer"]

// Heurística mínima (não é “polícia de copy”): bloqueia termos óbvios na primeira dobra.
// Mantemos pequeno para evitar falsos positivos.
const NO_SELL_TERMS = [
  "compre",
  "comprar",
  "contrate",
  "contratar",
  "promoção",
  "desconto",
  "aproveite",
  "oferta",
  "taxa",
  "juros",
  "parcelas",
  "plano",
]

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function enforceGenesisConstraints(
  template: GenesisTemplate,
): ConstraintResult {
  const issues: ConstraintIssue[] = []

  // 1) lockedOrder: se todos os blocks declararem lockedOrder=true, exigimos ordem canônica.
  const allLocked = template.blocks.every((b) => b.constraints?.lockedOrder === true)
  if (allLocked) {
    const ids = template.blocks.map((b) => b.id)
    const canon = CANON_ORDER.join("|")
    const got = ids.join("|")
    if (got !== canon) {
      issues.push({
        path: "$.blocks",
        code: "ORDER",
        message: `lockedOrder enabled: expected '${canon}', got '${got}'.`,
      })
    }
  }

  // 2) tokensOnly / noSellLanguage flags devem estar true (baseline v0)
  template.blocks.forEach((b, i) => {
    const p = `$.blocks[${i}].constraints`
    if (b.constraints?.tokensOnly !== true) {
      issues.push({
        path: `${p}.tokensOnly`,
        code: "CONSTRAINT",
        message: "tokensOnly must be true.",
      })
    }
    if (b.constraints?.noSellLanguage !== true) {
      issues.push({
        path: `${p}.noSellLanguage`,
        code: "CONSTRAINT",
        message: "noSellLanguage must be true.",
      })
    }
  })

  // 3) Heurística noSellLanguage (somente hero + proof, onde fica a primeira dobra)
  const hero = template.blocks.find((b) => b.id === "hero")
  const proof = template.blocks.find((b) => b.id === "proof")

  const scan = (text: string, path: string) => {
    const t = normalize(text)
    for (const term of NO_SELL_TERMS) {
      if (t.includes(term)) {
        issues.push({
          path,
          code: "NO_SELL_HEURISTIC",
          message: `Term '${term}' not allowed in first-dobra copy.`,
        })
      }
    }
  }

  if (hero && hero.constraints?.noSellLanguage) {
    // kicker/headline/subhead
    scan(
      String(hero.payload?.kicker?.value ?? ""),
      "$.blocks[hero].payload.kicker.value",
    )
    scan(
      String(hero.payload?.headline?.value ?? ""),
      "$.blocks[hero].payload.headline.value",
    )
    scan(
      String(hero.payload?.subhead?.value ?? ""),
      "$.blocks[hero].payload.subhead.value",
    )
  }

  if (proof && proof.constraints?.noSellLanguage) {
    scan(
      String(proof.payload?.title?.value ?? ""),
      "$.blocks[proof].payload.title.value",
    )
  }

  if (issues.length > 0) return { ok: false, issues }
  return { ok: true }
}
