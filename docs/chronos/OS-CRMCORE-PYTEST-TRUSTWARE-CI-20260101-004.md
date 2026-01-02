# OS-CRMCORE-PYTEST-TRUSTWARE-CI-20260101-004

**Data:** 2026-01-01
**Projeto:** Ozzmosis / apps/crm-core
**Decisão:** Executar `pytest` somente em ambiente provisionado (CI/runner), para manter Trustware (sem installs locais).

## Contexto

- WP3 Prova B estava **BLOCKED** localmente por ausência de `pytest` e por restrição Trustware (sem `pip install` local fora de venv/container provisionado).

## Implementação

- Dependências de teste declaradas em `apps/crm-core/requirements-test.txt` (para instalação apenas no runner).
- Gate CI adicionado em `.github/workflows/ci-crm-core.yml`.

## Comando (no runner)

- `python -m pip install -r apps/crm-core/requirements-test.txt`
- `cd apps/crm-core && python -m pytest -q`

## Evidência

- Fonte de verdade: Workflow GitHub Actions **ci-crm-core** (arquivo `.github/workflows/ci-crm-core.yml`).
- Resultado esperado para WP3 Prova B: erro real de código (se houver) ou PASS (tooling não deve mais bloquear).
