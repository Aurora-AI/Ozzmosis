from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/ingest", tags=["ingest"])


class IngestPayload(BaseModel):
    source: str = "whatsapp"
    sender_id: str
    content: str
    metadata: Dict[str, Any] = {}


@router.post("/message")
async def ingest_message(payload: IngestPayload, background_tasks: BackgroundTasks):
    """
    Endpoint de ingestão universal.
    NÃO processa LLM.
    NÃO executa lógica pesada.
    Apenas registra intenção e enfileira raciocínio futuro.
    """

    print(
        f"[INGEST] source={payload.source} "
        f"sender={payload.sender_id} "
        f"content_len={len(payload.content)}"
    )

    return {
        "status": "queued",
        "action": "ai_analysis_started",
        "sender_id": payload.sender_id,
    }

