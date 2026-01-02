# Inbox / Conversations — Spec Clean-Room (ROTA B)

Data: 2026-01-01

## Referências (apenas estudo, sem copiar código)
- Erxes (SHA): 3f3ff3b4b9e439eceac902562c49318598a62c8c
- Evidência: [_thirdparty_evidences/erxes_hits.txt](_thirdparty_evidences/erxes_hits.txt)
- SSOT de commits: [_thirdparty_evidences/commits.txt](_thirdparty_evidences/commits.txt)

## Objetivo
Definir contratos internos implementáveis para Inbox/Conversas no Aurora, cobrindo entidades, estados, invariantes e endpoints mínimos.

## Escopo
- Conversas (threads)
- Mensagens (entries)
- Participantes
- Canais/Integrações (origem)

Fora de escopo (neste documento): UI, busca full-text, anexos binários, WebSocket.

## Conceitos
- **Conversation**: thread que agrupa mensagens sobre um mesmo assunto/contato.
- **Message**: item atômico (texto) com metadados de autoria, timestamp e origem.
- **Participant**: vínculo de um principal (user/service) ou contato externo a uma conversa.
- **Integration/Channel**: origem externa (ex.: e-mail, WhatsApp, formulário) normalizada.

## Modelo de dados (proposto)
### Conversation
Campos mínimos:
- `id` (UUID)
- `scope_id` (tenant/órgão)
- `status` ∈ {`open`,`pending`,`closed`}
- `subject` (string, opcional)
- `created_at`, `updated_at`
- `last_message_at`
- `source` (enum/string: canal)
- `external_ref` (string opcional; referência externa)

Invariantes:
- `updated_at >= created_at`
- `last_message_at` só avança (monótono)
- Conversa `closed` não aceita novas mensagens por padrão (ver regra de reabertura)

### Message
Campos mínimos:
- `id` (UUID)
- `conversation_id`
- `scope_id`
- `direction` ∈ {`inbound`,`outbound`}
- `author_type` ∈ {`user`,`service`,`external`}
- `author_id` (string, pode ser null se `external`)
- `body` (string)
- `created_at`
- `external_ref` (string opcional)

Invariantes:
- `conversation_id` deve existir
- `body` não pode ser vazio após trim

### Participant
Campos mínimos:
- `conversation_id`
- `participant_type` ∈ {`user`,`service`,`external_contact`}
- `participant_id`
- `added_at`

Regra:
- Pelo menos 1 participante deve existir para uma conversa ativa.

## Máquina de estados
### Conversation.status
- `open` → `pending` (ex.: aguardando resposta externa)
- `open|pending` → `closed` (encerrar)
- `closed` → `open` (reabrir, se permitido)

Regras de transição:
- Reabrir exige permissão `conversation:reopen`.
- Encerrar exige permissão `conversation:close`.

## Contratos de autorização (RBAC)
Permissões mínimas (resource:action):
- `conversation:read`
- `conversation:create`
- `conversation:update`
- `conversation:close`
- `conversation:reopen`
- `message:read`
- `message:create`

Escopo:
- Todas as decisões são avaliadas com `scope_id` (tenant).

## API mínima (crm-core)
### Criar conversa
- `POST /conversations`
  - body: `{ subject?, source, external_ref?, participants[] }`
  - authz: `conversation:create`

### Listar conversas
- `GET /conversations?status=&source=&q=`
  - authz: `conversation:read`

### Obter conversa
- `GET /conversations/{id}`
  - authz: `conversation:read`

### Criar mensagem
- `POST /conversations/{id}/messages`
  - body: `{ direction, body, external_ref? }`
  - authz: `message:create`

### Listar mensagens
- `GET /conversations/{id}/messages`
  - authz: `message:read`

### Encerrar / Reabrir
- `POST /conversations/{id}/close` authz: `conversation:close`
- `POST /conversations/{id}/reopen` authz: `conversation:reopen`

## Auditoria
Eventos mínimos:
- `conversation.close`, `conversation.reopen`
- `message.create` (apenas metadados; sem conteúdo sensível se aplicável)

## Notas clean-room
Este documento foi produzido a partir de evidências textuais (hits) e conhecimento de domínio. Não contém código third-party.
