# OS-GENESIS-INTEGRATION-001 — CLOSE

## Objective

Produce end-to-end smoke evidence for Genesis Decide (uvicorn port 8010) covering API JSON + PDF stub, Trustware policy enforcement, artifact persistence, and Mycelium frontend wiring.

## Runtime Configuration

- **Backend:** uvicorn alvaro.app:app --port 8010
- **Base URL:** http://127.0.0.1:8010
- **Frontend Base:** NEXT_PUBLIC_ALVARO_CORE_BASE_URL=http://127.0.0.1:8010

## Backend Smoke Evidence

### ALLOW Request (force_block=false)

- Endpoint: POST /genesis/decide
- Verdict: ALLOW ✓
- request_sha256: cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4 ✓
- reasons: [] (no policy triggers) ✓

### BLOCK Request (force_block=true)

- Endpoint: POST /genesis/decide
- Verdict: BLOCK ✓
- request_sha256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- reasons: ["TW_FORCE_BLOCK_TRUE"] ✓
- policy_rule_ids_triggered: ["TW_FORCE_BLOCK_TRUE"] ✓
- policy_mode: error (enforcement active) ✓

### Artifact Proof (ALLOW)

- Directory: artifacts/genesis/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/
- decision.json: exists ✓
- decision.pdf: exists ✓

### Artifact Proof (BLOCK)

- Directory: artifacts/genesis/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/
- decision.json: exists ✓
- decision.pdf: exists ✓

### PDF Endpoint Evidence

- Endpoint: POST /genesis/decide.pdf
- HTTP Status: 200 OK ✓
- Content-Type: application/pdf ✓
- Header X-Genesis-Request-SHA256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- Header X-Genesis-Verdict: BLOCK ✓
- PDF bytes returned: 512 bytes ✓

## Frontend Smoke Evidence

**Location:** apps/mycelium-front (root page Genesis Decide panel)
**Environment:** Next.js dev server, NEXT_PUBLIC_ALVARO_CORE_BASE_URL=http://127.0.0.1:8010

### ALLOW Test

- Form: force_block unchecked
- Action: Click "Decidir"
- Displayed: verdict=ALLOW, request_sha256=cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4 ✓

### BLOCK Test

- Form: force_block checked
- Action: Click "Decidir"
- Displayed: verdict=BLOCK, request_sha256=9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b, reasons=["TW_FORCE_BLOCK_TRUE"] ✓

### PDF Download Test

- Action: Click "Baixar PDF stub" with force_block=true
- Result: File downloaded as genesis-decision.pdf ✓
- No CORS errors ✓

## Architecture Notes

- Real API calls (no mocks) demonstrated
- Trustware v0 policy integration verified end-to-end
- Reason codes displayed in UI
- Determinism guaranteed: same input → same verdict + sha256
- Artifact persistence: decisions stored by request_sha256

## Commits

- WP1: 067d81cc2fa0b8c37c0043f65b69286733c9d9ad (backend + artifacts smoke evidence)
- WP2: (frontend smoke evidence — appended to docs/GENESIS_E2E_SMOKE.md)
- WP3: (this close document)

## Status

✓ Full E2E smoke completed
✓ Backend, policy, and frontend integration verified
✓ Artifact persistence confirmed
✓ Ready for next OS (Trustware expansion / hardening)
