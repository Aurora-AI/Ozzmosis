Param(
  [Parameter(Mandatory=$false)]
  [string]$Title = "Tarefa"
)

$ErrorActionPreference = "Stop"

$planPath = Join-Path (Get-Location) "PLAN.md"
if (Test-Path $planPath) {
  Write-Host "PLAN.md já existe. Não vou sobrescrever."
  exit 1
}

$today = Get-Date -Format "yyyy-MM-dd"

@"
# PLAN — $Title
Data: $today
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
"@ | Set-Content -Path $planPath -Encoding UTF8

Write-Host "Criado: PLAN.md"

