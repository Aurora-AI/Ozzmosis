---
date_utc: 2026-01-06T16:06:00Z
host: windows
context: local-gates
---

# Windows EPERM note

- Command: `scripts/agents/run-gates.ps1` (runs `npm ci`)
- Error: `EPERM: operation not permitted, unlink 'C:\Aurora\Ozzmosis\node_modules\@tailwindcss\oxide-win32-x64-msvc\tailwindcss-oxide.win32-x64-msvc.node'`
- Decision: use CI Linux as source of truth for gates in this OS.
