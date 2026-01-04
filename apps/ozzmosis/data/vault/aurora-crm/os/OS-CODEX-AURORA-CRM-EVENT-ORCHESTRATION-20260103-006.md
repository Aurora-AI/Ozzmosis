# 🧬 ORDEM DE SERVIÇO — ORQUESTRAÇÃO ASSÍNCRONA
## Transactional Outbox + Worker (CRM Headless Reflexos)

**OS ID:** OS-CODEX-AURORA-CRM-EVENT-ORCHESTRATION-20260103-006  
**Projeto:** Aurora / Ozzmosis  
**Origem:** Arquitetura (Aurora)  
**Destino:** Agente CODEX / Copilot (Executor Mecânico)  
**Autonomia:** 🔴 ZERO (execução literal)  
**Prioridade:** 🚨 CRÍTICA (habilita “reflexos” sem travar API)  
**Dependências:** OS 004 e OS 005 (concluídas e no Vault)  
**Status Inicial:** ABERTA  

---

## 1️⃣ Missão

Implementar o padrão **Transactional Outbox** para desacoplar:

- **Recebimento** (rápido; HTTP)
- **Processamento** (pesado; IA/Chronos; assíncrono)

Garantias obrigatórias:

1. Se a transação gravou no banco, o evento **existe** e será processado.
2. Worker resiliente com:
   - idempotência prática (por status/locking)
   - retry com backoff
   - rastreabilidade por `trace_id`
3. Endpoint `/ingest/message` permanece rápido.

---

## 2️⃣ Escopo fechado

### Entregáveis obrigatórios

- Tabela e model `crm_event_outbox`
- Dispatcher (`emit` + `drain_once`)
- Worker (`outbox_worker.py`) para drenar fila
- Integração no `/ingest/message` para enfileirar evento **na mesma transação** que grava Contact/IngestEvent (OS 005)

### Não é escopo

❌ UI  
❌ Processar LLM no request  
❌ Integrar Chronos/Conductor de verdade (fica como hook/placeholder)  
❌ Criar Deal automaticamente  
❌ Refatorar Contact/Deal/IngestEvent além do necessário para linkagem  

---

## 3️⃣ Implementação (CODEX: aplicar integralmente)

> Observação: a OS 005 já persiste `IngestEvent` e `Contact`.
> Nesta OS 006, o **Outbox deve referenciar o IngestEvent** (via `trace_id` ou `ingest_event_id` no payload). Para manter o schema enxuto, usaremos `trace_id` + payload contendo `ingest_event_id`.

---

### ✅ TAREFA 1 — Model `EventOutbox`

Criar:

```text
apps/crm-core/src/models/outbox.py
```

Conteúdo integral:

```python
import enum
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from sqlalchemy import Column, DateTime, Enum, Integer, JSON, String, Text
from sqlalchemy.sql import func

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class OutboxStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class EventOutbox(Base):
    """
    Transactional Outbox (CRM):
    - Eventos são registrados na mesma transação do endpoint.
    - Worker drena a fila com lock + retry.
    """
    __tablename__ = "crm_event_outbox"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)

    event_type = Column(String, nullable=False, index=True)  # ex: INGEST_RECEIVED
    payload = Column(JSON, nullable=False)

    status = Column(Enum(OutboxStatus), nullable=False, default=OutboxStatus.PENDING, index=True)
    attempts = Column(Integer, nullable=False, default=0)
    last_error = Column(Text, nullable=True)

    trace_id = Column(String, index=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)

    # Próxima tentativa (retry/backoff). Default = now (pronto para processar).
    next_retry_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @staticmethod
    def compute_next_retry(attempts: int) -> datetime:
        # Backoff simples: 0s, 5s, 15s, 45s, 2m, 5m (capped)
        schedule = [0, 5, 15, 45, 120, 300]
        idx = min(attempts, len(schedule) - 1)
        return datetime.now(timezone.utc) + timedelta(seconds=schedule[idx])
```

---

### ✅ TAREFA 2 — Export de models

Atualizar (criar se não existir):

```text
apps/crm-core/src/models/__init__.py
```

Conteúdo integral (ajuste imports se o seu `IngestEvent` tiver nome diferente):

```python
from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import Deal
from src.models.outbox import EventOutbox

# OS 005: manter import do IngestEvent conforme o arquivo real criado
# Exemplo comum:
from src.models.ingest_event import IngestEvent  # noqa: F401
```

---

### ✅ TAREFA 3 — Dispatcher (emit + drain_once com lock e retry)

Criar:

```text
apps/crm-core/src/services/dispatcher.py
```

Conteúdo integral:

```python
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.outbox import EventOutbox, OutboxStatus

logger = logging.getLogger(__name__)


class EventDispatcher:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def emit(self, event_type: str, payload: Dict[str, Any], trace_id: str) -> EventOutbox:
        """
        Registra evento na Outbox.
        Deve ser chamado dentro da transação principal do endpoint (antes do commit).
        """
        entry = EventOutbox(
            event_type=event_type,
            payload=payload,
            trace_id=trace_id,
            status=OutboxStatus.PENDING,
        )
        self.db.add(entry)
        logger.info("OUTBOX emit: event_type=%s trace_id=%s", event_type, trace_id)
        return entry

    async def drain_once(self, batch_size: int = 25) -> int:
        """
        Drena N eventos pendentes, com lock pessimista.
        - Seleciona somente PENDING/FAILED cujo next_retry_at <= now.
        - Usa SKIP LOCKED para múltiplos workers.
        """
        now = datetime.now(timezone.utc)

        stmt = (
            select(EventOutbox)
            .where(EventOutbox.next_retry_at <= now)
            .where(EventOutbox.status.in_([OutboxStatus.PENDING, OutboxStatus.FAILED]))
            .order_by(EventOutbox.created_at.asc())
            .with_for_update(skip_locked=True)
            .limit(batch_size)
        )

        res = await self.db.execute(stmt)
        items = list(res.scalars().all())
        if not items:
            return 0

        processed = 0
        for item in items:
            # marca processing e incrementa tentativas
            item.status = OutboxStatus.PROCESSING
            item.attempts = int(item.attempts or 0) + 1
            item.last_error = None

            try:
                # Hook: aqui entra Chronos/Conductor/IA em OS futura.
                # Nesta OS 006: apenas “simula” processamento robusto.
                # Exemplo: await chronos.publish(...)
                item.status = OutboxStatus.COMPLETED
                item.processed_at = now
                processed += 1

            except Exception as e:  # pragma: no cover (por enquanto)
                item.last_error = str(e)
                item.status = OutboxStatus.FAILED
                item.next_retry_at = EventOutbox.compute_next_retry(item.attempts)
                logger.exception("OUTBOX failed: id=%s trace_id=%s", item.id, item.trace_id)

        return processed
```

---

### ✅ TAREFA 4 — Worker de Outbox (loop assíncrono)

Criar:

```text
apps/crm-core/src/workers/outbox_worker.py
```

Conteúdo integral:

```python
import asyncio
import logging
import os
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db_session  # ajustar para o provider real do crm-core
from src.services.dispatcher import EventDispatcher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = int(os.getenv("CRM_OUTBOX_POLL_INTERVAL", "2"))
BATCH_SIZE = int(os.getenv("CRM_OUTBOX_BATCH_SIZE", "25"))


async def run_once() -> int:
    async with get_db_session() as db:  # type: ignore
        dispatcher = EventDispatcher(db)
        processed = await dispatcher.drain_once(batch_size=BATCH_SIZE)
        await db.commit()
        return processed


async def main() -> None:
    logger.info("OUTBOX worker started (poll=%ss batch=%s)", POLL_INTERVAL_SECONDS, BATCH_SIZE)

    while True:
        try:
            processed = await run_once()
            if processed == 0:
                await asyncio.sleep(POLL_INTERVAL_SECONDS)
        except Exception:
            logger.exception("OUTBOX worker loop error")
            await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    asyncio.run(main())
```

---

### ✅ TAREFA 5 — Integração no `/ingest/message` (mesma transação)

Atualizar:

```text
apps/crm-core/src/api/v1/ingest.py
```

Ação obrigatória:

- Após persistir `IngestEvent` e resolver/criar `Contact` (OS 005),
- Enfileirar evento na Outbox com `dispatcher.emit(...)` **antes do commit**.

Patch conceitual (aplicar no código real):

1. Garanta `trace_id` (se já existir na OS 005, reutilize).
2. Monte payload mínimo:
   - `ingest_event_id`
   - `contact_id`
   - `source`
   - `sender_id`
   - `content_len` (opcional)
   - `metadata` (limitado)
3. `await dispatcher.emit("INGEST_RECEIVED", payload, trace_id)`

Retorno do endpoint deve incluir:

- `trace_id`
- `event_id` (IngestEvent)
- `outbox_id` (EventOutbox)
- `contact_id`
- `status="accepted"`

---

### ✅ TAREFA 6 — Migração Alembic (crm_event_outbox)

Criar migration Alembic para:

- tabela `crm_event_outbox` com JSONB no Postgres (via `with_variant`)
- índices em `status`, `event_type`, `trace_id`, `next_retry_at`

Comandos (documentar em PLAN.md):

```bash
cd apps/crm-core
alembic revision --autogenerate -m "create crm_event_outbox"
alembic upgrade head
```

---

### ✅ TAREFA 7 — DB Session helper (se necessário)

Se o crm-core **não** tiver um helper `get_db_session()` (async context manager), criar:

```text
apps/crm-core/src/database.py
```

ou ajustar o arquivo existente para incluir:

- engine async
- `async_sessionmaker`
- `async def get_db_session()` retornando `AsyncSession` via `async with`

Sem quebrar `get_db` (dependency).

---

## 4️⃣ Critérios de aceite (obrigatórios)

A OS 006 é considerada **CONCLUÍDA** somente se:

- [ ] Migration aplicada e tabela `crm_event_outbox` existe
- [ ] `POST /ingest/message` cria `IngestEvent` (OS 005) **e** uma entrada em `crm_event_outbox` **na mesma transação**
- [ ] Resposta do endpoint inclui `outbox_id`, `event_id`, `contact_id`, `trace_id`
- [ ] Worker `outbox_worker.py` consegue drenar fila localmente (marcando `COMPLETED`)
- [ ] Lock/skip-locked presente (multi-worker safe)
- [ ] Gates do repo executados (PASS)
- [ ] Vault atualizado com a OS 006 executada em:
  `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-EVENT-ORCHESTRATION-20260103-006.md`

---

## 5️⃣ Proibições

❌ Processar IA/Chronos dentro do request HTTP  
❌ Adicionar novas entidades de negócio além do Outbox  
❌ Alterar Contact/Deal schema sem OS específica  
❌ Introduzir dependência de broker externo agora (Kafka/Redis/RQ)  

---

## 6️⃣ Resultado esperado

Ao final, o CRM Headless terá:

✅ Memória (Contact/IngestEvent)  
✅ Ouvidos (Ingest)  
✅ Reflexos (Outbox + Worker)  
✅ Base sólida para OS 007 (Chronos publish + Conductor dispatch)  

