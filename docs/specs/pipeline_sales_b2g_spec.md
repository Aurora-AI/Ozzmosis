# Pipeline Vendas B2G — Spec Clean-Room (ROTA B)

Data: 2026-01-01

## Referências (apenas estudo, sem copiar código)
- Odoo (SHA): 849ec71acbaea0061fd4b13888a486e4aebb6463
- Evidência: [_thirdparty_evidences/odoo_hits.txt](_thirdparty_evidences/odoo_hits.txt)
- SSOT de commits: [_thirdparty_evidences/commits.txt](_thirdparty_evidences/commits.txt)

## Objetivo
Definir um pipeline implementável para oportunidades e vendas B2G, incluindo:
- Cotação (Quotation)
- Proposta (Proposal)
- Aprovações (Approvals)
- Contrato (Contract)

## Conceitos
- **Lead**: potencial oportunidade (pré-qualificação).
- **Opportunity**: lead qualificado com valor/escopo estimado.
- **Quotation**: cotação com itens/valores proposta ao cliente.
- **Proposal**: versão formal (pode ser documento) vinculada à cotação.
- **Approval**: decisão registrada (aprovado/reprovado) por papel.
- **Contract**: compromisso final após aprovações.

## Modelo de dados (proposto)
### Opportunity
Campos mínimos:
- `id` (UUID)
- `scope_id`
- `title`
- `customer_org_id`
- `stage` ∈ {`lead`,`qualified`,`quotation`,`proposal`,`approved`,`contracted`,`lost`}
- `value_estimate` (decimal)
- `currency`
- `owner_principal_id`
- `created_at`, `updated_at`

Invariantes:
- `stage` é monótono, exceto retorno controlado para correção (`proposal`→`quotation`).

### Quotation
Campos mínimos:
- `id` (UUID)
- `scope_id`
- `opportunity_id`
- `state` ∈ {`draft`,`sent`,`cancelled`,`accepted`}
- `valid_until` (date)
- `lines[]` (itens)
- `total_amount`
- `created_at`, `updated_at`

### Proposal
Campos mínimos:
- `id` (UUID)
- `scope_id`
- `opportunity_id`
- `quotation_id`
- `state` ∈ {`draft`,`submitted`,`under_review`,`approved`,`rejected`}
- `created_at`, `updated_at`

### Approval
Campos mínimos:
- `id`
- `scope_id`
- `proposal_id`
- `step` (string; ex.: jurídico, compliance, diretoria)
- `state` ∈ {`pending`,`approved`,`rejected`}
- `decided_by` (principal_id)
- `decided_at`
- `reason` (string opcional)

Regras:
- A proposta só muda para `approved` quando todos os approvals obrigatórios estiverem `approved`.

### Contract
Campos mínimos:
- `id`
- `scope_id`
- `opportunity_id`
- `proposal_id`
- `state` ∈ {`draft`,`signed`,`cancelled`}
- `signed_at` (datetime opcional)

## Máquina de estados (resumo)
### Quotation.state
- `draft` → `sent`
- `sent` → `accepted`
- `draft|sent` → `cancelled`

### Proposal.state
- `draft` → `submitted`
- `submitted` → `under_review`
- `under_review` → `approved|rejected`

### Opportunity.stage (alto nível)
- `qualified` → `quotation` (cria cotação)
- `quotation` → `proposal` (submete proposta)
- `proposal` → `approved` (todos approvals ok)
- `approved` → `contracted` (contrato assinado)

## Contratos de autorização (RBAC)
Permissões mínimas:
- `opportunity:read`, `opportunity:update`
- `quotation:create`, `quotation:update`, `quotation:send`, `quotation:cancel`
- `proposal:create`, `proposal:submit`
- `approval:decide`
- `contract:create`, `contract:sign`

Regras:
- Apenas usuários com `approval:decide` podem aprovar/rejeitar.
- Aprovação grava auditoria obrigatória.

## API mínima (crm-core)
- `POST /opportunities`
- `PATCH /opportunities/{id}`
- `POST /opportunities/{id}/quotations`
- `POST /quotations/{id}/send`
- `POST /opportunities/{id}/proposals`
- `POST /proposals/{id}/submit`
- `POST /approvals/{id}/decide` body `{ state: approved|rejected, reason? }`
- `POST /contracts` (a partir de proposta aprovada)
- `POST /contracts/{id}/sign`

## Auditoria (mínimo)
- `quotation.send`, `quotation.cancel`
- `proposal.submit`
- `approval.decide`
- `contract.sign`

## Notas clean-room
Sem copiar código third-party; apenas conceitos e contratos implementáveis.
