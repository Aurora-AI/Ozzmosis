from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

class AcceptProposalIn(BaseModel):
    accepted_tier: str = Field(..., min_length=1)
    client_device_fingerprint: Optional[str] = None
    decision_timestamp: Optional[datetime] = None


class AcceptProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    deal_id: str
    accepted_tier: str
    accepted_at: str
    stage: str
    acceptance_version: int = Field(ge=0)
