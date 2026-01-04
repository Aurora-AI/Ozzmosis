from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from src.models.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Contact(Base):
    __tablename__ = "crm_contacts"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=True)

    whatsapp_id = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    cpf_cnpj = Column(String, unique=True, nullable=True)

    ai_memory = Column(JSON, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    deals = relationship("Deal", back_populates="contact")

