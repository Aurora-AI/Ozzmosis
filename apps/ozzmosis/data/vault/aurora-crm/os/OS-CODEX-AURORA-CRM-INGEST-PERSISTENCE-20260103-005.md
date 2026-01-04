# 🧬 ORDEM DE SERVIÇO — IMPLEMENTAÇÃO
## Persistência de Ingest + Evento Canônico (OS 005)

**OS ID:** OS-CODEX-AURORA-CRM-INGEST-PERSISTENCE-20260103-005  
**Projeto:** Aurora / Ozzmosis  
**Origem:** Arquitetura (Aurora)  
**Destino:** CODEX / Copilot (Executor Mecânico)  
**Tipo:** Evolução Controlada do CRM Headless  
**Autonomia:** 🔴 ZERO (execução literal)  
**Prioridade:** 🚨 ALTA (desbloqueia Assistente real)  
**Status Inicial:** ABERTA  
**SSOT:** Vault / Chronos  

---

## 1️⃣ Missão

Evoluir o **CRM Headless Genesis** para que o endpoint de ingestão:

1. Persista o evento de entrada
2. Resolva ou crie o Contact
3. Retorne identificadores reais
4. Prepare o gancho canônico para Chronos / Conductor

Sem UI.  
Sem LLM síncrono.  
Sem lógica de negócio avançada.

---

## 2️⃣ Escopo Obrigatório

### A) Nova Entidade — `IngestEvent`

Criar tabela para registrar **toda entrada externa** no sistema.

Campos mínimos:

- `id` (UUID)
- `source` (whatsapp, web, email, etc.)
- `sender_id`
- `content`
- `metadata` (JSONB)
- `contact_id` (nullable FK)
- `created_at`
- `status` (`RECEIVED` | `LINKED` | `ERROR`)

### B) Persistência de Contact (find-or-create)

Resolver Contact por:

- `whatsapp_id` (quando `source = whatsapp`)
- `email` (quando `source = email`)

Criar Contact se inexistente.  
Nunca duplicar identidade.

### C) Evolução do Endpoint `/ingest/message`

O endpoint **DEVE**:

1. Persistir `IngestEvent` com `status=RECEIVED`
2. Resolver ou criar `Contact`
3. Atualizar `IngestEvent.contact_id` e `status=LINKED`
4. Retornar:
   - `event_id`
   - `contact_id`
   - `status = persisted`

---

## 3️⃣ Arquivos a Criar / Alterar (canônico)

### Models

- Criar: `apps/crm-core/src/models/ingest_event.py`
- Alterar: `apps/crm-core/src/models/__init__.py` (export/registro, se aplicável)
- Alterar: `apps/crm-core/alembic/env.py` (importar `ingest_event` para autoload metadata, se aplicável)

### API

- Alterar: `apps/crm-core/src/api/v1/ingest.py`

### Migração Alembic

- Adicionar 1 migration em `apps/crm-core/alembic/versions/` criando `crm_ingest_events` + FK opcional para `crm_contacts`.

---

## 4️⃣ Proibições Explícitas

❌ Criar UI  
❌ Processar LLM no request  
❌ Criar Deal automaticamente  
❌ Acoplar Conductor diretamente  
❌ Alterar schema de Deal/Contact  

---

## 5️⃣ Execução (passo a passo literal)

### Step 0 — Precondições

1. Branch de trabalho: `chore/shield-workspace-foundation`
2. Gates do repo devem continuar PASS:

```bash
scripts/agents/run-gates.ps1
```

3. Banco alvo: PostgreSQL (recomendado para validação):

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### Step 1 — Model `IngestEvent`

Criar **arquivo completo**:

`apps/crm-core/src/models/ingest_event.py`

```python
from sqlalchemy import Column, String, JSON, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
import enum
import uuid

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class IngestStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    LINKED = "LINKED"
    ERROR = "ERROR"


class IngestEvent(Base):
    __tablename__ = "crm_ingest_events"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)

    source = Column(String, default="whatsapp", index=True)
    sender_id = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    metadata = Column(JSON, default=dict)

    contact_id = Column(String, ForeignKey("crm_contacts.id"), nullable=True, index=True)
    status = Column(Enum(IngestStatus), default=IngestStatus.RECEIVED, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### Step 2 — Endpoint `/ingest/message` com persistência (async, sem LLM)

Atualizar **arquivo completo**:

`apps/crm-core/src/api/v1/ingest.py`

Requisitos canônicos do handler:

- Deve ser `async`
- Deve abrir sessão DB
- Deve:
  - criar `IngestEvent`
  - resolver/criar `Contact`
  - linkar `contact_id` e status
- Deve retornar `event_id`, `contact_id`, `status="persisted"`

### Step 3 — Migração Alembic (crm_ingest_events)

Criar 1 migration em:

`apps/crm-core/alembic/versions/`

Requisitos:

- cria tabela `crm_ingest_events`
- FK opcional para `crm_contacts.id`
- JSONB no Postgres (via `with_variant`)

### Step 4 — Gates + commit

```bash
scripts/agents/run-gates.ps1
git add apps/crm-core/src/models/ingest_event.py apps/crm-core/src/api/v1/ingest.py apps/crm-core/alembic/versions/*
git commit -m "feat(crm-core): persist ingest events + resolve contact"
git push
```

---

## 6️⃣ Critérios de Aceite (OS 005)

- [ ] `POST /ingest/message` persiste evento
- [ ] Contact resolvido ou criado corretamente
- [ ] `event_id` e `contact_id` retornados
- [ ] Migração Alembic aplicada
- [ ] Gates PASS
- [ ] Nenhuma regressão da OS 004

---

## 7️⃣ Resultado Esperado

✅ Ouvido absoluto com memória  
✅ Contato resolvido de forma determinística  
✅ Evento canônico pronto para Chronos  
✅ Assistente apto a operar em produção controlada  

---

## 8️⃣ Mantra da OS 005

> Nada entra sem deixar rastro.  
> Nada decide sem memória.  
> Nada escala sem governança.  

