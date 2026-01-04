# OS-CODEX-CRM-PROPOSAL-ACCEPTANCE-20260103-016

## Objetivo
Materializar o ato de aceite do tier (ESSENTIAL/WEALTH/LEGACY) como “carimbo de verdade”:
- snapshot forense em `Deal.accepted_proposal_data` (imutável por default)
- transição governada por `PipelineGovernor`
- rastreabilidade (`accepted_at`, `client_fingerprint`, versões no snapshot)

## Entregáveis
- Model + migration:
  - `apps/crm-core/src/models/deal.py`
  - `apps/crm-core/alembic/versions/20260103_0007_add_deal_acceptance_fields.py`
- Schemas:
  - `apps/crm-core/src/schemas/proposal_acceptance.py`
- Service:
  - `apps/crm-core/src/services/deal_service.py` (`accept_proposal`)
- API v1:
  - `apps/crm-core/src/api/v1/proposal_acceptance.py`
  - `POST /v1/proposals/{deal_id}/accept`
- Wiring:
  - `apps/crm-core/src/main.py`
- Tests:
  - `apps/crm-core/tests/test_proposal_acceptance_service.py`
  - `apps/crm-core/tests/test_proposal_acceptance_api.py`
- Registro local:
  - `apps/crm-core/PLAN.md`

## Regras de governança (escopo)
- Sem IA no write-path.
- Aceite é imutável (re-aceite retorna 409).
- Snapshot inclui `proposal_version_at_acceptance` e `life_map_version_at_acceptance`.

