import type { TokenSemantic } from "./types"

// Rodobens Wealth: semântica (camada de domínio) — sem violar Canon.
export const rodobensWealthSemantic: TokenSemantic = {
  accent: "hsl(220 85% 55%)",
  cta: "hsl(220 85% 55%)",
  success: "hsl(145 70% 38%)",
  warn: "hsl(38 92% 50%)",
  danger: "hsl(0 75% 55%)",
  // Trustware (WP-AG-GRAPH-001): Clinical Intensity
  trustwarePass: "hsl(142 70% 45%)", // Green clinical
  trustwareWarn: "hsl(38 92% 50%)", // Amber
  trustwareBlocked: "hsl(0 84% 60%)", // Technical red
  trustwareInsufficient: "hsl(240 5% 46%)", // Neutral ghost
}
