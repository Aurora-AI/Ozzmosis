export type MediaKind = "none" | "video" | "image"

export type MediaSlot = {
  kind: MediaKind
  // Para futuro: URL do video, CDN, ou caminho de upload.
  src?: string
  poster?: string
  alt?: string
}

export type TextSlot = {
  // Texto "editavel", mas governado por limites.
  value: string
  // Limites ajudam o construtor a nao quebrar template.
  maxChars?: number
}

export type CtaSlot = {
  label: string
  href?: string
  kind: "primary" | "secondary" | "ghost"
}

export type BlockId =
  | "hero"
  | "proof"
  | "intentions"
  | "govern"
  | "footer"

export type BlockConstraints = {
  // Ordem e regras do template (para futuro builder).
  lockedOrder?: boolean
  tokensOnly?: boolean
  noSellLanguage?: boolean
}

export type BlockBase<T extends BlockId, P> = {
  id: T
  title?: string
  constraints: BlockConstraints
  payload: P
}

export type HeroPayload = {
  media: MediaSlot
  kicker: TextSlot
  headline: TextSlot
  subhead: TextSlot
  ctas: CtaSlot[]
}

export type ProofPayload = {
  title: TextSlot
  bullets: Array<{ title: TextSlot; body: TextSlot }>
}

export type IntentionsPayload = {
  title: TextSlot
  items: Array<{ name: TextSlot; body: TextSlot }>
}

export type GovernPayload = {
  title: TextSlot
  body: TextSlot
  ctas: CtaSlot[]
}

export type FooterPayload = {
  left: TextSlot
  right: TextSlot
}

export type HeroBlock = BlockBase<"hero", HeroPayload>
export type ProofBlock = BlockBase<"proof", ProofPayload>
export type IntentionsBlock = BlockBase<"intentions", IntentionsPayload>
export type GovernBlock = BlockBase<"govern", GovernPayload>
export type FooterBlock = BlockBase<"footer", FooterPayload>

export type GenesisTemplate = {
  templateId: "genesis-v0"
  blocks: Array<HeroBlock | ProofBlock | IntentionsBlock | GovernBlock | FooterBlock>
}
