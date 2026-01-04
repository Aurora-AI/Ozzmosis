import logging
from datetime import datetime, timezone
from typing import Any, Dict, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.outbox import EventOutbox, OutboxStatus

logger = logging.getLogger(__name__)


class EventDispatcher:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def emit(self, event_type: str, payload: Dict[str, Any], trace_id: str) -> EventOutbox:
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
        items = await self.fetch_and_lock_pending(batch_size=batch_size)
        if not items:
            return 0

        processed = 0
        for item in items:
            if item.status == OutboxStatus.COMPLETED:
                continue
            try:
                await self.mark_success(item)
                processed += 1
            except Exception as e:  # pragma: no cover
                await self.mark_failure(item, e)

        return processed

    async def fetch_and_lock_pending(self, batch_size: int = 25) -> List[EventOutbox]:
        """
        Busca e trava eventos pendentes/failed, marcando como PROCESSING
        (pessimistic lock + SKIP LOCKED). Retorna itens para processamento.
        """
        now = datetime.now(timezone.utc)

        base_stmt = (
            select(EventOutbox)
            .where(EventOutbox.next_retry_at <= now)
            .where(EventOutbox.status.in_([OutboxStatus.PENDING, OutboxStatus.FAILED]))
            .order_by(EventOutbox.created_at.asc())
            .limit(batch_size)
        )

        try:
            stmt = base_stmt.with_for_update(skip_locked=True)
            res = await self.db.execute(stmt)
        except Exception:
            res = await self.db.execute(base_stmt)

        items = list(res.scalars().all())

        for item in items:
            if item.status == OutboxStatus.COMPLETED:
                continue

            item.status = OutboxStatus.PROCESSING
            item.attempts = int(item.attempts or 0) + 1
            item.last_error = None

        return items

    async def mark_success(self, item: EventOutbox) -> None:
        item.status = OutboxStatus.COMPLETED
        item.processed_at = datetime.now(timezone.utc)

    async def mark_failure(self, item: EventOutbox, err: Exception) -> None:
        item.last_error = str(err)
        item.status = OutboxStatus.FAILED
        item.next_retry_at = EventOutbox.compute_next_retry(int(item.attempts or 0))
