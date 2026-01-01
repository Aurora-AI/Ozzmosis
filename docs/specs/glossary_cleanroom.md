# Glossário & Mapeamentos — Clean-Room (ROTA B)

Data: 2026-01-01

## Referência SSOT de estudo (SHAs)
- Erxes: 3f3ff3b4b9e439eceac902562c49318598a62c8c
- Odoo: 849ec71acbaea0061fd4b13888a486e4aebb6463
- Corteza: 46eb11bb76a7b6bbcab276b8d4f76a3e41ce8da2

Fonte: [_thirdparty_evidences/commits.txt](_thirdparty_evidences/commits.txt)

## Termos
- **Inbox**: visão operacional de conversas ativas.
- **Conversation**: thread que agrupa mensagens.
- **Message**: item de comunicação (inbound/outbound).
- **Integration/Channel**: origem (WhatsApp, e-mail, portal).

- **Lead**: potencial cliente/oportunidade.
- **Opportunity**: lead qualificado.
- **Quotation**: cotação (valores/itens) enviada.
- **Proposal**: proposta submetida para avaliação.
- **Approval**: decisão formal de aprovação/reprovação.
- **Contract**: contrato firmado.

- **RBAC**: controle de acesso baseado em papéis.
- **Principal**: ator (user/service).
- **Role**: conjunto de permissões.
- **Permission**: `resource:action`.
- **Scope**: tenant/órgão (contexto).

## Mapeamentos (conceituais, não-código)
- Erxes → Aurora
  - conversation → Conversation
  - message → Message
  - integration/channel → Integration/Channel

- Odoo → Aurora
  - crm.lead (lead/opportunity) → Opportunity
  - quotation/sale order (cotação) → Quotation
  - approval flow (aprovação) → Approval

- Corteza → Aurora
  - roles/permissions/authorize → RBAC (deny-wins)

## Regras clean-room
- Proibido copiar/colar código third-party para produção Aurora.
- Usar apenas evidências (hits) + conhecimento de domínio para especificar e reimplementar.
