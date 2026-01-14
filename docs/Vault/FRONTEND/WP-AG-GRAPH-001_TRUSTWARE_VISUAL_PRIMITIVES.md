# WP-AG-GRAPH-001 — Trustware Visual Primitives (Clinical States)

**Status:** CONCLUÍDO
**Data:** 2026-01-14

## OBJETIVO
Materializar o `TRUSTWARE_DESIGN_CONTRACT` no frontend do Genesis, estabelecendo a gramática visual clínica necessária para auditoria de contratos e estados de integridade.

## ARQUIVOS TOCADOS
- `apps/genesis-front/src/lib/tokens/types.ts`: Definição dos tokens semânticos.
- `apps/genesis-front/src/lib/tokens/rodobens-wealth.ts`: Implementação dos valores HSL clínicos.
- `apps/genesis-front/src/lib/tokens/index.ts`: Mapeamento para variáveis CSS.
- `apps/genesis-front/components/trustware/TrustwareStateBadge.tsx`: Novo componente de badge de estado.
- `apps/genesis-front/components/trustware/TrustwareStateFrame.tsx`: Novo componente de moldura de integridade.
- `apps/genesis-front/components/templates/slots/SuitabilityAlphaSlot.tsx`: Aplicação das primitives.
- `apps/genesis-front/components/templates/slots/TCOMirrorSlot.tsx`: Aplicação de moldura neutra e estilo de auditoria.
- `apps/genesis-front/components/templates/slots/TrustwareSlotRenderer.tsx`: Fallbacks clínicos usando strings canônicas.

## TOKENS ADICIONADOS
- `--trustware-pass`: `hsl(142 70% 45%)` (Verde clínico)
- `--trustware-warn`: `hsl(38 92% 50%)` (Âmbar)
- `--trustware-blocked`: `hsl(0 84% 60%)` (Vermelho técnico)
- `--trustware-insufficient`: `hsl(240 5% 46%)` (Ghost/Neutro)

## COMPLIANCE (Design Contract)
- **Intensidade Clínica:** Cores discretas, uso de `color-mix` para bordas e fundos suaves.
- **Dicionário Canônico:** Implementação rigorosa de strings como "Falha na integridade do contrato" e "Sincronizando telemetria técnica...".
- **Anti-Marketing:** Removidos todos os termos persuasivos; botões renomeados para "Auditar Ponto" ou "Auditar Cálculo".
- **Estados:** Suporte nativo a `pass | warn | blocked | insufficient_data`.

## CRITÉRIOS DE ACEITE
- [x] Tokens semânticos centralizados.
- [x] Componentes sem hardcode de cores.
- [x] Slots existentes refatorados para o novo padrão.
- [x] Gates de build/lint/typecheck validados.

---
## FECHAMENTO
WP finalizado. A infraestrutura visual está pronta para a composição do Terminal no WP-AG-GRAPH-002.

**Commit:** `1c08ddf`
**Integridade:** Validado via `lint`, `typecheck` e `build`.

*Assinado: Antigravity Governance Protocol*
