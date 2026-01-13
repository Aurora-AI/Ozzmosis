import type { GenesisTemplate } from "./types"

export const genesisTemplateV0: GenesisTemplate = {
  templateId: "genesis-v0",
  blocks: [
    {
      id: "hero",
      constraints: {
        lockedOrder: true,
        tokensOnly: true,
        noSellLanguage: true,
      },
      payload: {
        // Preparado para vídeo/link/upload. Agora: none.
        media: { kind: "none" },
        kicker: { value: "Aurora • Rodobens • Elysian", maxChars: 42 },
        headline: {
          value:
            "Você constrói decisões importantes.\nNós registramos a verdade.",
          maxChars: 92,
        },
        subhead: {
          value:
            "Template governado por cognição: primeiro impacto, depois instrução. Sem promessas. Sem ruído.",
          maxChars: 160,
        },
        ctas: [
          { label: "Começar", kind: "primary" },
          { label: "Como funciona", kind: "secondary" },
        ],
      },
    },
    {
      id: "proof",
      constraints: { lockedOrder: true, tokensOnly: true, noSellLanguage: true },
      payload: {
        title: { value: "Por que isso é diferente", maxChars: 60 },
        bullets: [
          {
            title: { value: "Não começamos por produto", maxChars: 40 },
            body: {
              value: "Começamos pela intenção humana e pelo contexto mínimo.",
              maxChars: 90,
            },
          },
          {
            title: { value: "Sem promessa, com governança", maxChars: 40 },
            body: {
              value: "O sistema registra decisão e evidencia o caminho.",
              maxChars: 90,
            },
          },
          {
            title: { value: "Wealth progressivo", maxChars: 40 },
            body: {
              value:
                "Pegamos na mão antes do private tradicional — e seguimos junto.",
              maxChars: 100,
            },
          },
        ],
      },
    },
    {
      id: "intentions",
      constraints: { lockedOrder: true, tokensOnly: true, noSellLanguage: true },
      payload: {
        title: { value: "A vida tem três movimentos", maxChars: 52 },
        items: [
          {
            name: { value: "Construir", maxChars: 16 },
            body: { value: "Formar patrimônio com previsibilidade.", maxChars: 64 },
          },
          {
            name: { value: "Proteger", maxChars: 16 },
            body: {
              value: "Blindar a jornada para não interromper o caminho.",
              maxChars: 74,
            },
          },
          {
            name: { value: "Perpetuar", maxChars: 16 },
            body: { value: "Organizar legado, visão e soberania.", maxChars: 64 },
          },
        ],
      },
    },
    {
      id: "govern",
      constraints: { lockedOrder: true, tokensOnly: true, noSellLanguage: true },
      payload: {
        title: { value: "Organizar vem antes de enriquecer", maxChars: 64 },
        body: {
          value:
            "Legal Lex é a porta de entrada: registra, organiza e cria memória auditável. O resto é consequência.",
          maxChars: 160,
        },
        ctas: [{ label: "Organizar minha vida", kind: "primary" }],
      },
    },
    {
      id: "footer",
      constraints: { lockedOrder: true, tokensOnly: true, noSellLanguage: true },
      payload: {
        left: { value: "Genesis • Frontend Factory", maxChars: 48 },
        right: { value: "Slots governados • Tokens SSOT", maxChars: 48 },
      },
    },
  ],
}
