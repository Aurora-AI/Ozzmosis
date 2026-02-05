# Ozzmosis SDK Map (Inventario Factual)
Data: 2026-02-05

Este documento e um inventario factual (read-only) do "surface area" atual do Ozzmosis
relevante para integracao Backend <-> Frontend, com paths reais no repo.

## 0) Contexto de execucao
- Repo: `C:\Aurora\Projetos Aurora\Ozzmosis`
- Branch: `feat/wp5-slot-template-engine-20260112-005`
- HEAD (na coleta): `bd36ab6`

## 1) Endpoints (inventario)

### 1.1) Genesis (alvaro-core) — entrypoint `alvaro.app:app`
Arquivo: `apps/alvaro-core/src/alvaro/app.py`
- `POST /genesis/decide`
- `POST /genesis/decide.pdf`
- `GET /readiness`

Observacao:
- Este entrypoint e o referenciado no runbook Genesis (`docs/GENESIS_DEV_RUNBOOK.md`).
- Nao expõe `GET /health` neste arquivo.

### 1.2) Genesis (alvaro-core) — router alternativo (APIRouter)
Arquivo: `apps/alvaro-core/src/alvaro/genesis/api.py`
- Router prefix: `/genesis`
- `POST /genesis/decide` (via `@router.post("/decide")`)
- `POST /genesis/decide.pdf` (via `@router.post("/decide.pdf")`)

Observacao:
- O handler JSON neste caminho injeta `artifacts` no retorno (`return {**decision, "artifacts": artifacts}`),
  enquanto `apps/alvaro-core/src/alvaro/app.py` atualmente nao injeta.

### 1.3) Trustware (alvaro-core) — API publica para front
Arquivos:
- `apps/alvaro-core/main.py` (inclui router com prefix `/api/v1/trustware`)
- `apps/alvaro-core/api/routes/trustware.py`

Endpoint:
- `POST /api/v1/trustware/validate`

Payload:
- Request: `{ "product_key": string, "user_intent": string }`
- Response: objeto retornado por `TrustwareEngine.validate_fit(...)` (ver `apps/alvaro-core/services/trustware/engine.py`)

### 1.4) CRM Core (FastAPI)
Arquivo: `apps/crm-core/src/main.py` (wiring) + routers em `apps/crm-core/src/api/v1/*`
- `GET /api/v1/health` (tambem montado em `/v1/health` dependendo do wiring)
- `GET /v1/rbac/_probe`
- `POST /v1/ingest/message`
- `GET /v1/contacts/by-channel/lookup`
- `GET /v1/contacts/{contact_id}`
- `GET /v1/deals/active/by-contact/{contact_id}`
- `GET /v1/deals/{deal_id}`
- `POST /v1/life-map/compare`
- `POST /v1/life-map`
- `POST /v1/proposals/generate`
- `GET /v1/proposals/by-deal/{deal_id}`
- `POST /v1/proposals/{deal_id}/accept`

### 1.5) Aurora Conductor Service (Elysia)
Arquivo: `apps/aurora-conductor-service/src/server.ts`
- `GET /health`
- `GET /readiness`
- `POST /compose`
- `GET /artifacts/:id`

### 1.6) Butantan Shield (Elysia)
Arquivo: `apps/butantan-shield/src/server.ts`
- `GET /health`
- `GET /readiness`
- `GET /proxy/tasks`
- `GET /proxy/projects`

## 2) Contratos reais (estado atual)

### 2.1) Genesis Decide — backend (v1.0)
Arquivo: `apps/alvaro-core/src/alvaro/genesis/engine.py`
- `contract_version: "1.0"`
- `endpoint: "/genesis/decide"`
- `request_sha256: <sha256 hex do request canonico>`
- `verdict: "ALLOW" | "BLOCK"`
- `reasons: string[]`
- `policy_version`, `policy_mode`, `policy_rule_ids_triggered`

Persistencia:
Arquivo: `apps/alvaro-core/src/alvaro/genesis/artifacts.py`
- Diretorio: `artifacts/genesis/<request_sha256>/`
- Arquivos: `decision.json`, `decision.pdf`
- Metadados retornados por `write_artifacts(...)`:
  - `decision_json_path`
  - `decision_pdf_path`

### 2.2) Evidencia E2E (v1.0)
Arquivo: `docs/GENESIS_E2E_SMOKE.md`
- Exemplo ALLOW: request `{ "force_block": false }`
- Exemplo BLOCK: request `{ "force_block": true }`
- Evidencia de headers no `POST /genesis/decide.pdf`:
  - `X-Genesis-Request-SHA256`
  - `X-Genesis-Verdict`

### 2.3) Conductor Service contract (JSON artifacts do Conductor)
Arquivo: `apps/aurora-conductor-service/docs/CONTRACT.md`
- `POST /compose` retorna `{ ok, artifactId, artifactPath }` (ou erro com `422`)
- `GET /artifacts/:id` retorna JSON do artifact do Conductor (protegido por Bearer)

## 3) SDK/Clients (consumo atual no frontend)

### 3.1) Mycelium Front — client Genesis (fetch)
Arquivo: `apps/mycelium-front/src/lib/genesis/client.ts`
- `genesisDecide(payload)` chama `POST /genesis/decide`
- `genesisDecidePdf(payload)` chama `POST /genesis/decide.pdf`
- Response tipada atual espera (entre outros):
  - `request_sha256`, `verdict`, `reasons`, `policy_rule_ids_triggered?`, `artifacts?`

### 3.2) Mycelium Front — contracts Genesis (types)
Arquivo: `apps/mycelium-front/src/lib/genesis/contracts.ts`
- Define `GENESIS_CONTRACT_VERSION = "1.0"`
- Tipos `GenesisIntent`, `DecisionStep`, `GenesisArtifact`

Observacao:
- Estes tipos nao correspondem ao payload real retornado hoje por `POST /genesis/decide` (backend v1.0),
  que retorna `verdict/reasons/policy_*` e nao retorna `steps`/`verdict` como objeto arbitrario.

## 4) Auth / seguranca (estado atual)
- Genesis (`/genesis/decide`): sem auth explicita em `apps/alvaro-core/src/alvaro/app.py`.
- Trustware validate: chama `enforce_shield()` (ver `apps/alvaro-core/services/shield/enforcer.py`) e pode retornar 503 em falha.
- Conductor Service: Bearer obrigatorio em `/compose` e `/artifacts/:id` (ver `apps/aurora-conductor-service/src/auth.ts` + `src/server.ts`).
- Shield: Bearer opcional dependendo de env (`SHIELD_TOKEN`) no proxy (ver `apps/butantan-shield/src/server.ts`).

## 5) Inconsistencias relevantes (factual)
- Runbook Genesis usa `uvicorn alvaro.app:app` (`docs/GENESIS_DEV_RUNBOOK.md`), mas scripts operacionais (`scripts/dev/start-genesis-stack.ps1`)
  fazem healthcheck em `/health` e `/api/v1/system/status`, que nao existem em `apps/alvaro-core/src/alvaro/app.py`.
- `apps/alvaro-core/main.py` expõe `GET /health` e inclui `genesis_router` (FastAPI), mas tambem importa `alvaro.ai.api`,
  e `apps/alvaro-core/src/alvaro/ai/api.py` nao existe no repo (import inconsistente).
- Existem dois caminhos de execucao para Genesis Decide (FastAPI app vs APIRouter), com diferenca observavel no JSON:
  `apps/alvaro-core/src/alvaro/app.py` nao injeta `artifacts`, enquanto `apps/alvaro-core/src/alvaro/genesis/api.py` injeta.

