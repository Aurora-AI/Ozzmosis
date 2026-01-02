from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scope_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    event_type: Mapped[str] = mapped_column(String(128), index=True)
    actor_id: Mapped[str] = mapped_column(String(128), index=True)

    resource_type: Mapped[Optional[str]] = mapped_column(String(128), index=True)
    resource_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    decision: Mapped[Optional[str]] = mapped_column(String(16))
    reason: Mapped[Optional[str]] = mapped_column(String(256))

    payload_json: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)
