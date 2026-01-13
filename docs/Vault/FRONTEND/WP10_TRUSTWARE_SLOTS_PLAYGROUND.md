---
id: WP10_TRUSTWARE_SLOTS_PLAYGROUND
project: Aurora / Ozzmosis
product: Genesis Front (internal QA)
date: 2026-01-13
status: ACTIVE
scope: frontend-only
governance:
  ssot: Vault
  rule_wp_commit: "1 WP = 1 commit"
  constraints:
    - internal_only
    - no_marketing_copy
    - no_sales_cta
    - no_backend_dependency
    - no_builder_integration
---

# WP10 — Trustware Slots Playground (Internal)

## Contexto
Após WP8 (TrustwareSlots + schemas) e WP9 (gitignore liberando `*.schema.json`), precisamos de um caminho interno e controlado para:
- renderizar os slots com dados dummy,
- validar estados (incluindo `insufficient_data`),
- permitir screenshots e QA,
sem integrar em templates/builder e sem contaminar UX pública.

## Objetivo
Criar uma rota/página interna (dev-only) que renderiza:
- `SuitabilityAlphaSlot` (em múltiplos estados)
- `TCOMirrorSlot` (demo)
com payloads dummy dedicados.

## Escopo (IN)
- Página interna em namespace `_dev`.
- Payloads dummy em módulo dedicado.
- Guard rail dev-only: conteúdo visível apenas quando `NODE_ENV=development`.
- Zero CTA de conversão.

## Fora de Escopo (OUT)
- Integração com templates/builder adapter.
- Toolbelt.
- Backend.
- Copy comercial.
- Alteração de slots/schemas do WP8.

## Critérios de Aceite (DUROS)
- Compila em `npm -w @aurora/genesis-front run build`.
- Em ambiente não-dev, a página não expõe conteúdo (mensagem neutra).
- Renderiza:
  - Suitability: `pass | warn | blocked | insufficient_data`
  - TCO: linhas com `amount = null` + placeholder bank alternative
- Commit único contendo apenas os arquivos do WP10.

## Evidências mínimas no fechamento
- `git show --name-only --oneline --no-patch <commit>`
- Relato: “rota interna renderiza os 2 slots com estados dummy”
