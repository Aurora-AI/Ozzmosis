# PLAN — OS-CODEX-MYCELIUM-FRONT-TEST-HARDENING-20260103-017
Data: 2026-01-03
Status: implemented

## Objetivo
- Eliminar `Invalid hook call` nos testes (React/ReactDOM em versões mistas).
- Remover dependência prática de `BLOB_READ_WRITE_TOKEN` nos testes (mocks + fallback determinístico).

## Mudanças
- `apps/mycelium-front/package.json`
  - `react`/`react-dom` padronizados em `19.2.3`
- `package.json` (root)
  - `overrides.react` / `overrides.react-dom` = `19.2.3`
- `package-lock.json` atualizado pelo `npm install`
- Adapter Blob:
  - `apps/mycelium-front/lib/blob.ts`
  - refactors: `apps/mycelium-front/lib/publisher.ts`, `apps/mycelium-front/lib/server/*`, `apps/mycelium-front/lib/hero/loadHeroPayload.ts`
- Harden de rotas e testes:
  - `apps/mycelium-front/app/api/publish-csv/route.ts` (cookies opcional + file.text guard)
  - `apps/mycelium-front/__tests__/api-routes.test.ts` (Request stub determinístico)
  - `apps/mycelium-front/__tests__/publisher.test.ts` (token missing only fora de `NODE_ENV=test`)
  - `apps/mycelium-front/tests/helpers/blobMock.ts` (seleção por pathname)
  - `apps/mycelium-front/tests/integration/api.metrics.integration.test.ts` (usa filtro de pathname)

## Validação
- `npm -w apps/mycelium-front ls react react-dom` → uma única versão (`19.2.3`)
- `npm -w apps/mycelium-front test` → PASS
- `scripts/agents/run-gates.ps1` → PASS

