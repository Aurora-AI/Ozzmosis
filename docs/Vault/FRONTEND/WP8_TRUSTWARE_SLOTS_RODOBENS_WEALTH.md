---
id: WP8_TRUSTWARE_SLOTS_RODOBENS_WEALTH
project: Aurora / Ozzmosis
product: Rodobens Wealth
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
---

# WP8 — TRUSTWARE SLOTS (FRONTEND CANÔNICO)

## Contexto
Este WP materializa no frontend os **dois primeiros TrustwareSlots** do Rodobens Wealth, conforme o canon vigente do WP4 (Board Breaker).  
O objetivo é **renderizar Verdade Bruta** de forma **auditável**, **ética** e **determinística**, sem depender de backend/toolbelt nesta fase.

## Objetivo
Entregar dois SLOTS de Verdade Bruta com:
- contratos determinísticos (JSON Schema),
- renderização placeholder (tokens-only),
- estados explícitos (incluindo **insufficient_data**),
- validação runtime ativa,
- **zero CTA de conversão**.

## Escopo (IN)

### 1) Suitability Alpha — TrustwareSlot
Slot canônico de **integridade cognitiva**.

**Estados obrigatórios:**
- `blocked`
- `warn`
- `pass`
- `insufficient_data`

Regras:
- Sem cálculo real.
- Sem inferência.
- Mensagens neutras, auditáveis, sem coerção.
- “Dados insuficientes” é estado válido e ético (não é erro).

### 2) TCO Mirror — TrustwareSlot
Slot canônico de **exposição do custo total de vida** do ativo.

Linhas obrigatórias (placeholders):
- Parcela
- Taxa administrativa
- ITBI
- Escritura
- Registro
- Seguro
- Custo pós-contemplação

Regras:
- Comparação explícita com “alternativa bancária” (placeholder).
- Aviso visível: **“valores estimados — cálculo não conectado”**.
- Nenhuma simulação otimista.
- Sem backend/toolbelt nesta fase.

## Fora de Escopo (OUT)
- Toolbelt
- Cálculo financeiro
- Backend
- Copy comercial
- Landing pages
- CTA de conversão (“contratar”, “seguir”, “avançar”, etc.)

## Artefatos (Vault-first)

### Documento (este arquivo)
- `docs/Vault/FRONTEND/WP8_TRUSTWARE_SLOTS_RODOBENS_WEALTH.md`

### Schemas (contratos)
- `apps/genesis-front/src/lib/templates/slots/suitability-alpha.schema.json`
- `apps/genesis-front/src/lib/templates/slots/tco-mirror.schema.json`

### Slots (renderização placeholder)
- `apps/genesis-front/components/templates/slots/SuitabilityAlphaSlot.tsx`
- `apps/genesis-front/components/templates/slots/TCOMirrorSlot.tsx`

## Critérios de Aceite (DUROS)
- Slots renderizam **sem backend**.
- Validação runtime ativa (e falha de schema é tratada como estado “error” (visual, sem crash).
- Estados claros e visíveis, incluindo `insufficient_data`.
- Nenhuma promessa implícita.
- **Nenhum CTA de venda**.
- Tokens-only (sem hardcode visual).
- Registro completo no Vault.
- **Commit único** para o WP8.

## Evidências mínimas no fechamento
- Lista de arquivos alterados.
- Prints ou descrição do comportamento por estado (pass/warn/blocked/insufficient_data).
- Confirmação de validação runtime (schema OK vs schema FAIL).

---

## Fechamento (Evidências)

**Commit (WP8 único):** 96c05f1

**Arquivos entregues:**
- apps/genesis-front/components/templates/slots/SuitabilityAlphaSlot.tsx
- apps/genesis-front/components/templates/slots/TCOMirrorSlot.tsx
- apps/genesis-front/src/lib/templates/slots/suitability-alpha.schema.json
- apps/genesis-front/src/lib/templates/slots/tco-mirror.schema.json
- docs/Vault/FRONTEND/WP8_TRUSTWARE_SLOTS_RODOBENS_WEALTH.md

**Gates (PASS):**
- npm -w @aurora/genesis-front run lint (PASS)
- npm -w @aurora/genesis-front run typecheck (PASS)
- npm -w @aurora/genesis-front run build (PASS)

**Notas de governança:**
- PLAN.md não foi incluído (regra: PLAN.md nunca entra em commit).
- Nenhuma integração em templates/builder foi realizada neste WP (escopo preservado).
- Schemas exigiram `git add -f` devido a `.gitignore:25:*.json` (contratos são deliberadamente versionados como SSOT do builder).
