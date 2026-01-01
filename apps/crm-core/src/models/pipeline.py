from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Deal(Base):
    __tablename__ = "pipeline_deals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scope_id: Mapped[str] = mapped_column(String(128), index=True)

    title: Mapped[str] = mapped_column(String(256))
    customer_org_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    stage: Mapped[str] = mapped_column(String(32), index=True)  # lead|qualified|quotation|proposal|approved|contracted|lost
    value_estimate: Mapped[Optional[float]] = mapped_column(Numeric(18, 2))
    currency: Mapped[Optional[str]] = mapped_column(String(8))
    owner_subject_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    metadata_json: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)


class Approval(Base):
    __tablename__ = "pipeline_approvals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scope_id: Mapped[str] = mapped_column(String(128), index=True)
    deal_id: Mapped[int] = mapped_column(ForeignKey("pipeline_deals.id", ondelete="CASCADE"), index=True)

    approval_type: Mapped[str] = mapped_column(String(64), index=True)  # legal|compliance|board|etc
    status: Mapped[str] = mapped_column(String(16), index=True)  # pending|approved|rejected

    requested_by: Mapped[str] = mapped_column(String(128), index=True)
    requested_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, index=True)

    decided_by: Mapped[Optional[str]] = mapped_column(String(128), index=True)
    decided_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=False), index=True)
    reason: Mapped[Optional[str]] = mapped_column(String(256))
