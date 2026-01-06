# Contract — Aurora Conductor Service

## Purpose
Aurora Conductor Service exposes a minimal HTTP API to compose a request into a deterministic artifact, and to retrieve artifacts by id. It requires bearer authentication.

## Public Interface
Base URL: `http://<host>:<port>`

### Health
- `GET /health`
  - Auth: none
  - Response: `{ "ok": true, "service": "aurora-conductor-service", "status": "healthy" }`

### Compose
- `POST /compose`
  - Auth: Bearer token
  - Content-Type: `application/json`
  - Request schema: `ComposeRequestSchema` (see `src/types.ts`)
  - Responses:
    - `200`: `{ "ok": true, "artifactId": "<id>", "artifactPath": "<path>" }`
    - `400`: `{ "ok": false, "code": "invalid_request", "message": "...", "details": <zod-format> }`
    - `403`: `{ "ok": false, "code": "auth_invalid", "message": "Invalid or missing bearer token" }`
    - `422`: `{ "ok": false, "code": "<compose_code>", "message": "<compose_message>", "artifactId": "<id>", "artifactPath": "<path>" }`
    - `503`: `{ "ok": false, "code": "internal_error", "message": "Internal error" }`

### Artifact Retrieval
- `GET /artifacts/:id`
  - Auth: Bearer token
  - Responses:
    - `200`: JSON artifact payload
    - `403`: `{ "ok": false, "code": "auth_invalid", "message": "Invalid or missing bearer token" }`
    - `404`: `{ "ok": false, "code": "not_found", "message": "Artifact not found" }`
    - `503`: `{ "ok": false, "code": "internal_error", "message": "Internal error" }`

## Configuration
- `CONDUCTOR_PORT` (default: `4101`): HTTP port to bind.
- `CONDUCTOR_TOKEN` (default: `local-dev-conductor-token`): bearer token for auth.
- `CONDUCTOR_ARTIFACT_DIR` (default: `./data/artifacts`): artifact storage directory.
- `NODE_ENV` (optional): runtime environment.

## Failure Modes (Fail-Closed)
- Missing/invalid bearer token:
  - Return `403` with `code: auth_invalid`.
- Invalid JSON payload:
  - Return `400` with `code: invalid_request`.
- Compose failure:
  - Return `422` with `code: compose_failed` or provided `result.code`.
- Unexpected error:
  - Return `503` with `code: internal_error`.

## Versioning
- Version source: `apps/aurora-conductor-service/package.json`.
- Backward compatibility: additive changes to response fields only.
