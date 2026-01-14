# WP-AG-GRAPH-003 — Slot Focus & Progressive Disclosure

**Status:** CONCLUÍDO
**Data:** 2026-01-14

## OBJETIVO
Implementar o controle cognitivo da atenção no Terminal Trustware através de estados de foco e revelação progressiva de metadados técnicos.

## ARQUIVOS MODIFICADOS
- `apps/genesis-front/components/trustware/TrustwareStateFrame.tsx`: Lógica visual de foco/dimming e renderização condicional de metadados.
- `apps/genesis-front/components/terminal/TrustwareAuditTerminal.tsx`: Gestão de estado local (`focusedSlotIndex`).
- `apps/genesis-front/components/templates/slots/TrustwareSlotRenderer.tsx`: Prop drilling de contexto visual.
- `apps/genesis-front/components/templates/slots/SuitabilityAlphaSlot.tsx`: Adaptação para foco + payload de metadados.
- `apps/genesis-front/components/templates/slots/TCOMirrorSlot.tsx`: Adaptação para foco + payload de metadados.

## MUDANÇAS IMPLEMENTADAS

### 1. Foco Visual (Cognitive Control)
- **Ativação:** Clique no slot.
- **De-emphasis:** Slots não focados recebem `opacity: 0.4` e `grayscale(0.5)`.
- **Ênfase:** Slot focado ganha leve `scale(1.005)`, sombra sutil e borda reforçada (`60%` da cor do estado).
- **Exit:** Clique no background reseta o estado.

### 2. Progressive Disclosure
- Metadados técnicos (versão, contagens, flags) aparecem **somente** quando o slot está focado.
- Área de metadados com fundo clínico (`bg-stone-50/50`) e tipografia mono/uppercase.
- Animação de entrada sutil (`animate-in fade-in`), sem movimento brusco.

### 3. Preservação de Contexto
- `AuditSideRail` e outros slots permanecem visíveis (apenas atenuados).
- O estado global de integridade nunca é ocultado.

## COMPLIANCE (Design Contract)
- **Sem Novas Primitives:** Reuso estrito de `TrustwareStateFrame`.
- **Sem Tokens Novos:** Uso de `color-mix` para variações de intensidade.
- **Micro-interações:** Apenas transições de opacidade/cor, sem animações de layout complexas.
- **Copy:** Metadados puramente técnicos ("Slot Version", "Missing Fields").

## CRITÉRIOS DE ACEITE
- [x] Clique foca e atenua os demais.
- [x] Metadados aparecem apenas no foco.
- [x] Clique fora remove o foco.
- [x] Gates PASS (lint, typecheck, build).
- [x] 1 Commit atômico.

---
## FECHAMENTO
Terminal agora suporta "leitura profunda" (Deep Read) sem perder a verdade sistêmica.

**Commit:** `6c1b901`
**Integridade:** Validado via `lint`, `typecheck` e `build`.

*Assinado: Antigravity Governance Protocol*
