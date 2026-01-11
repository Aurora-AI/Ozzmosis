from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

GENESIS_CONTRACT_VERSION = "1.0"


ProductType = Literal["consortium", "insurance", "mixed"]


class GenesisIntent(BaseModel):
    """
    Canonical input from UI -> backend.

    No free-form text. Deterministic and schema-driven.
    """

    contract_version: str = Field(default=GENESIS_CONTRACT_VERSION)
    product_type: ProductType = Field(..., description="Product category selector")
    parameters: Dict[str, float] = Field(
        default_factory=dict,
        description="Numeric parameters only (e.g., value, term, rate).",
    )
    user_session_id: str = Field(..., min_length=6, description="Session identifier")


class DecisionStep(BaseModel):
    """
    A single deterministic step performed by tools/engine (no narrative reasoning).
    """

    tool_used: str = Field(..., min_length=1)
    input_data: Dict[str, Any] = Field(default_factory=dict)
    output_data: Dict[str, Any] = Field(default_factory=dict)
    reasoning: str = Field(default="Deterministic calculation")


class GenesisArtifact(BaseModel):
    """
    Canonical output: JSON artifact + optional PDF attachment info.
    """

    contract_version: str = Field(default=GENESIS_CONTRACT_VERSION)
    decision_id: str = Field(..., min_length=8)
    verdict: Dict[str, Any] = Field(default_factory=dict)
    steps: List[DecisionStep] = Field(default_factory=list)
    integrity_hash: str = Field(..., min_length=16, description="sha256:<hex>")
    pdf_ref: Optional[str] = Field(
        default=None,
        description="Optional reference to PDF stored internally (Vault path or internal id).",
    )
