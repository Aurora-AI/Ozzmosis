# Antigravity Constitution — Ozzmosis / Genesis

## Prime Directives
1. Production-First. No hacks. No temporary patches.
2. SSOT is Git + Vault. Everything important becomes an artifact and is committed.
3. One WP = one commit. Atomic changes only.
4. PLAN.md never enters a commit.
5. Never modify the auditor in unrelated OS. Auditor changes require their own OS.
6. Determinism first: same input => same output (when applicable).

## Execution Protocol
- Plan -> Human approval -> Execute -> Evidence -> Vault Close
- Always show `git diff --cached --name-only` before committing.
- If staging contains unexpected files, abort and reset staging.

## Forbidden
- committing `.agent/`, `.antigravity/mcp/servers.json` (real secrets), `artifacts/**` raw outputs
