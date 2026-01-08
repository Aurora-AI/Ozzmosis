# PLAN — OS-CONTRACT-PUBLIC-001-CODEX
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Adicionar gate determinístico de contratos (entrypoints) e artefatos de auditoria
para libs TS/Python, sem inventar exports.

## Escopo
Inclui:
- Inventário de libs em `apps/ozzmosis/data/vault/_runs/contract-public-001/inventory.json`.
- Script `scripts/audit/entrypoints_check.py`.
- Overlay `scripts/product_maturity/contract_overlay.py`.
- Workflow CI `ci-entrypoints-contract.yml`.
- Artefatos `entrypoints_check.json` e `contract_overlay.json`.

Não inclui:
- Refactors amplos em libs.
- Alterações em libs fora de entrypoints (se necessário).

## Riscos
- R1: Export inventado. Mitigação: reexportar apenas o que existe.
- R2: Script não roda em CI. Mitigação: usar Python 3.11 padrão.

## Passos (executar 1 por vez)
1) Inventário + script de entrypoints
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/_runs/contract-public-001/inventory.json`
     - `scripts/audit/entrypoints_check.py`
   - Critérios de aceite:
     - Inventário inclui todas as libs em `libs/`.
     - Script gera reason-codes determinísticos.
     - Gates passam.

2) Overlay + workflow + artefatos de auditoria
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `scripts/product_maturity/contract_overlay.py`
     - `.github/workflows/ci-entrypoints-contract.yml`
     - `artifacts/entrypoints_check.json`
     - `artifacts/contract_overlay.json`
   - Critérios de aceite:
     - CI executa entrypoints_check.
     - Overlay gera updates determinísticos.
     - Artefatos presentes.
     - Gates passam.

3) Ajustar entrypoints se houver falhas
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `libs/**/src/index.ts` ou `libs/**/src/<pkg>/__init__.py`
   - Critérios de aceite:
     - Nenhuma lib com falha de entrypoint.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`


---

# PLAN — OS-CONDUCTOR-GREEN-001
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Elevar o Aurora Conductor a contract/core/survival 🟢 com orquestração determinística.

## Escopo
Inclui:
- Contrato público (types + Conductor) e docs de contrato.
- Stubs determinísticos (Shield/Chronos/Brain).
- Survival test end-to-end.
- Evidências em `apps/ozzmosis/data/vault/rodobens-wealth/_runs/conductor-green-001/`.

Não inclui:
- Integrações reais com Shield/Chronos/Brain.
- Refactors fora dos arquivos listados.

## Passos (executar 1 por vez)
1) WP0: registrar OS no Vault
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens-wealth/os/OS-CONDUCTOR-GREEN-001.md`

2) WP1/WP2: contrato e core com stubs
   - Arquivos:
     - `libs/aurora-conductor/src/index.ts`
     - `libs/aurora-conductor/src/stubs/*.ts`
     - `libs/aurora-conductor/docs/CONTRACT.md`

3) WP3: survival test
   - Arquivos:
     - `libs/aurora-conductor/tests/survival/conductor.survival.test.ts`

4) Evidências
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/conductor-green-001/*.json`
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/conductor-green-001/git_snapshot.txt`
     - `apps/ozzmosis/data/vault/rodobens-wealth/_runs/conductor-green-001/windows_gates_policy.md`

## Gates
- CI Linux (sem gates locais por EPERM)

## Rollback
- `git revert <sha>`


---

# PLAN — OS-2026-GENESIS-STABILITY-024
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Remover estados críticos (🔴) para contrato/survival/core mínimo em
butantan-shield, aurora-conductor-service e elysian-brain, com evidência
versionada no Vault.

## Escopo
Inclui:
- Contratos (CONTRACT.md) para Shield e conductor-service.
- Entrypoint/exports reais quando aplicável (sem inventar símbolos).
- Survival do Shield + CI dedicado.
- Enforcement fail-closed no alvaro-core.
- Core mínimo do elysian-brain lendo `index.json` do Vault + teste.
- Evidências em `_runs/` no Vault.

Não inclui:
- OCR real ou expansão de features.

## Riscos
- R1: Contrato gerar export inventado. Mitigação: exportar apenas símbolos reais.
- R2: Survival do Shield flake em CI. Mitigação: smoke determinístico.

## Passos (executar 1 por vez)
1) Contratos (Shield + Conductor-Service) + entrypoints
2) Shield survival + enforcement fail-closed
3) Brain core mínimo + evidências Vault

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`


---

# PLAN — OS-REMEDIATION-FULL-002-CODEX
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Atender pontos de auditoria (survival, chronos core, shield consumidor,
taxonomia e evidências de deploy).

## Escopo
Inclui:
- Survival tests e workflows.
- Core mínimo Chronos.
- Consumo real do Shield.
- Script survival com reason-codes.
- Docs de taxonomia.

Não inclui:
- OCR real ou features não pedidas.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`


---

# PLAN — OS-CODEX-RODOBENS-WEALTH-Vault-Ingest-PDF2MD-Trustware-States-20260106-019
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Implantar Vault Rodobens Wealth com ingest PDF→MD determinística,
Trustware e estados Cinematic.

## Escopo
Inclui:
- Vault SSOT.
- Toolbelt PDF→MD.
- Templates Trustware.
- Estados Cinematic Commerce.
- Fechamento no Vault.

Não inclui:
- OCR real.
- Execução em fontes reais.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`


---

# PLAN — OS-CODEX-AGENTS-MANUAL-LAW-20260106-020
Data: 2026-01-06
Autor: Rodrigo

## Objetivo
Importar Manual de Construção Aurora v5.0, declarar Lei dos Agentes
e garantir wiring de contexto obrigatório.

## Escopo
Inclui:
- Manual v5.0.
- Lei dos Agentes.
- Manifest de contexto.
- Gate no run-gates.
- Fechamento no Vault.

Não inclui:
- Alterar conteúdo do manual.
- OCR.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`


---

# PLAN — OS-004-ACCEPTANCE-CRITERIA
Data: 2026-01-05
Autor: Rodrigo
