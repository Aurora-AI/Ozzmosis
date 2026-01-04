from sqlalchemy import Column, String, ForeignKey, JSON, DateTime, Enum, Float, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class DealStage(str, enum.Enum):
    NEW = "NEW"
    DISCOVERY = "DISCOVERY"
    QUALIFIED = "QUALIFIED"
    PROPOSAL = "PROPOSAL"
    NEGOTIATION = "NEGOTIATION"
    CLOSED_WON = "CLOSED_WON"
    CLOSED_LOST = "CLOSED_LOST"
    CHURN_ALERT = "CHURN_ALERT"


class Deal(Base):
    __tablename__ = "crm_deals"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    contact_id = Column(String, ForeignKey("crm_contacts.id"), nullable=False, index=True)

    title = Column(String, nullable=False)
    pipeline_type = Column(String, default="rodobens_wealth", index=True)
    stage = Column(Enum(DealStage), default=DealStage.NEW, index=True)

    amount = Column(Float, default=0.0)
    expected_close_date = Column(DateTime(timezone=True), nullable=True)

    srv_matrix = Column(JSON, default=dict)
    product_data = Column(JSON, default=dict)

    # --- LIFE MAP (VERDADE VERSIONADA) ---
    # JSONB no Postgres; JSON em SQLite/runner
    life_map = Column(JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=None)
    life_map_version = Column(Integer, nullable=False, default=0)
    life_map_updated_at = Column(DateTime(timezone=True), nullable=True)

    # --- PROPOSALS (VERDADE VERSIONADA) ---
    # JSONB no Postgres; JSON em SQLite/runner
    proposals = Column(JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=None)
    proposals_version = Column(Integer, nullable=False, default=0)
    proposals_updated_at = Column(DateTime(timezone=True), nullable=True)

    # --- ACCEPTANCE (CARIMBO FORENSE) ---
    accepted_tier = Column(String, nullable=True, default=None)
    accepted_proposal_data = Column(JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=None)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    client_fingerprint = Column(String, nullable=True, default=None)
    acceptance_version = Column(Integer, nullable=False, default=0)

    safety_score = Column(Integer, default=100)
    compliance_flags = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    contact = relationship("Contact", back_populates="deals")
