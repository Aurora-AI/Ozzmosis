# OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL

## Objetivo
Implantar no `apps/crm-core`:
- Schemas Pydantic (Constituição)
- Engine determinístico de comparação banco vs consórcio (Respiração)
- Máquina de estados determinística para governança do pipeline (Coração)

## Entregáveis
- `apps/crm-core/src/schemas/life_map.py`
- `apps/crm-core/src/services/math_engine.py`
- `apps/crm-core/src/services/state_machine.py`
- `apps/crm-core/src/schemas/__init__.py`
- `apps/crm-core/src/services/__init__.py`
- Testes:
  - `apps/crm-core/tests/test_math_engine.py`
  - `apps/crm-core/tests/test_pipeline_governor.py`
- Registro local:
  - `apps/crm-core/PLAN.md`

## Regras de governança (escopo)
- IA nunca governa write-path.
- MathEngine é determinístico e não implementa SAC/PRICE nesta fase (estimativa explícita).
- PipelineGovernor impede regressão e transições não previstas.

