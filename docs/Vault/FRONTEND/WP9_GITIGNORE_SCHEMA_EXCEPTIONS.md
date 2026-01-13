---
id: WP9_GITIGNORE_SCHEMA_EXCEPTIONS
project: Aurora / Ozzmosis
product: Genesis Front (infra)
date: 2026-01-13
status: ACTIVE
scope: frontend-governance
governance:
  ssot: Vault
  rule_wp_commit: "1 WP = 1 commit"
---

# WP9 — Gitignore Exception para Schemas (Contratos)

## Contexto

No WP8, os contratos (JSON Schemas) precisaram de `git add -f` porque o repo possui uma regra global em `.gitignore` que ignora `*.json`. Isso é incompatível com a prática de Trustware aplicada a contratos: schemas são **SSOT técnico**, logo devem ser versionados sem "força manual".

Evidência observada:

- `.gitignore:25:*.json` ignora arquivos `.schema.json` dentro de `apps/genesis-front/src/lib/templates/slots/`.

## Objetivo

Garantir que todo arquivo `*.schema.json` possa ser versionado normalmente (sem `-f`), preservando o ignore de outros `*.json` caso isso seja desejado no repo.

## Escopo (IN)

- Ajustar `.gitignore` para **designorar** `**/*.schema.json`.
- Registrar a decisão no Vault.

## Fora de Escopo (OUT)

- Alterações em slots, templates, builder adapter.
- Alterações em contratos existentes.
- Ajustes de regras para qualquer outro JSON além de `*.schema.json`.

## Critérios de Aceite (DUROS)

- `git status` passa a mostrar `*.schema.json` como tracked/untracked normalmente (sem `-f`).
- Nenhum outro arquivo além de `.gitignore` e este documento entra no commit.
- Commit único do WP9.

## Evidências mínimas no fechamento

- `git show --name-only --oneline --no-patch <commit>`
- Confirmação de que um schema novo aparece em `git status` sem `-f` (descrição ou comando).

---

## Fechamento (Evidências)

**Commit (WP9 único):** 57a5ffaab1b3439a8c35f5cf3c4ad9b1e6936d71

**Arquivos entregues:**

- .gitignore
- docs/Vault/FRONTEND/WP9_GITIGNORE_SCHEMA_EXCEPTIONS.md

**Problema resolvido:**

- Schemas `*.schema.json` deixam de ser ignorados por `.gitignore` (regra global `*.json`) e podem ser versionados sem `git add -f`.

**Notas de governança:**

- Escopo mínimo preservado (nenhum template/slot/builder alterado).
- WP único, commit único, SSOT registrado no Vault.
