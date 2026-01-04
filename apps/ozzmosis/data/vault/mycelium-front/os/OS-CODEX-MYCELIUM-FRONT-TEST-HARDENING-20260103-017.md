# OS-CODEX-MYCELIUM-FRONT-TEST-HARDENING-20260103-017

## Objetivo
Restabelecer saúde dos testes do `apps/mycelium-front`:
- eliminar `Invalid hook call` (React/DOM em versões mistas)
- garantir que testes não dependam de segredos reais (`BLOB_READ_WRITE_TOKEN`)

## Correções
1) Normalização React/ReactDOM (uma versão)
- `apps/mycelium-front/package.json` atualizado para `react@19.2.3` e `react-dom@19.2.3`
- `package.json` (root) fixa `overrides.react` e `overrides.react-dom` em `19.2.3`
- `package-lock.json` atualizado

2) Blob hardening (token + mocks)
- Adapter: `apps/mycelium-front/lib/blob.ts`
- Publisher usa token resolvido em runtime e fallback determinístico em `NODE_ENV=test`:
  - `apps/mycelium-front/lib/publisher.ts`
- Rotas/testes ajustados para serem determinísticos em CI/runner:
  - `apps/mycelium-front/app/api/publish-csv/route.ts`
  - `apps/mycelium-front/__tests__/api-routes.test.ts`
  - `apps/mycelium-front/__tests__/publisher.test.ts`
  - `apps/mycelium-front/tests/helpers/blobMock.ts`
  - `apps/mycelium-front/tests/integration/api.metrics.integration.test.ts`

## Evidências (local)
- `npm -w apps/mycelium-front ls react react-dom` → apenas `19.2.3`
- `npm -w apps/mycelium-front test` → PASS
- `scripts/agents/run-gates.ps1` → PASS

## Status
CONCLUÍDA

