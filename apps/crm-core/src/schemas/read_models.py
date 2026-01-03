from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: Optional[str] = None
    whatsapp_id: Optional[str] = None
    email: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    ai_memory: Dict[str, Any] = Field(default_factory=dict)


class DealOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contact_id: str
    title: str
    pipeline_type: str
    stage: str
    amount: float = 0.0
    srv_matrix: Dict[str, Any] = Field(default_factory=dict)
    product_data: Dict[str, Any] = Field(default_factory=dict)
    safety_score: int = 100
    life_map: Dict[str, Any] = Field(default_factory=dict)
    life_map_version: int = 0
    life_map_updated_at: Optional[str] = None

    @field_validator("stage", mode="before")
    @classmethod
    def _stage_to_value(cls, value: Any) -> Any:
        if hasattr(value, "value"):
            return value.value
        return value

    @field_validator("life_map", mode="before")
    @classmethod
    def _life_map_default(cls, value: Any) -> Any:
        return value or {}

    @field_validator("life_map_updated_at", mode="before")
    @classmethod
    def _life_map_updated_at_to_str(cls, value: Any) -> Any:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value.isoformat()
        return str(value)
