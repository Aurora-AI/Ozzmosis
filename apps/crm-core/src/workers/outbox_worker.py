import asyncio
import logging
import os

from src.database import get_db_session
from src.services.dispatcher import EventDispatcher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = int(os.getenv("CRM_OUTBOX_POLL_INTERVAL", "2"))
BATCH_SIZE = int(os.getenv("CRM_OUTBOX_BATCH_SIZE", "25"))


async def run_once() -> int:
    async with get_db_session() as db:
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

