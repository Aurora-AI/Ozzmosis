from typing import Any, Dict

from src.processors.base import BaseProcessor, ProcessingResult


class SRVProcessor(BaseProcessor):
    async def process(self, context: Dict[str, Any]) -> ProcessingResult:
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

