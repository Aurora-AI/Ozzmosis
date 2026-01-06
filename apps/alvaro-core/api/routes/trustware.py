from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.shield.enforcer import enforce_shield
from services.trustware.engine import TrustwareEngine

router = APIRouter(tags=["trustware"])

engine = TrustwareEngine()


class ValidationRequest(BaseModel):
    product_key: str = Field(..., min_length=3)
    user_intent: str = Field(..., min_length=1)


@router.post("/validate")
async def validate_intent(request: ValidationRequest):
    """
    Endpoint publico para o Front validar intencao vs. regras estaticas (template).
    """
    try:
        enforce_shield()
        result = engine.validate_fit(request.product_key, request.user_intent)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
