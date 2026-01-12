import type { CssVarMap, TokenCore, TokenSet } from "./types"
import { rodobensWealthSemantic } from "./rodobens-wealth"

export type TokenDomain = "rodobens-wealth"

const core: TokenCore = {
  color: {
    bg: "hsl(0 0% 100%)", // Absolute White
    fg: "hsl(222 15% 12%)",
    surface: "hsl(0 0% 100%)",
    surfaceAlt: "hsl(0 0% 98%)",
    border: "hsl(220 10% 88%)",
    shadow: "hsl(222 15% 12% / 0.10)",
  },
  typography: {
    fontSans:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    fontMono:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    size: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "22px",
      "2xl": "28px",
    },
    line: {
      tight: "1.15",
      normal: "1.4",
      relaxed: "1.6",
    },
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    letter: {
      tight: "-0.01em",
      normal: "0em",
      wide: "0.02em",
    },
  },
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },
}

export function getTokens(domain: TokenDomain = "rodobens-wealth"): TokenSet {
  if (domain === "rodobens-wealth") {
    return {
      core,
      semantic: rodobensWealthSemantic,
    }
  }
  return { core, semantic: rodobensWealthSemantic }
}

export function tokensToCssVars(tokens: TokenSet): CssVarMap {
  return {
    // Core colors
    "--color-bg": tokens.core.color.bg,
    "--color-fg": tokens.core.color.fg,
    "--color-surface": tokens.core.color.surface,
    "--color-surface-alt": tokens.core.color.surfaceAlt,
    "--color-border": tokens.core.color.border,
    "--color-shadow": tokens.core.color.shadow,

    // Semantic colors
    "--color-accent": tokens.semantic.accent,
    "--color-cta": tokens.semantic.cta,
    "--color-success": tokens.semantic.success,
    "--color-warn": tokens.semantic.warn,
    "--color-danger": tokens.semantic.danger,

    // Typography
    "--font-sans": tokens.core.typography.fontSans,
    "--font-mono": tokens.core.typography.fontMono,

    "--text-xs": tokens.core.typography.size.xs,
    "--text-sm": tokens.core.typography.size.sm,
    "--text-md": tokens.core.typography.size.md,
    "--text-lg": tokens.core.typography.size.lg,
    "--text-xl": tokens.core.typography.size.xl,
    "--text-2xl": tokens.core.typography.size["2xl"],

    "--lh-tight": tokens.core.typography.line.tight,
    "--lh-normal": tokens.core.typography.line.normal,
    "--lh-relaxed": tokens.core.typography.line.relaxed,

    "--fw-regular": tokens.core.typography.weight.regular,
    "--fw-medium": tokens.core.typography.weight.medium,
    "--fw-semibold": tokens.core.typography.weight.semibold,
    "--fw-bold": tokens.core.typography.weight.bold,

    "--ls-tight": tokens.core.typography.letter.tight,
    "--ls-normal": tokens.core.typography.letter.normal,
    "--ls-wide": tokens.core.typography.letter.wide,

    // Radius
    "--radius-sm": tokens.core.radius.sm,
    "--radius-md": tokens.core.radius.md,
    "--radius-lg": tokens.core.radius.lg,
    "--radius-xl": tokens.core.radius.xl,

    // Space
    "--space-1": tokens.core.space[1],
    "--space-2": tokens.core.space[2],
    "--space-3": tokens.core.space[3],
    "--space-4": tokens.core.space[4],
    "--space-6": tokens.core.space[6],
    "--space-8": tokens.core.space[8],
    "--space-10": tokens.core.space[10],
    "--space-12": tokens.core.space[12],
    "--space-16": tokens.core.space[16],
    "--space-20": tokens.core.space[20],
    "--space-24": tokens.core.space[24],
  }
}
