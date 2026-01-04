import enum
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import Column, DateTime, Enum, Integer, JSON, String, Text
from sqlalchemy.sql import func

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class OutboxStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class EventOutbox(Base):
    """
    Transactional Outbox (CRM):
    - Eventos são registrados na mesma transação do endpoint.
    - Worker drena a fila com lock + retry.
    """

    __tablename__ = "crm_event_outbox"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)

    event_type = Column(String, nullable=False, index=True)  # ex: INGEST_RECEIVED
    payload = Column(JSON, nullable=False)

    status = Column(Enum(OutboxStatus), nullable=False, default=OutboxStatus.PENDING, index=True)
    attempts = Column(Integer, nullable=False, default=0)
    last_error = Column(Text, nullable=True)

    trace_id = Column(String, index=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)

    next_retry_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @staticmethod
    def compute_next_retry(attempts: int) -> datetime:
        schedule = [0, 5, 15, 45, 120, 300]
        idx = min(attempts, len(schedule) - 1)
        return datetime.now(timezone.utc) + timedelta(seconds=schedule[idx])

