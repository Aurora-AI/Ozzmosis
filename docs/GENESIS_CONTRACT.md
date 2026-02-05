# Genesis Contract (v1.1)

## Canonical Endpoints

- `POST /genesis/decide` (JSON; product response UI-ready)
- `GET /genesis/artifacts/{request_sha256}/decision.json`
- `GET /genesis/artifacts/{request_sha256}/decision.pdf`

Legacy (kept for compatibility; thin-client should not depend on this):

- `POST /genesis/decide.pdf` (PDF bytes + headers)

## Principles (Thin Client)

- Frontend renders `ui.*` only.
- Frontend does not interpret policy; policy fields are debug/ops only.
- v1.0 fields remain at top-level for compatibility.

## Request (v1.1)

Minimum (backwards-compatible):

```json
{
  "force_block": false
}
```

Forward-compatible fields are allowed (example):

```json
{
  "force_block": false,
  "channel": "web",
  "intent": {
    "product": "consorcio",
    "context": {
      "cidade": "Curitiba",
      "valor": 100000,
      "prazo": 60
    }
  }
}
```

## Response (v1.1)

Rule: FE consumes `ui.*`.

```json
{
  "contract_version": "1.1",
  "endpoint": "/genesis/decide",
  "request_sha256": "<sha256 hex>",
  "decision_id": "<sha256 hex>",
  "correlation_id": "genesis:<sha256 hex>",

  "verdict": "ALLOW | BLOCK",
  "reasons": ["<reason_code>"],
  "policy_version": "0",
  "policy_mode": "error | warn",
  "policy_rule_ids_triggered": ["<rule_id>"],

  "policy": {
    "verdict": "ALLOW | BLOCK",
    "reasons": ["<reason_code>"],
    "version": "0",
    "mode": "error | warn",
    "rules_triggered": ["<rule_id>"]
  },

  "artifacts": {
    "decision_json": "/genesis/artifacts/<sha>/decision.json",
    "decision_pdf": "/genesis/artifacts/<sha>/decision.pdf"
  },

  "ui": {
    "status": "allowed | blocked | needs_more_info | handoff_required",
    "user_message": "<safe text for display>",
    "steps": [
      {
        "id": "policy_check",
        "title": "Validacao de politica",
        "status": "done | pending | error",
        "summary": "<short safe summary>"
      }
    ],
    "next_actions": [
      { "id": "retry", "label": "Tentar novamente", "type": "retry" },
      { "id": "handoff_human", "label": "Falar com um especialista", "type": "handoff", "channel": "whatsapp" },
      { "id": "collect_params", "label": "Continuar", "type": "collect_input", "fields": ["produto", "valor", "prazo", "perfil"] },
      { "id": "open_decision_pdf", "label": "Baixar decisao (PDF)", "type": "open_artifact", "url": "/genesis/artifacts/<sha>/decision.pdf" }
    ],
    "artifacts": {
      "decision_json": "/genesis/artifacts/<sha>/decision.json",
      "decision_pdf": "/genesis/artifacts/<sha>/decision.pdf"
    }
  }
}
```

