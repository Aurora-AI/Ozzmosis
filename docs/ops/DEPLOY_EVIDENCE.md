# Deploy Evidence - Survival and Smoke

## Objetivo
Registrar evidencias de operacionalizacao via gates e health checks.

## Workflows (CI)
- `.github/workflows/ci-entrypoints-contract.yml` (contrato de entrypoints)
- `.github/workflows/ci-survival-chronos.yml`
- `.github/workflows/ci-survival-crm-core.yml`
- `.github/workflows/ci-survival-alvaro-core.yml`
- `.github/workflows/ci-smoke-shield.yml`

## Smoke/Health
- Shield: `apps/butantan-shield/src/server.ts` (`/health`, `scripts/smoke.mjs`)
- Alvaro Core: `apps/alvaro-core/main.py` (`/health`)

## Artefatos (PR)
- `artifacts/entrypoints_check.json`
- `artifacts/contract_overlay.json`
- `artifacts/survival_check.json`
