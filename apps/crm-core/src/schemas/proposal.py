from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List

from pydantic import BaseModel, ConfigDict, Field


class ProposalTier(str, Enum):
    ESSENTIAL = "ESSENTIAL"
    WEALTH = "WEALTH"
    LEGACY = "LEGACY"


class ProposalItem(BaseModel):
    product_type: str
    value: float = 0.0
    monthly_cost: float = 0.0
    description: str = ""
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProposalBundle(BaseModel):
    tier: ProposalTier
    items: List[ProposalItem] = Field(default_factory=list)
    total_monthly_investment: float = 0.0
    projected_patrimony_10y: float = 0.0
    protection_value: float = 0.0
    notes: List[str] = Field(default_factory=list)


class ProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    deal_id: str
    life_map_version: int
    proposals_version: int
    bundles: List[ProposalBundle]
    generated_at: str

