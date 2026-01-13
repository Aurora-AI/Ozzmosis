---
id: WP11_TRUSTWARE_SLOT_REGISTRY
project: Aurora / Ozzmosis
product: Genesis Front (frontend platform)
date: 2026-01-13
status: ACTIVE
scope: frontend-only
governance:
  ssot: Vault
  rule_wp_commit: "1 WP = 1 commit"
  constraints:
    - tokens_only
    - no_backend_dependency
    - no_financial_calculation
    - no_sales_cta
    - no_builder_adapter_change
---

# WP11 — Trustware Slot Registry (Composição Determinística)

## Contexto

WP8 introduziu os primeiros TrustwareSlots (SuitabilityAlphaSlot e TCOMirrorSlot) e seus contratos.
WP10 introduziu um playground dev-only para validação visual.
Ainda falta um ponto estrutural de plataforma: um **registro determinístico** que permita ao runtime compor slots por `slot_type` com fallback auditável quando o slot é desconhecido ou inválido.

## Objetivo

Criar um **Slot Registry** canônico para TrustwareSlots, com:

- lista explícita de `slot_type` aceitos (SSOT técnico),
- renderer determinístico `slot_type -> componente`,
- fallback neutro e auditável para:
  - slot desconhecido,
  - payload ausente,
  - payload inválido (sem crash).

## Escopo (IN)

- Registry determinístico em `src/lib/templates/slots/`.
- Renderer único em `components/templates/slots/`.
- Fallback neutro “Análise Manual Pendente” / “Slot desconhecido”.
- Sem integração com pages/templates/builder adapter (apenas infraestrutura).

## Fora de Escopo (OUT)

- Toolbelt
- Backend
- Cálculo real
- Integração com builder adapter
- Copy comercial ou CTA de conversão

## Critérios de Aceite (DUROS)

- Runtime consegue renderizar:
  - SuitabilityAlphaSlot
  - TCOMirrorSlot
    a partir de `slot_type`.
- Slots desconhecidos renderizam fallback neutro (sem crash).
- Payload ausente renderiza fallback neutro.
- Nenhum CTA de venda.
- Tokens-only.
- Gates do workspace `@aurora/genesis-front` passam:
  - typecheck
  - build
- Commit único contendo apenas os arquivos do WP11 + este doc.

## Evidências mínimas no fechamento

- `git show --name-only --oneline --no-patch <commit>`
- Relato: “renderer compõe por slot_type e faz fallback”

---

## Fechamento (Evidências)

**Commit (WP11 único):** cff8748be52746047508391940e0dcffa062b884

**Arquivos entregues:**

- docs/Vault/FRONTEND/WP11_TRUSTWARE_SLOT_REGISTRY.md
- apps/genesis-front/src/lib/templates/slots/slotRegistry.ts
- apps/genesis-front/components/templates/slots/TrustwareSlotRenderer.tsx

**Gates (PASS):**

- npm -w @aurora/genesis-front run typecheck (PASS)
- npm -w @aurora/genesis-front run build (PASS)

**Notas de governança:**

- Registry determinístico (slot_type → componente).
- Fallback neutro e auditável para slot desconhecido/ausente/erro.
- Zero CTA de conversão.
- Nenhuma alteração em builder adapter (escopo preservado).
