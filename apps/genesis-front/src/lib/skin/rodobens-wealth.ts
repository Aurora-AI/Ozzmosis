import type { TokenDomain } from "../tokens"

export type SkinPreset = {
  domain: TokenDomain
  density: "calm" | "normal"
  rhythm: "trust" | "neutral"
}

export const rodobensWealthSkin: SkinPreset = {
  domain: "rodobens-wealth",
  density: "calm",
  rhythm: "trust",
}
