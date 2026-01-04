# OS-CODEX-CRM-LIFEMAP-FIRST-CLASS-TRUTH-20260103-014

## Objetivo
Transformar o LifeMap em verdade persistida e versionada no `Deal`, com governança determinística:
- colunas first-class em `crm_deals`: `life_map`, `life_map_version`, `life_map_updated_at`
- endpoint `POST /v1/life-map?contact_id=...` para anexar LifeMap ao deal ativo
- governança do `PipelineGovernor` por introspecção do dado (`deal.life_map`), sem flag booleana em metadata

## Entregáveis
- Model:
  - `apps/crm-core/src/models/deal.py`
- Migration Alembic:
  - `apps/crm-core/alembic/versions/20260103_0005_add_deal_life_map_first_class_fields.py`
- Services:
  - `apps/crm-core/src/services/state_machine.py`
  - `apps/crm-core/src/services/deal_service.py` (`attach_life_map`)
- API:
  - `apps/crm-core/src/api/v1/life_map.py` (novo `POST /v1/life-map`)
- Worker:
  - `apps/crm-core/src/workers/outbox_worker.py` (remove dependência de `metadata.has_life_map`)
- Schemas:
  - `apps/crm-core/src/schemas/read_models.py` (exposição do LifeMap no `DealOut`)
- Tests:
  - `apps/crm-core/tests/test_life_map_governor.py`
  - `apps/crm-core/tests/test_life_map_persistence.py`

## Regras de governança (escopo)
- Proibido usar `product_data` para LifeMap.
- Proibido governar PROPOSAL por `metadata.has_life_map`.
- `LifeMapIn` é contrato rígido de entrada (OS 011).

