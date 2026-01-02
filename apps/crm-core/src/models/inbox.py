from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Conversation(Base):
    __tablename__ = "inbox_conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scope_id: Mapped[str] = mapped_column(String(128), index=True)

    status: Mapped[str] = mapped_column(String(32), index=True)  # open|pending|closed
    subject: Mapped[Optional[str]] = mapped_column(String(256))

    source: Mapped[str] = mapped_column(String(64), index=True)
    external_ref: Mapped[Optional[str]] = mapped_column(String(256), index=True)

    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=False), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)


class Message(Base):
    __tablename__ = "inbox_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scope_id: Mapped[str] = mapped_column(String(128), index=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("inbox_conversations.id", ondelete="CASCADE"), index=True)

    direction: Mapped[str] = mapped_column(String(16), index=True)  # inbound|outbound
    author_type: Mapped[str] = mapped_column(String(16), index=True)  # user|service|external
    author_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    body: Mapped[str] = mapped_column(Text)
    external_ref: Mapped[Optional[str]] = mapped_column(String(256), index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)
