# OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B

## Contexto
CI do crm-core falhava na coleta do pytest por ausência de SQLAlchemy no ambiente de teste.

## Execução
- Branch: chore/shield-workspace-foundation
- Commit: 9663066
- Data (America/Sao_Paulo): 2026-01-03

## Mudanças
- apps/crm-core/requirements-test.txt
  - + sqlalchemy[asyncio]>=2.0,<3
- PLAN.md atualizado com a OS.

## Evidências
- Gates: PASS
- Falha resolvida: ModuleNotFoundError: sqlalchemy (pytest collection)

## Decisão
OS concluída e válida. Mantém “test import surface” mínimo para importar o app.
