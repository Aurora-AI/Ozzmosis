# Genesis Contracts v1.0

## Intent (UI -> backend)
```json
{
  "contract_version": "1.0",
  "product_type": "consortium",
  "parameters": {
    "value": 100000,
    "term": 60,
    "rate": 0.02
  },
  "user_session_id": "sess_123456"
}
```

## Artifact (backend -> UI)
```json
{
  "contract_version": "1.0",
  "decision_id": "dec_12345678",
  "verdict": {
    "approved": true,
    "score": 0.92
  },
  "steps": [
    {
      "tool_used": "calculator",
      "input_data": {"expression": "2+2"},
      "output_data": {"value": 4},
      "reasoning": "Deterministic calculation"
    }
  ],
  "integrity_hash": "sha256:0123456789abcdef",
  "pdf_ref": null
}
```
