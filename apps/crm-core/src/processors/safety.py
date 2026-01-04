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

