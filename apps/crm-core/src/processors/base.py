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

