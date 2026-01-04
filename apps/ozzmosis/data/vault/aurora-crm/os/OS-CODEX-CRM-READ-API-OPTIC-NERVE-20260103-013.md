# OS-CODEX-CRM-READ-API-OPTIC-NERVE-20260103-013

## Objetivo
Criar Read APIs mínimas para o Frontend (Alvaro) consumir o estado real do CRM:
- buscar Contact
- buscar Deal
- buscar Deal ativo por Contact
- expor comparação financeira (`/v1/life-map/compare`) usando `WealthMathEngine` (OS 011) e retornando `FinancialComparison`

## Entregáveis
- `apps/crm-core/src/services/contact_service.py`
- `apps/crm-core/src/services/deal_service.py` (extensão de leitura; sem alterar OS 012)
- `apps/crm-core/src/schemas/read_models.py`
- `apps/crm-core/src/api/v1/contacts.py`
- `apps/crm-core/src/api/v1/deals.py`
- `apps/crm-core/src/api/v1/life_map.py`
- `apps/crm-core/src/main.py`
- Testes:
  - `apps/crm-core/tests/test_read_api.py`
- Registro local:
  - `apps/crm-core/PLAN.md`

## Rotas
- `GET /v1/contacts/{contact_id}`
- `GET /v1/contacts/by-channel/lookup?whatsapp_id=...&email=...`
- `GET /v1/deals/{deal_id}`
- `GET /v1/deals/active/by-contact/{contact_id}`
- `POST /v1/life-map/compare`

## Regras de governança (escopo)
- Read-path apenas (sem write-path, sem IA, sem Chronos/Conductor).
- Contratos do LifeMap: `LifeMapIn` e `FinancialComparison` (OS 011).

