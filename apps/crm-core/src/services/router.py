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

