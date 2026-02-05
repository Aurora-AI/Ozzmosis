# Genesis E2E Smoke Test Evidence

## Backend Smoke Results

### ALLOW Request (force_block=false)

**Endpoint:** `POST /genesis/decide`
**Request:** `{"force_block": false}`

**Response:**

```json
{
  "contract_version": "1.1",
  "endpoint": "/genesis/decide",
  "request_sha256": "cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4",
  "decision_id": "cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4",
  "correlation_id": "genesis:cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4",
  "verdict": "ALLOW",
  "reasons": [],
  "policy_version": "0",
  "policy_mode": "error",
  "policy_rule_ids_triggered": [],
  "policy": {
    "verdict": "ALLOW",
    "reasons": [],
    "version": "0",
    "mode": "error",
    "rules_triggered": []
  },
  "artifacts": {
    "decision_json": "/genesis/artifacts/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/decision.json",
    "decision_pdf": "/genesis/artifacts/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/decision.pdf"
  },
  "ui": {
    "status": "allowed",
    "user_message": "Tudo certo. Posso montar a proxima etapa para voce.",
    "steps": [
      {
        "id": "policy_check",
        "title": "Validacao de politica",
        "status": "done",
        "summary": "Regras verificadas e avaliadas."
      }
    ],
    "next_actions": [
      {
        "id": "collect_params",
        "label": "Continuar",
        "type": "collect_input",
        "fields": ["produto", "valor", "prazo", "perfil"]
      },
      {
        "id": "open_decision_pdf",
        "label": "Baixar decisao (PDF)",
        "type": "open_artifact",
        "url": "/genesis/artifacts/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/decision.pdf"
      }
    ],
    "artifacts": {
      "decision_json": "/genesis/artifacts/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/decision.json",
      "decision_pdf": "/genesis/artifacts/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/decision.pdf"
    }
  }
}
```

**Evidence:**

- verdict: ALLOW ✓
- request_sha256: cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4 ✓
- Policy evaluated without triggers ✓

### BLOCK Request (force_block=true)

**Endpoint:** `POST /genesis/decide`
**Request:** `{"force_block": true}`

**Response:**

```json
{
  "contract_version": "1.1",
  "endpoint": "/genesis/decide",
  "request_sha256": "9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b",
  "decision_id": "9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b",
  "correlation_id": "genesis:9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b",
  "verdict": "BLOCK",
  "reasons": ["TW_FORCE_BLOCK_TRUE"],
  "policy_version": "0",
  "policy_mode": "error",
  "policy_rule_ids_triggered": ["TW_FORCE_BLOCK_TRUE"],
  "policy": {
    "verdict": "BLOCK",
    "reasons": ["TW_FORCE_BLOCK_TRUE"],
    "version": "0",
    "mode": "error",
    "rules_triggered": ["TW_FORCE_BLOCK_TRUE"]
  },
  "artifacts": {
    "decision_json": "/genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.json",
    "decision_pdf": "/genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.pdf"
  },
  "ui": {
    "status": "blocked",
    "user_message": "Nao conseguimos avancar com a simulacao neste momento. Vamos ajustar alguns dados e tentar novamente.",
    "steps": [
      {
        "id": "policy_check",
        "title": "Validacao de politica",
        "status": "done",
        "summary": "Regras verificadas e avaliadas."
      }
    ],
    "next_actions": [
      {
        "id": "retry",
        "label": "Tentar novamente",
        "type": "retry"
      },
      {
        "id": "handoff_human",
        "label": "Falar com um especialista",
        "type": "handoff",
        "channel": "whatsapp"
      }
    ],
    "artifacts": {
      "decision_json": "/genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.json",
      "decision_pdf": "/genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.pdf"
    }
  }
}
```

**Evidence:**

- verdict: BLOCK ✓
- request_sha256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- reasons include: TW_FORCE_BLOCK_TRUE ✓
- policy_rule_ids_triggered: ["TW_FORCE_BLOCK_TRUE"] ✓
- policy_mode: error (enforcement active) ✓

### Artifact Persistence (ALLOW)

- Directory: `artifacts/genesis/cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4/`
- decision.json: exists ✓
- decision.pdf: exists ✓

### Artifact Persistence (BLOCK)

- Directory: `artifacts/genesis/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/`
- decision.json: exists ✓
- decision.pdf: exists ✓

### PDF Endpoint Evidence

**Endpoint:** `POST /genesis/decide.pdf`
**Request:** `{"force_block": true}`

**Response Headers (captured):**

```
HTTP/1.1 200 OK
date: Sun, 11 Jan 2026 13:54:15 GMT
server: uvicorn
content-length: 512
content-type: application/pdf
x-genesis-request-sha256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b
x-genesis-verdict: BLOCK
x-genesis-decision-json-url: /genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.json
x-genesis-decision-pdf-url: /genesis/artifacts/9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b/decision.pdf
```

**Evidence:**

- X-Genesis-Request-SHA256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- X-Genesis-Verdict: BLOCK ✓
- X-Genesis-Decision-PDF-URL: /genesis/artifacts/.../decision.pdf ✓
- PDF bytes returned: 512 bytes ✓

## Frontend Smoke Results

**Location:** `apps/mycelium-front` (root page, Genesis Decide panel)
**Base URL:** `http://127.0.0.1:8010` (NEXT_PUBLIC_ALVARO_CORE_BASE_URL)
**Environment:** Next.js dev server running locally

### ALLOW Test (Frontend)

**Action:** Panel form, `force_block` unchecked, click "Decidir"

**Displayed Output:**

- verdict: ALLOW ✓
- request_sha256: cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4 ✓
- reasons: (empty list, no policy triggers) ✓

### BLOCK Test (Frontend)

**Action:** Panel form, `force_block` checked, click "Decidir"

**Displayed Output:**

- verdict: BLOCK ✓
- request_sha256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- reasons: ["TW_FORCE_BLOCK_TRUE"] ✓

### PDF Download Test (Frontend)

**Action:** Panel form, `force_block` checked, click "Abrir PDF"

**Result:** Browser opens `GET /genesis/artifacts/<sha>/decision.pdf` ✓

**Evidence:**

- No CORS errors (backend and frontend on localhost)
- Panel successfully integrated into root page
- Real API calls (no mocks) demonstrated
- Trustware reason codes displayed in UI
- Frontend renders `ui.*` (thin-client), not policy logic

## Summary

✓ Backend smoke complete
✓ Policy enforcement working (ALLOW/BLOCK deterministic)
✓ Artifacts persisted by request_sha256
✓ PDF endpoint operational with custom headers
✓ Trustware v0 policy integration verified
✓ Frontend integrated and calling real API
✓ Reason codes displayed in UI
✓ No CORS or connectivity issues

**Status:** READY FOR VAULT CLOSE
