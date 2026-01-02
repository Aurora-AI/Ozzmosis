# Chronos — OS-CRMCORE-WP3-RBAC-AUDIT-20260101-003

Data: 2026-01-01

Contexto
- WP3 implementa runtime RBAC (deny-by-default via dependency FastAPI) + helper único de auditoria Trustware + endpoint protegido de prova.
- Este registro não altera tooling; apenas governa o estado das provas.

Estado das provas (WP3)

1) Prova A — PASS (importabilidade, sem crash)
- Comando:
  - `cd C:\Aurora\Ozzmosis\apps\crm-core`
  - `py -c "from src.security.policy import *; from src.security.dependencies import *; print('OK')"`
- Resultado: OK

2) Prova B — BLOCKED (ambiente, não código)
- Comando:
  - `cd C:\Aurora\Ozzmosis\apps\crm-core`
  - `py -m pytest -q`
- Erro bruto:
  - `C:\Users\rodri\AppData\Local\Programs\Python\Python311\python.exe: No module named pytest`
- Classificação: BLOCKED (missing dependency)
- Nota Trustware: `pip install` / criação de venv está fora do allowlist e requer autorização humana explícita.

3) Prova C — DEFERRED
- Motivo: só faz sentido executar gates após decisão sobre como rodar pytest (local venv vs CI/runner provisionado).

Decisão pendente
- Next Action (decisão de liderança):
  - Rota 1: autorizar instalação local via venv/pip para executar Prova B.
  - Rota 2 (preferível): executar Prova B em CI/runner provisionado e reprodutível.
