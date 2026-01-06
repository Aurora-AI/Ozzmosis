# Butantan Shield — Public Contract

## Purpose
Butantan Shield is the **fail-closed security boundary** for the Ozzmosis ecosystem. It validates requests/tokens and returns deterministic allow/deny decisions with reason-codes.

## Public Interface

### Mode A — HTTP (service)
If running as a service, Shield MUST expose:

#### `GET /health`
- **200** when process is alive.
- No auth required.

#### `POST /v1/verify`
Validates a token/assertion and returns an authorization decision.

**Request**
```json
{
  "token": "string",
  "context": {
    "client_id": "string",
    "action": "string",
    "resource": "string"
  }
}
```

**Response (allow)**

```json
{
  "allowed": true,
  "reason_code": "ALLOW_OK",
  "policy_version": "v1"
}
```

**Response (deny)**

```json
{
  "allowed": false,
  "reason_code": "DENY_INVALID_TOKEN",
  "policy_version": "v1"
}
```

### Mode B — Local (internal)

If consumed locally, Shield MUST expose a deterministic `verify()` function with the same semantic result:

* `allowed: boolean`
* `reason_code: string`
* `policy_version: string`

## Configuration (env)

* `SHIELD_MODE`: `http|local` (default: `local`)
* `SHIELD_POLICY_PATH`: path to policy/rules file (optional; default: internal safe baseline)
* `SHIELD_TOKEN_SECRET`: secret used to validate tokens (required for real validation; tests may use a deterministic mock)
* `SHIELD_PORT`: HTTP port (default: `7070`)

## Failure Modes (Fail-Closed)

* If Shield cannot load policy/rules → **DENY_POLICY_LOAD_FAILED**
* If token missing/empty → **DENY_MISSING_TOKEN**
* If token invalid → **DENY_INVALID_TOKEN**
* If Shield runtime error/exception → **DENY_RUNTIME_ERROR**
* If HTTP mode and upstream caller cannot reach Shield → caller MUST treat as **DENY_SHIELD_UNAVAILABLE**

## Versioning

* Service version: `apps/butantan-shield/package.json`
* Policy version: `policy_version` field returned by verify.
