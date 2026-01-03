from sqlalchemy import Column, String, JSON, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
import enum
import uuid

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class IngestStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    LINKED = "LINKED"
    ERROR = "ERROR"


class IngestEvent(Base):
    __tablename__ = "crm_ingest_events"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)

    source = Column(String, default="whatsapp", index=True)
    sender_id = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    metadata_ = Column("metadata", JSON, default=dict)

    contact_id = Column(String, ForeignKey("crm_contacts.id"), nullable=True, index=True)
    status = Column(Enum(IngestStatus), default=IngestStatus.RECEIVED, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
