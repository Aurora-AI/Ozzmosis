export type TokenCore = {
  color: {
    bg: string
    fg: string
    surface: string
    surfaceAlt: string
    border: string
    shadow: string
  }
  typography: {
    fontSans: string
    fontMono: string
    size: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      "2xl": string
    }
    line: {
      tight: string
      normal: string
      relaxed: string
    }
    weight: {
      regular: string
      medium: string
      semibold: string
      bold: string
    }
    letter: {
      tight: string
      normal: string
      wide: string
    }
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  space: {
    1: string
    2: string
    3: string
    4: string
    6: string
    8: string
    10: string
    12: string
    16: string
    20: string
    24: string
  }
  layout: {
    containerMax: string
    borderWidth: {
      1: string
    }
  }
}

export type TokenSemantic = {
  accent: string
  cta: string
  success: string
  warn: string
  danger: string
}

export type TokenSet = {
  core: TokenCore
  semantic: TokenSemantic
}

export type CssVarMap = Record<`--${string}`, string>
