import type { BlockId } from "../types"

/**
 * Validator soberano (sem deps).
 * Objetivo: proteger o template engine contra payloads inválidos do futuro "Construtor".
 *
 * Importante:
 * - Não substitui JSON Schema (contrato externo)
 * - Serve como guardrail runtime dentro do app
 */
export type ValidationIssue = {
  path: string
  code:
    | "REQUIRED"
    | "TYPE"
    | "ENUM"
    | "MAX_CHARS"
    | "DUPLICATE_BLOCK"
    | "MISSING_BLOCK"
    | "UNKNOWN_BLOCK"
  message: string
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; issues: ValidationIssue[] }

const REQUIRED_BLOCKS: BlockId[] = [
  "hero",
  "proof",
  "intentions",
  "govern",
  "footer",
]

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function checkTextSlot(slot: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObject(slot)) {
    issues.push({ path, code: "TYPE", message: "Expected object (TextSlot)." })
    return
  }

  const value = slot.value
  if (typeof value !== "string") {
    issues.push({
      path: `${path}.value`,
      code: "TYPE",
      message: "Expected string.",
    })
    return
  }

  const maxChars = slot.maxChars
  if (typeof maxChars === "number" && Number.isFinite(maxChars)) {
    if (value.length > maxChars) {
      issues.push({
        path: `${path}.value`,
        code: "MAX_CHARS",
        message: `Text exceeds maxChars (${value.length}/${maxChars}).`,
      })
    }
  }
}

export function validateGenesisV0Template(
  input: unknown,
): ValidationResult {
  const issues: ValidationIssue[] = []

  if (!isObject(input)) {
    return {
      ok: false,
      issues: [{ path: "$", code: "TYPE", message: "Expected object." }],
    }
  }

  if (input.templateId !== "genesis-v0") {
    issues.push({
      path: "$.templateId",
      code: "ENUM",
      message: "templateId must be 'genesis-v0'.",
    })
  }

  const blocks = input.blocks
  if (!Array.isArray(blocks)) {
    issues.push({
      path: "$.blocks",
      code: "TYPE",
      message: "blocks must be an array.",
    })
    return { ok: false, issues }
  }

  // Required blocks presence + duplicates
  const seen = new Set<string>()
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    const p = `$.blocks[${i}]`

    if (!isObject(b)) {
      issues.push({ path: p, code: "TYPE", message: "Block must be an object." })
      continue
    }

    const id = b.id
    if (typeof id !== "string") {
      issues.push({
        path: `${p}.id`,
        code: "TYPE",
        message: "Block id must be a string.",
      })
      continue
    }

    if (!REQUIRED_BLOCKS.includes(id as BlockId)) {
      issues.push({
        path: `${p}.id`,
        code: "UNKNOWN_BLOCK",
        message: `Unknown block '${id}'.`,
      })
      continue
    }

    if (seen.has(id)) {
      issues.push({
        path: `${p}.id`,
        code: "DUPLICATE_BLOCK",
        message: `Duplicate block '${id}'.`,
      })
    } else {
      seen.add(id)
    }

    // minimal payload text checks for known blocks
    if (!isObject(b.payload)) {
      issues.push({
        path: `${p}.payload`,
        code: "TYPE",
        message: "payload must be an object.",
      })
      continue
    }

    // Only enforce maxChars where present (builder-ready)
    if (id === "hero") {
      checkTextSlot(b.payload.kicker, `${p}.payload.kicker`, issues)
      checkTextSlot(b.payload.headline, `${p}.payload.headline`, issues)
      checkTextSlot(b.payload.subhead, `${p}.payload.subhead`, issues)
    }

    if (id === "proof") {
      checkTextSlot(b.payload.title, `${p}.payload.title`, issues)
      const bullets = b.payload.bullets
      if (Array.isArray(bullets)) {
        bullets.forEach((x, j) => {
          checkTextSlot(x?.title, `${p}.payload.bullets[${j}].title`, issues)
          checkTextSlot(x?.body, `${p}.payload.bullets[${j}].body`, issues)
        })
      }
    }

    if (id === "intentions") {
      checkTextSlot(b.payload.title, `${p}.payload.title`, issues)
      const items = b.payload.items
      if (Array.isArray(items)) {
        items.forEach((x, j) => {
          checkTextSlot(x?.name, `${p}.payload.items[${j}].name`, issues)
          checkTextSlot(x?.body, `${p}.payload.items[${j}].body`, issues)
        })
      }
    }

    if (id === "govern") {
      checkTextSlot(b.payload.title, `${p}.payload.title`, issues)
      checkTextSlot(b.payload.body, `${p}.payload.body`, issues)
    }

    if (id === "footer") {
      checkTextSlot(b.payload.left, `${p}.payload.left`, issues)
      checkTextSlot(b.payload.right, `${p}.payload.right`, issues)
    }
  }

  // Ensure all required blocks exist (as contract baseline)
  for (const rb of REQUIRED_BLOCKS) {
    if (!seen.has(rb)) {
      issues.push({
        path: "$.blocks",
        code: "MISSING_BLOCK",
        message: `Missing required block '${rb}'.`,
      })
    }
  }

  if (issues.length > 0) return { ok: false, issues }
  return { ok: true }
}
