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
