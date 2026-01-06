# PLAN — OS-CONTRACT-PUBLIC-001-CODEX
Data: 2026-01-06
Autor: agent

## Objetivo
Adicionar gate deterministico de contratos (entrypoints) e artefatos de auditoria
para libs TS/Python, sem inventar exports.

## Escopo
Inclui:
- Inventario de libs em `apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-001/inventory.json`.
- Script `scripts/audit/entrypoints_check.py`.
- Overlay `scripts/product_maturity/contract_overlay.py`.
- Workflow CI `ci-entrypoints-contract.yml`.
- Artefatos no Vault `_runs/`.

Nao inclui:
- Refactors amplos em libs.
- Alteracoes em libs fora de entrypoints (se necessario).

## Riscos
- R1: Export inventado. Mitigacao: reexportar apenas o que existe.
- R2: Script nao roda em CI. Mitigacao: usar Python 3.11 padrao.

## Passos (executar 1 por vez)
1) Inventario + script de entrypoints
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-001/inventory.json`
     - `scripts/audit/entrypoints_check.py`
   - Criterios de aceite:
     - Inventario inclui todas as libs em `libs/`.
     - Script gera reason-codes deterministicos.
     - Gates passam.

2) Overlay + workflow + artefatos de auditoria
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `scripts/product_maturity/contract_overlay.py`
     - `.github/workflows/ci-entrypoints-contract.yml`
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-001/entrypoints_check.json`
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-001/contract_overlay.json`
   - Criterios de aceite:
     - CI executa entrypoints_check.
     - Overlay gera updates deterministas.
     - Artefatos presentes no Vault.
     - Gates passam.

3) Ajustar entrypoints se houver falhas
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `libs/**/src/index.ts` ou `libs/**/src/<pkg>/__init__.py`
   - Criterios de aceite:
     - Nenhuma lib com falha de entrypoint.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`

---

# PLAN — OS-REMEDIATION-FULL-002-CODEX
Data: 2026-01-06
Autor: agent

## Objetivo
Atender os pontos de auditoria (survival, chronos core, shield consumidor,
taxonomia e evidencias de deploy) com evidencias objetivas.

## Escopo
Inclui:
- Survival tests e workflows para chronos, crm-core, alvaro-core e shield.
- Core minimo Chronos com testes.
- Consumo real do Shield em um fluxo.
- Script de auditoria survival com reason-codes.
- Docs minimos de taxonomia e evidencia de operacao.

Nao inclui:
- OCR real ou expansao de features nao pedidas.

## Riscos
- R1: Dependencias novas para testes. Mitigacao: usar stack existente.
- R2: Falhas de CI por workflow. Mitigacao: CI isolado por job.

## Passos (executar 1 por vez)
1) Survival detection + workflows base
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `scripts/audit/survival_check.py`
     - `.github/workflows/ci-survival-chronos.yml`
     - `.github/workflows/ci-survival-crm-core.yml`
     - `.github/workflows/ci-survival-alvaro-core.yml`
     - `.github/workflows/ci-smoke-shield.yml`
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/remediation-full-002/survival_check.json`
   - Criterios de aceite:
     - Script gera `survival_check.json` com reason-codes.
     - Workflows executam survival/smoke.
     - Gates passam.

2) Chronos core minimo + testes survival
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `libs/aurora-chronos/src/**`
     - `libs/aurora-chronos/tests/**`
     - `libs/aurora-chronos/package.json`
   - Criterios de aceite:
     - Append, range e index deterministico implementados.
     - Testes unitarios e survival passam.
     - Gates passam.

3) Shield consumidor real + smoke
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/butantan-shield/**` ou `apps/alvaro-core/**` ou `apps/crm-core/**`
   - Criterios de aceite:
     - Integracao real do shield com teste/smoke.
     - Gates passam.

4) Taxonomia e evidencias de deploy
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `docs/**`
   - Criterios de aceite:
     - Docs de taxonomia e evidencia presentes.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`
