# Vault Close: OS-GENESIS-HARDENING-001

**Date Closed:** 2025-02-04
**Branch:** `chore/os-shield-green-001`
**Status:** ✅ CLOSED

---

## Objective

Harden Genesis Decide Engine dev UX by eliminating CORS friction via Next.js rewrites proxy and refactoring the client to default to same-origin backend calls.

## Scope

- **WP1:** Add Next.js rewrites() in `next.config.js` to proxy `/genesis/*` → backend (8010)
- **WP2:** Refactor Genesis client (`client.ts`) with TypeScript types and same-origin defaults
- **WP3:** Create developer runbook documenting canonical setup (uvicorn + next dev)
- **WP4:** Vault close (this document)

---

## Work Package Results

### WP1: Next.js Rewrites Proxy

**File Modified:** `apps/mycelium-front/next.config.js`

**Changes:**

- Added async `rewrites()` method to redirect `/genesis/:path*` server-side
- Backend target: `http://127.0.0.1:8010` (hardcoded fallback)
- Optional override: `AURORA_ALVARO_CORE_INTERNAL_URL` env var

**Commit:** `9e759a5eb9751439aa3037d44817c21423d8b5b2`

**Code Reference:**

```javascript
async rewrites() {
  const target = process.env.AURORA_ALVARO_CORE_INTERNAL_URL || "http://127.0.0.1:8010";
  return [{
    source: "/genesis/:path*",
    destination: `${target}/genesis/:path*`,
  }];
}
```

**Impact:** Eliminates CORS errors in development; frontend can call backend without explicit base URL.

---

### WP2: Genesis Client Refactor (Same-Origin Default)

**File Modified:** `apps/mycelium-front/src/lib/genesis/client.ts`

**Changes:**

- Added TypeScript types: `GenesisDecideRequest`, `GenesisDecideResponse`
- Implemented `baseUrl()` function: defaults to `""` (same-origin via rewrites), respects `NEXT_PUBLIC_ALVARO_CORE_BASE_URL`
- Refactored endpoints: `genesisDecide()` (POST /genesis/decide), `genesisDecidePdf()` (POST /genesis/decide.pdf)
- Exported types for frontend component usage

**Commit:** `8f38ec564628d11d70647669a7b88f9dec1807b3`

**Code Reference:**

```typescript
function baseUrl(): string {
  return process.env.NEXT_PUBLIC_ALVARO_CORE_BASE_URL || "";
}

type GenesisDecideRequest = { force_block?: boolean };

interface GenesisDecideResponse {
  verdict: "ALLOW" | "BLOCK";
  request_sha256: string;
  reasons: Array<{ code: string; message: string }>;
  policy_name: string;
  policy_version: string;
  policy_evaluated_at: string;
}

async function genesisDecide(
  payload: GenesisDecideRequest
): Promise<GenesisDecideResponse> {
  const res = await fetch(`${baseUrl()}/genesis/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

**Impact:** Cleaner API surface, type safety for frontend developers, easier to override backend target in staging/prod.

---

### WP3: Genesis Dev Runbook

**File Created:** `docs/GENESIS_DEV_RUNBOOK.md`

**Contents:**

- Canonical port reference (uvicorn 8010, next dev 3000)
- Backend startup: `uvicorn alvaro.app:app --reload --port 8010`
- Frontend startup: `npm install && npm run dev`
- Optional overrides (server-side + client-side base URLs)
- Smoke test steps + expected results (force_block=false → ALLOW, force_block=true → BLOCK + reason)
- Troubleshooting guide (CORS, fetch errors, port mismatches)
- Architecture notes (rewrites elimination, policy enforcement, artifact persistence)

**Commit:** `9ba7a8a`

**Impact:** Reduces onboarding time for developers; single source of truth for local dev setup.

---

## Verification

### Integration Test Results

✅ **Backend + Frontend integration verified:**

- `/genesis/decide` returns JSON (verdict, request_sha256, reasons)
- `/genesis/decide.pdf` returns PDF with custom headers
- Same-origin rewrites proxy confirmed working (no CORS errors)
- TypeScript types provide IDE autocomplete for frontend developers

✅ **Smoke test scenarios:**

- force_block=false → verdict=ALLOW
- force_block=true → verdict=BLOCK, includes TW_FORCE_BLOCK_TRUE reason code

✅ **Branch + remote status:**

- All commits pushed to `chore/os-shield-green-001`
- Linear history: WP1 (9e759a5) → WP2 (8f38ec5) → WP3 (9ba7a8a)

---

## Dependencies Maintained

- **Python:** Trustware v0 policy loader (PyYAML) in engine.py
- **Node.js:** Next.js 13+ with rewrites support
- **Backend:** uvicorn + FastAPI for /genesis endpoints
- **Frontend:** React + TypeScript in mycelium-front

---

## Artifacts

| Artifact        | Location                                        | Purpose                               |
| --------------- | ----------------------------------------------- | ------------------------------------- |
| Config rewrites | `apps/mycelium-front/next.config.js`            | Server-side proxy setup               |
| Client types    | `apps/mycelium-front/src/lib/genesis/client.ts` | Type-safe API calls                   |
| Dev runbook     | `docs/GENESIS_DEV_RUNBOOK.md`                   | Local setup guide                     |
| Test evidence   | N/A (inline smoke test)                         | Manual verification on localhost:3000 |

---

## Risks & Mitigations

| Risk                                        | Impact                               | Mitigation                                    |
| ------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| Backend port conflict (8010 already in use) | Dev cannot start backend             | Runbook documents port override via env var   |
| Next rewrites proxy misconfigured           | Rewrites don't trigger, CORS returns | Verified async syntax; documented in runbook  |
| Client base URL not inferred correctly      | Frontend calls wrong backend         | Type exports + runbook make defaults explicit |

---

## Next Steps (Future OS)

- Consider adding automated smoke test to CI pipeline
- Explore Docker Compose for single-command dev startup (uvicorn + next)
- Add E2E tests with Playwright/Cypress for Genesis panel interactions

---

## Sign-Off

**OS Status:** CLOSED
**Branch:** `chore/os-shield-green-001`
**All WPs Completed:** ✅

**Summary of Commits:**

1. WP1: `9e759a5eb9751439aa3037d44817c21423d8b5b2` — next.config.js rewrites proxy
2. WP2: `8f38ec564628d11d70647669a7b88f9dec1807b3` — client.ts types + same-origin default
3. WP3: `9ba7a8a` — GENESIS_DEV_RUNBOOK.md documentation
4. WP4 (this): Vault close executed

**Ready for:** Merge to main branch after review & approval.
