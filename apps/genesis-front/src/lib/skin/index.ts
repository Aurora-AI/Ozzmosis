import type { SkinPreset } from "./rodobens-wealth"
import { rodobensWealthSkin } from "./rodobens-wealth"

export function getActiveSkin(): SkinPreset {
  // Genesis Rodobens (wealth) — default canônico do projeto atual.
  return rodobensWealthSkin
}
