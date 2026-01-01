# RBAC — Spec Clean-Room (ROTA B)

Data: 2026-01-01

## Referências (apenas estudo, sem copiar código)
- Corteza (SHA): 46eb11bb76a7b6bbcab276b8d4f76a3e41ce8da2
- Evidência: [_thirdparty_evidences/corteza_hits.txt](_thirdparty_evidences/corteza_hits.txt)
- SSOT de commits: [_thirdparty_evidences/commits.txt](_thirdparty_evidences/commits.txt)

## Objetivo
Definir RBAC determinístico para Aurora, compatível com multi-tenant (`scope`) e com semântica **deny-wins**, pronto para uso em `crm-core`.

## Conceitos
- **Principal**: ator (user/service).
- **Role**: conjunto nomeado de permissões.
- **Permission**: direito atômico `resource:action`.
- **Assignment**: vínculo principal↔role (opcionalmente por `scope`).
- **Policy effect**: `allow` ou `deny`.

## Modelo de dados (mínimo)
- `roles(id, name, description)`
- `permissions(id, resource, action, description)`
- `role_permissions(role_id, permission_id, effect)`
- `principal_roles(principal_id, role_id, scope)`
- `audit_log(actor_id, actor_type, action, resource, decision, reason, timestamp, correlation_id, matched_rules)`

## Semântica de avaliação
Entrada: `(principal_id, resource, action, scope?)`

Regras:
1. Coletar roles do principal válidas para o `scope` (role global quando `scope` do vínculo é null).
2. Coletar todas as regras `role_permissions` dessas roles.
3. Matching suporta coringas:
   - `resource='*'` casa com qualquer resource
   - `action='*'` casa com qualquer action
4. Se qualquer regra matching tiver `effect=deny` → **DENY**.
5. Senão, se existir algum `allow` matching → **ALLOW**.
6. Senão → **DENY** (default deny).

## Auditoria
- Registrar toda decisão `DENY`.
- Registrar mudanças administrativas (fora deste spec de runtime).

## API mínima (crm-core)
- `POST /authz/check` body `{ principal_id, resource, action, scope?, correlation_id? }` → `{ decision, reason, matched[] }`

## Notas clean-room
Este spec define contrato e semântica. Não contém código third-party.
