# OS CLOSE — OS-CODEX-OZZMOSIS-SDK-AUDIT-AND-INTEGRATION-20260205-001

Date: 2026-02-05
Owner: Comandante (human)
Executor: Codex
Status: CLOSED (CI green per human confirmation)

## Canonical Decision (Architecture)

- Option A (canonical): Genesis serves its own artifacts (no Conductor coupling).

Rationale:
- Artifacts already exist on filesystem under `artifacts/genesis/<request_sha256>/`.
- Fastest path to thin-client: decide -> render `ui.*` -> open artifact URL.

## Deliverables (SSOT)

- D1 SDK Map (inventory): `docs/ozzmosis/sdk-map.md`
- D2 Canonical contract v1.1: `docs/GENESIS_CONTRACT.md`
- D3 Frontend integration runbook: `docs/GENESIS_DEV_RUNBOOK.md`
- D4 Thin-client client + UI harness (Mycelium):
  - `apps/mycelium-front/src/lib/genesis/contracts.ts`
  - `apps/mycelium-front/src/lib/genesis/client.ts`
  - `apps/mycelium-front/src/app/page.tsx`
- D5 Smoke evidence: `docs/GENESIS_E2E_SMOKE.md`

## Acceptance Criteria Checklist

- [x] Single canonical contract for `POST /genesis/decide` (v1.1) with `ui.*` + `policy.*` and v1.0 fields preserved.
- [x] Artifacts accessible by URL (Genesis host):
  - `GET /genesis/artifacts/{sha}/decision.json`
  - `GET /genesis/artifacts/{sha}/decision.pdf`
- [x] Frontend thin-client renders `ui.*` (no policy logic).
- [x] No divergence between `apps/alvaro-core/src/alvaro/app.py` and `apps/alvaro-core/src/alvaro/genesis/api.py`.
- [x] Docs match code and include v1.1 examples + artifact URLs.

## Implementation Notes (Files)

Backend:
- `apps/alvaro-core/src/alvaro/app.py`
- `apps/alvaro-core/src/alvaro/genesis/engine.py`
- `apps/alvaro-core/src/alvaro/genesis/api.py`

Frontend:
- `apps/mycelium-front/src/lib/genesis/contracts.ts`
- `apps/mycelium-front/src/lib/genesis/client.ts`
- `apps/mycelium-front/src/app/page.tsx`

Docs:
- `docs/GENESIS_CONTRACT.md`
- `docs/GENESIS_DEV_RUNBOOK.md`
- `docs/GENESIS_E2E_SMOKE.md`
- `docs/ozzmosis/sdk-map.md`

## Evidence (Commits / Branch)

Branch: `feat/wp5-slot-template-engine-20260112-005`

Implementation commits (may be squashed on merge depending on PR strategy):
- `3f5eab4` feat(genesis): serve decision artifacts by url
- `27b841d` feat(genesis): return UI-ready decide contract v1.1
- `0427e4d` feat(mycelium-front): consume genesis decide v1.1 ui
- `29a5290` docs(genesis): update runbooks for decide v1.1 + artifact urls
- `dbbf815` docs(ozzmosis): refresh sdk map for genesis v1.1

## Operational Notes

- Windows npm can intermittently fail with `ENOTEMPTY` during `npm ci` due to file locks.
  Mitigation: retry `npm ci` or run gates via `scripts/agents/run-gates-linux.ps1`.

