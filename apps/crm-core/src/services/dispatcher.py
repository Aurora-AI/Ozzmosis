import logging
from datetime import datetime, timezone
from typing import Any, Dict

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
        if not items:
            return 0

        processed = 0
        for item in items:
            item.status = OutboxStatus.PROCESSING
            item.attempts = int(item.attempts or 0) + 1
            item.last_error = None

            try:
                item.status = OutboxStatus.COMPLETED
                item.processed_at = now
                processed += 1

            except Exception as e:  # pragma: no cover
                item.last_error = str(e)
                item.status = OutboxStatus.FAILED
                item.next_retry_at = EventOutbox.compute_next_retry(item.attempts)
                logger.exception("OUTBOX failed: id=%s trace_id=%s", item.id, item.trace_id)

        return processed

