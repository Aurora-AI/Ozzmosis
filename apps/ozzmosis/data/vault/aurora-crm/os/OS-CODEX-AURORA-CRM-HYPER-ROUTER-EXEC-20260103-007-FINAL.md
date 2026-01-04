# 🧬 ORDEM DE SERVIÇO FINAL — MHC ROUTER + WORKER BLINDADO
## Paralelismo (MHC) + Idempotência + Retry (OS 007)

**OS ID:** OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL  
**Projeto:** Aurora / Ozzmosis  
**Origem:** Arquitetura (Aurora)  
**Destino:** Agente CODEX / Copilot (Executor Mecânico)  
**Autonomia:** 🔴 ZERO (execução literal)  
**Prioridade:** 🚨 CRÍTICA  
**Dependências:** OS 004/005/006 concluídas e registradas no Vault  
**Status Inicial:** ABERTA  

---

## 1️⃣ Missão

Transformar o pipeline de processamento do CRM em **topologia em estrela (MHC)**:

- O Worker lê eventos da **Outbox**
- Normaliza payload (contrato fixo)
- Dispara especialistas em paralelo (`asyncio.gather`)
- Agrega resposta (BLOCK/PROCEED + safety delta)
- Marca Outbox como COMPLETED/FAILED com retry/backoff correto

Sem processar IA/Chronos “de verdade” ainda (hook apenas).  
Sem UI.  
Sem mudar modelos Contact/Deal/IngestEvent.  

---

## 2️⃣ Problemas detectados no ajuste do Jules (corrigir nesta OS)

1. Backoff inválido: `item.next_retry_at - item.created_at` não é uma política de retry; pode explodir em runtime.
2. Lógica duplicada: importar Dispatcher e não usar gera drift; melhor consolidar a disciplina de lock/fetch em um lugar.
3. Idempotência: deve ser baseada em **status + lock** e retorno limpo (short-circuit).

Esta OS corrige esses 3 pontos, mantendo o conceito do MHC intacto.

---

## 3️⃣ Execução (CODEX: aplicar integralmente)

### ✅ TAREFA 1 — Criar interface dos processadores

Criar:

```text
apps/crm-core/src/processors/base.py
```

Conteúdo integral:

```python
from abc import ABC, abstractmethod
from typing import Any, Dict
from pydantic import BaseModel


class ProcessingResult(BaseModel):
    processor_name: str
    status: str  # "SUCCESS", "BLOCK", "SKIP", "ERROR"
    data: Dict[str, Any]
    score_impact: int = 0  # delta para safety_score


class BaseProcessor(ABC):
    """
    Interface para especialistas (nodes MHC).
    Operam isolados; o Router orquestra.
    """

    @abstractmethod
    async def process(self, context: Dict[str, Any]) -> ProcessingResult:
        """
        context: payload normalizado contendo chaves estáveis:
        trace_id, ingest_event_id, contact_id, raw_content, source, metadata
        """
        raise NotImplementedError
```

---

### ✅ TAREFA 2 — Especialista Safety (stub funcional)

Criar:

```text
apps/crm-core/src/processors/safety.py
```

Conteúdo integral:

```python
from typing import Any, Dict

from src.processors.base import BaseProcessor, ProcessingResult


class SafetyProcessor(BaseProcessor):
    async def process(self, context: Dict[str, Any]) -> ProcessingResult:
        content = (context.get("raw_content") or "").lower()

        if any(word in content for word in ("cancelar", "reclamar", "procon")):
            return ProcessingResult(
                processor_name="safety",
                status="BLOCK",
                data={
                    "flag": "high_churn_risk",
                    "reason": "negative_sentiment_detected",
                    "triggers": ["cancelar/reclamar/procon"],
                },
                score_impact=-50,
            )

        return ProcessingResult(
            processor_name="safety",
            status="SUCCESS",
            data={"flag": "clean"},
            score_impact=0,
        )
```

---

### ✅ TAREFA 3 — Especialista SRV (stub funcional)

Criar:

```text
apps/crm-core/src/processors/srv.py
```

Conteúdo integral:

```python
from typing import Any, Dict

from src.processors.base import BaseProcessor, ProcessingResult


class SRVProcessor(BaseProcessor):
    async def process(self, context: Dict[str, Any]) -> ProcessingResult:
        # Futuro: extração S/R/V via ALVARO/LLM (fora desta OS)
        return ProcessingResult(
            processor_name="srv_extractor",
            status="SUCCESS",
            data={
                "detected_s": "analise_pendente",
                "detected_r": "analise_pendente",
                "detected_v": "analise_pendente",
                "ai_ready": True,
            },
            score_impact=0,
        )
```

---

### ✅ TAREFA 4 — HyperRouter (MHC)

Criar:

```text
apps/crm-core/src/services/router.py
```

Conteúdo integral:

```python
import asyncio
import logging
from typing import Any, Dict, List

from src.processors.base import ProcessingResult
from src.processors.safety import SafetyProcessor
from src.processors.srv import SRVProcessor

logger = logging.getLogger(__name__)


class HyperRouter:
    """
    MHC: dispara especialistas em paralelo e agrega resultados.
    """

    def __init__(self) -> None:
        self.specialists = [
            SafetyProcessor(),
            SRVProcessor(),
        ]

    async def route_and_process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        trace_id = payload.get("trace_id", "unknown")
        logger.info("ROUTER start: trace_id=%s", trace_id)

        tasks = [agent.process(payload) for agent in self.specialists]
        results: List[Any] = await asyncio.gather(*tasks, return_exceptions=True)

        return self._aggregate(results)

    def _aggregate(self, results: List[Any]) -> Dict[str, Any]:
        aggregated: Dict[str, Any] = {}
        safety_block = False
        total_score_delta = 0

        for res in results:
            if isinstance(res, Exception):
                logger.exception("MHC specialist exception")
                aggregated.setdefault("errors", []).append(str(res))
                continue

            if isinstance(res, ProcessingResult):
                if res.processor_name == "safety" and res.status == "BLOCK":
                    safety_block = True
                    logger.warning("SAFETY BLOCK: %s", res.data)

                aggregated[res.processor_name] = res.data
                total_score_delta += int(res.score_impact or 0)

        return {
            "decision": "BLOCK" if safety_block else "PROCEED",
            "enriched_context": aggregated,
            "safety_score_delta": total_score_delta,
        }
```

---

### ✅ TAREFA 5 — Dispatcher (extensão compatível com OS 006)

Atualizar:

```text
apps/crm-core/src/services/dispatcher.py
```

Obrigatório:

- manter `emit()`
- manter `drain_once()` (se existir)
- adicionar `fetch_and_lock_pending`, `mark_success`, `mark_failure`

---

### ✅ TAREFA 6 — Worker blindado (idempotência + contrato + MHC)

Sobrescrever integralmente:

```text
apps/crm-core/src/workers/outbox_worker.py
```

Conteúdo integral:

```python
import asyncio
import logging
import os
from typing import Any, Dict

from src.database import get_db_session
from src.models.outbox import OutboxStatus
from src.services.dispatcher import EventDispatcher
from src.services.router import HyperRouter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = int(os.getenv("CRM_OUTBOX_POLL_INTERVAL", "2"))
BATCH_SIZE = int(os.getenv("CRM_OUTBOX_BATCH_SIZE", "25"))

router = HyperRouter()


def _normalize_payload(item: Any) -> Dict[str, Any]:
    """
    Salvaguarda 2: contrato rígido de payload para o Router.
    """
    raw = item.payload or {}
    return {
        "trace_id": item.trace_id,
        "ingest_event_id": raw.get("ingest_event_id"),
        "contact_id": raw.get("contact_id"),
        "raw_content": raw.get("raw_content", ""),
        "source": raw.get("source", "unknown"),
        "metadata": raw.get("metadata", {}),
    }


async def run_once() -> int:
    async with get_db_session() as db:
        dispatcher = EventDispatcher(db)

        items = await dispatcher.fetch_and_lock_pending(batch_size=BATCH_SIZE)
        if not items:
            await db.commit()
            return 0

        processed = 0

        for item in items:
            # Salvaguarda 1: double-check idempotência (mesmo após lock)
            if item.status == OutboxStatus.COMPLETED:
                continue

            payload = _normalize_payload(item)

            try:
                decision = await router.route_and_process(payload)

                if decision["decision"] == "BLOCK":
                    logger.warning(
                        "OUTBOX BLOCK: trace_id=%s context=%s",
                        item.trace_id,
                        decision.get("enriched_context"),
                    )
                else:
                    logger.info(
                        "OUTBOX PROCEED: trace_id=%s delta=%s",
                        item.trace_id,
                        decision.get("safety_score_delta"),
                    )

                await dispatcher.mark_success(item)
                processed += 1

            except Exception as e:
                logger.exception("OUTBOX processing failed: trace_id=%s", item.trace_id)
                await dispatcher.mark_failure(item, e)

        await db.commit()
        return processed


async def main() -> None:
    logger.info("OUTBOX MHC worker started (poll=%ss batch=%s)", POLL_INTERVAL_SECONDS, BATCH_SIZE)

    while True:
        try:
            n = await run_once()
            if n == 0:
                await asyncio.sleep(POLL_INTERVAL_SECONDS)
        except Exception:
            logger.exception("OUTBOX worker loop error")
            await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    asyncio.run(main())
```

---

### ✅ TAREFA 7 — Garantir que o `/ingest/message` grava payload completo para o Router

Atualizar:

```text
apps/crm-core/src/api/v1/ingest.py
```

Obrigatório: o payload emitido na outbox deve conter `raw_content` e `metadata`.

---

## 4️⃣ Critérios de Aceite (obrigatórios)

- [ ] `outbox_worker.py` roda sem erro e processa itens (`COMPLETED`)
- [ ] Paralelismo MHC confirmado por logs do Router (Safety + SRV na mesma execução)
- [ ] Payload normalizado sempre contém `trace_id`, `contact_id`, `raw_content`, `metadata`
- [ ] Em caso de falha, item vai para `FAILED` com `next_retry_at` calculado por `compute_next_retry`
- [ ] Evento com “cancelar/reclamar/procon” resulta em `decision=BLOCK`
- [ ] Gates do repo executados (PASS)
- [ ] OS registrada no Vault em:
  `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL.md`

