# OS-PR24-UNBLOCK-TRUSTWARE-CHRONOS-002 — CLOSE

**Projeto:** Ozzmosis / Aurora  
**PR:** 24  
**Data/Hora (local):** 2026-01-09  
**Branch:** chore/os-shield-green-001  

## Mudanças aplicadas
1) Trustware — exportação dos schemas e types exigidos pelo Chronos
- `libs/trustware/src/chronos.ts`
- `libs/trustware/src/index.ts`
- Commit: `feat(trustware): export chronos schemas and types required by backoffice`

2) Auditoria — entrypoints canônicos para apps e __all__ no alvaro-core
- `apps/chronos-backoffice/src/index.ts`
- `apps/genesis-front/src/index.ts`
- `apps/mycelium-front/src/index.ts`
- `apps/alvaro-core/src/alvaro/__init__.py`
- Commit: `fix(audit): add canonical entrypoints for apps to satisfy contract check`

## Evidência de qualidade
- `Ozzmosis: Gates (npm ci + repo:check)` — PASS
- `py scripts/audit/entrypoints_check.py --repo-root . --out artifacts/entrypoints_check.json` — exit code 0
- `npm run typecheck:chronos` — PASS

## Declaração
OS encerrada sem pendências. PR 24 desbloqueado para merge e deploy.
