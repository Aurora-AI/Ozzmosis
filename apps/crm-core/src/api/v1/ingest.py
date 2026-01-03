from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Dict, Any
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.contact import Contact
from src.models.ingest_event import IngestEvent, IngestStatus
from src.services.dispatcher import EventDispatcher

router = APIRouter(prefix="/ingest", tags=["ingest"])


class IngestPayload(BaseModel):
    source: str = "whatsapp"
    sender_id: str
    content: str
    metadata: Dict[str, Any] = {}


@router.post("/message")
async def ingest_message(
    payload: IngestPayload,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Endpoint de ingestão universal.
    NÃO processa LLM.
    NÃO executa lógica pesada.
    Apenas registra intenção e enfileira raciocínio futuro.
    """

    trace_id = str(uuid.uuid4())

    identity_field = None
    identity_value = None
    if payload.source == "whatsapp":
        identity_field = Contact.whatsapp_id
        identity_value = payload.sender_id
    elif payload.source == "email":
        identity_field = Contact.email
        identity_value = payload.sender_id

    contact = None
    if identity_field is not None and identity_value:
        res = await db.execute(select(Contact).where(identity_field == identity_value).limit(1))
        contact = res.scalar_one_or_none()

    if contact is None:
        contact = Contact()
        if payload.source == "whatsapp":
            contact.whatsapp_id = payload.sender_id
        elif payload.source == "email":
            contact.email = payload.sender_id
        db.add(contact)
        await db.flush()

    event = IngestEvent(
        source=payload.source,
        sender_id=payload.sender_id,
        content=payload.content,
        metadata=payload.metadata or {},
        status=IngestStatus.RECEIVED,
    )
    db.add(event)
    await db.flush()

    event.contact_id = contact.id
    event.status = IngestStatus.LINKED

    dispatcher = EventDispatcher(db)
    outbox_payload = {
        "ingest_event_id": event.id,
        "contact_id": contact.id,
        "raw_content": payload.content,
        "source": payload.source,
        "sender_id": payload.sender_id,
        "content_len": len(payload.content),
        "metadata": payload.metadata or {},
    }
    outbox_entry = await dispatcher.emit("INGEST_RECEIVED", outbox_payload, trace_id)
    await db.flush()

    print(f"[INGEST] source={payload.source} sender={payload.sender_id} content_len={len(payload.content)}")

    return {
        "status": "accepted",
        "trace_id": trace_id,
        "event_id": event.id,
        "outbox_id": outbox_entry.id,
        "contact_id": contact.id,
    }
