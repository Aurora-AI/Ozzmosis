# Genesis Dev Runbook (Ozzmosis)

## Canonical Local Ports

- **alvaro-core (uvicorn):** http://127.0.0.1:8010
- **mycelium-front (next dev):** http://localhost:3000 (default)

## Backend: run alvaro-core

```bash
cd apps/alvaro-core
uvicorn alvaro.app:app --reload --port 8010
```

The backend exposes:
- `POST /genesis/decide` (JSON decision)
- `POST /genesis/decide.pdf` (PDF stub with headers)
- `GET /genesis/artifacts/{request_sha256}/decision.json` (canonical decision JSON artifact)
- `GET /genesis/artifacts/{request_sha256}/decision.pdf` (canonical decision PDF artifact)

## Frontend: run mycelium-front (same-origin, no CORS)

The frontend proxies `/genesis/*` to the backend via Next.js rewrites (`next.config.js`).

```powershell
cd apps/mycelium-front
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

The Genesis Decide panel appears on the root page. Click "Decidir" to test.

## How it Works (Dev Flow)

1. Frontend runs Next.js dev server on `localhost:3000`.
2. Browser requests `/genesis/decide` from the frontend origin.
3. Next.js rewrites (server-side) route to `http://127.0.0.1:8010/genesis/decide` (backend).
4. Backend responds with JSON decision.
5. Frontend displays `ui.*` (thin-client) + legacy fields for debug.

**No CORS issues**, no `NEXT_PUBLIC_*` required by default.

## Optional Overrides

### Override backend target for rewrites (server-side only)

Use this if your backend is not on `127.0.0.1:8010`.

**PowerShell:**

```powershell
$env:AURORA_ALVARO_CORE_INTERNAL_URL="http://127.0.0.1:8010"
npm run dev
```

**Bash/Linux:**

```bash
export AURORA_ALVARO_CORE_INTERNAL_URL="http://127.0.0.1:8010"
npm run dev
```

### Use a public base URL (client-side)

If you want the browser to call a remote backend directly (not recommended for local dev, but useful for staging):

**PowerShell:**

```powershell
$env:NEXT_PUBLIC_ALVARO_CORE_BASE_URL="https://your-backend.example.com"
npm run dev
```

**Bash/Linux:**

```bash
export NEXT_PUBLIC_ALVARO_CORE_BASE_URL="https://your-backend.example.com"
npm run dev
```

## Smoke Test

1. Start backend: `uvicorn alvaro.app:app --reload --port 8010`
2. Start frontend: `npm run dev` (from `apps/mycelium-front`)
3. Open [http://localhost:3000](http://localhost:3000)
4. Click "Decidir" on the Genesis panel

**Expected results:**

- **force_block=false:** verdict=ALLOW, `ui.status=allowed`, `ui.artifacts.decision_pdf` present
- **force_block=true:** verdict=BLOCK, reasons include "TW_FORCE_BLOCK_TRUE", `ui.status=blocked`
- **"Abrir PDF":** Opens PDF via `GET /genesis/artifacts/<sha>/decision.pdf`

## Troubleshooting

### "CORS blocked" error

This should **not happen** with the rewrites setup. If it does:

1. Check that backend is running on `127.0.0.1:8010`
2. Verify `next.config.js` has the `rewrites()` function
3. Restart Next.js dev server

### "Cannot fetch /genesis/decide"

1. Is the backend responding? Test: `curl http://127.0.0.1:8010/genesis/decide -X POST -d '{"force_block":false}'`
2. Is the frontend reachable? Open [http://localhost:3000](http://localhost:3000) in browser
3. Check browser console (F12) for network errors

### Backend on different port?

Set `AURORA_ALVARO_CORE_INTERNAL_URL` before `npm run dev`:

```powershell
$env:AURORA_ALVARO_CORE_INTERNAL_URL="http://127.0.0.1:YOUR_PORT"
npm run dev
```

## Architecture Notes

- **`next.config.js` rewrites:** Server-side proxy, eliminates CORS friction during local development
- **`client.ts` baseUrl():** Defaults to same-origin (`""`), respects `NEXT_PUBLIC_ALVARO_CORE_BASE_URL` if set
- **Policy enforcement:** Trustware v0 (`genesis.v0.yaml`) runs in backend; frontend displays reason codes
- **Contract v1.1:** Backend returns `ui.*` + `policy.*` while preserving v1.0 fields at top-level
- **Artifact persistence:** Decisions stored by `request_sha256` in `artifacts/genesis/<sha>/` and served by URL

## Related Documentation

- Genesis E2E Smoke: [docs/GENESIS_E2E_SMOKE.md](GENESIS_E2E_SMOKE.md)
- Genesis Contract: [docs/GENESIS_CONTRACT.md](GENESIS_CONTRACT.md)
- Trustware Policy: `apps/alvaro-core/src/alvaro/genesis/policies/genesis.v0.yaml`
- Frontend Panel: `apps/mycelium-front/src/app/page.tsx` (Genesis Decide section)
