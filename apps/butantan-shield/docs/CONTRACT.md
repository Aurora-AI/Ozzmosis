# Contract — Butantan Shield

## Purpose
Butantan Shield provides a minimal HTTP gateway for protected proxy data used by internal tools. It enforces bearer authentication when configured.

## Public Interface
Base URL: `http://<host>:<port>`

### Health
- `GET /health`
  - Auth: none
  - Response: `{ "ok": true }`

### Proxy Tasks
- `GET /proxy/tasks`
  - Auth: Bearer token (required when `SHIELD_TOKEN` is set)
  - Response: JSON array of task records
  - Errors:
    - `403` with `{ "ok": false, "code": "auth_invalid", "message": "Invalid or missing bearer token" }`

### Proxy Projects
- `GET /proxy/projects`
  - Auth: Bearer token (required when `SHIELD_TOKEN` is set)
  - Response: JSON array of project records
  - Errors:
    - `403` with `{ "ok": false, "code": "auth_invalid", "message": "Invalid or missing bearer token" }`

## Configuration
- `SHIELD_PORT` (default: `4001`): HTTP port to bind.
- `SHIELD_TOKEN` (optional): if set, bearer auth is enforced on `/proxy/*`.

## Failure Modes (Fail-Closed)
- When `SHIELD_TOKEN` is configured and the request is missing/invalid:
  - Return `403` with `code: auth_invalid`.
- When `SHIELD_TOKEN` is not configured:
  - Requests are allowed (dev/local mode).

## Versioning
- Version source: `apps/butantan-shield/package.json`.
- Backward compatibility: additive changes to response fields only.
