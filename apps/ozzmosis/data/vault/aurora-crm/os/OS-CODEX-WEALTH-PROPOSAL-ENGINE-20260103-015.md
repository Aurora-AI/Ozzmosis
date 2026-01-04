# OS-CODEX-WEALTH-PROPOSAL-ENGINE-20260103-015

## Objetivo
Transformar `Deal.life_map` (verdade persistida) em `Deal.proposals` (verdade persistida), gerando 3 bundles determinísticos:
- `ESSENTIAL`
- `WEALTH`
- `LEGACY`

## Entregáveis
- Model:
  - `apps/crm-core/src/models/deal.py` (campos `proposals`, `proposals_version`, `proposals_updated_at`)
- Migration Alembic:
  - `apps/crm-core/alembic/versions/20260103_0006_add_deal_proposals_engine_fields.py`
- Schemas:
  - `apps/crm-core/src/schemas/proposal.py`
- Services:
  - `apps/crm-core/src/services/proposal_policy.py`
  - `apps/crm-core/src/services/proposal_service.py`
- API v1:
  - `apps/crm-core/src/api/v1/proposals.py`
  - `POST /v1/proposals/generate?deal_id=...` (gera + persiste)
  - `GET /v1/proposals/by-deal/{deal_id}` (retorna persistido; não gera)
- Read exposure:
  - `apps/crm-core/src/schemas/read_models.py` (DealOut expõe proposals)
- Tests:
  - `apps/crm-core/tests/test_proposal_engine_generation.py`
  - `apps/crm-core/tests/test_proposal_api.py`
- Registro local:
  - `apps/crm-core/PLAN.md`

## Regras de governança (escopo)
- Proposta gerada por Python determinístico (sem IA no domínio).
- `GET` não gera proposta (sem side effects).
- Postgres: JSONB via `with_variant`; SQLite: JSON.

