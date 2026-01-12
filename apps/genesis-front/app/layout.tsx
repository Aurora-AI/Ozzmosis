import type { ReactNode } from "react"
import "./globals.css"
import { getTokens, tokensToCssVars } from "../src/lib/tokens"
import { getActiveSkin } from "../src/lib/skin"

export const metadata = {
  title: "Genesis — Rodobens Wealth",
  description: "Genesis Frontend (Rodobens / Wealth) — tokens-first, motion governed.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const skin = getActiveSkin()
  const tokens = getTokens(skin.domain)
  const cssVars = tokensToCssVars(tokens)

  return (
    <html lang="pt-BR" style={cssVars}>
      <body>{children}</body>
    </html>
  )
}
