# Genesis E2E Smoke Test Evidence

## Backend Smoke Results

### ALLOW Request (force_block=false)

**Endpoint:** `POST /genesis/decide`
**Request:** `{"force_block": false}`

**Response:**

```json
{
  "contract_version": "1.0",
  "endpoint": "/genesis/decide",
  "request_sha256": "cbf7ebcf47b44d5e9a03f717fccc004eefcaafd30423ae97f772f80779bbc2b4",
  "verdict": "ALLOW",
  "reasons": [],
  "policy_version": "0",
  "policy_mode": "error",
  "policy_rule_ids_triggered": []
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
  "contract_version": "1.0",
  "endpoint": "/genesis/decide",
  "request_sha256": "9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b",
  "verdict": "BLOCK",
  "reasons": ["TW_FORCE_BLOCK_TRUE"],
  "policy_version": "0",
  "policy_mode": "error",
  "policy_rule_ids_triggered": ["TW_FORCE_BLOCK_TRUE"]
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
```

**Evidence:**

- X-Genesis-Request-SHA256: 9a4b0ef3b3ca85c85894bb980203ab7811ceaaa24c144b2954204ede7c61483b ✓
- X-Genesis-Verdict: BLOCK ✓
- PDF bytes returned: 512 bytes ✓

## Summary

✓ Backend smoke complete
✓ Policy enforcement working (ALLOW/BLOCK deterministic)
✓ Artifacts persisted by request_sha256
✓ PDF endpoint operational with custom headers
✓ Trustware v0 policy integration verified

Status: READY FOR VAULT CLOSE
