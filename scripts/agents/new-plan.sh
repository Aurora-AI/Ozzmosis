#!/usr/bin/env bash
set -euo pipefail

TITLE="${1:-Tarefa}"
PLAN="PLAN.md"

if [ -f "$PLAN" ]; then
  echo "PLAN.md já existe. Não vou sobrescrever."
  exit 1
fi

TODAY="$(date +%F)"

cat > "$PLAN" <<EOF
# PLAN — $TITLE
Data: $TODAY
Autor: humano/agent

## Objetivo
(1–3 linhas)

## Escopo
Inclui:
- ...

Não inclui:
- ...

## Riscos
- R1:
- R2:

## Passos (executar 1 por vez)
1) Passo 1
   - Comandos:
     - npm ci
     - npm run repo:check
   - Arquivos:
     - (listar)
   - Critérios de aceite:
     - Gates PASS

## Gates
- npm ci
- npm run repo:check

## Rollback
- git revert <sha>
- npm ci && npm run repo:check
EOF

echo "Criado: PLAN.md"

