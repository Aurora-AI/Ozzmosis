# OS-GENESIS-ENGINE-001 — CLOSE

## Objective
Materialize the Genesis Decide Engine with deterministic behavior, exposing the canonical API endpoint and integrating the frontend without mocks, using JSON as the primary artifact and a minimal PDF stub as secondary output.

## Scope Delivered
- Deterministic decide engine (JSON primary) with canonical JSON persistence, SHA256 request identity, and stable artifact paths.
- PDF stub generation (dependency-free) derived deterministically from request hash.
- Public API endpoints:
  - POST /genesis/decide (JSON)
  - POST /genesis/decide.pdf (PDF stub)
- Frontend integration (Mycelium) calling the real API client (no mocks) via a small panel on the root page.
- Determinism + artifact persistence covered by a minimal survival-style test.
- Repo contract check executed.

## Canonical Interface
- Endpoint: POST /genesis/decide
- Secondary: POST /genesis/decide.pdf
- Artifact path pattern: artifacts/genesis/<request_sha256>/decision.json + decision.pdf

## Determinism Guarantees
- Canonical JSON serialization: sorted keys, stable separators, UTF-8.
- Request identity: sha256(canonical_request_json).
- Artifact naming: derived from request hash (no timestamps).
- Same input => same request_sha256, verdict, and PDF bytes.

## Evidence (Commands)
- npm run repo:check => PASS ([repo-contract] OK)
- Branch pushed: chore/os-shield-green-001

## Commits
- WP1 — Engine + artifacts + PDF stub:
  - ae7014e9d…  (engine/artifacts/pdf stub core)
- WP2 — API exposure (/genesis/decide + /genesis/decide.pdf):
  - bbae0767…  (FastAPI router integration)
- WP3 — Frontend client + UI wiring (no mocks):
  - bc1f22080bbd95bfe33aca55d1135858e037af28
- WP4 — Deterministic survival test:
  - 57c2f736abf4d609157ddf09446ca992f1fd97e9

## Files (High-level)
Backend (apps/alvaro-core):
- src/alvaro/genesis/engine.py
- src/alvaro/genesis/artifacts.py
- src/alvaro/genesis/pdf_stub.py
- src/alvaro/genesis/api.py (and app router registration)
- tests/genesis/test_genesis_decide_determinism.py

Frontend (apps/mycelium-front):
- src/lib/genesis/client.ts
- src/app/page.tsx

## Notes / Deferred (Out of Scope)
- Trustware policy engine expansion (rule catalog, scoring, explainability) — next OS.
- Production-grade PDF rendering (“pretty PDF”) — later OS.
- Auth, rate-limiting, and observability — later hardening OS.
- Auditor modifications — explicitly excluded from this OS.
