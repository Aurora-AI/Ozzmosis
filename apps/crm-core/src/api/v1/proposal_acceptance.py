from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.proposal_acceptance import AcceptProposalIn, AcceptProposalOut
from src.services.deal_service import DealService

router = APIRouter(prefix="/proposals", tags=["proposals"])


@router.post("/{deal_id}/accept", response_model=AcceptProposalOut)
async def accept_proposal(
    deal_id: str,
    payload: AcceptProposalIn,
    db: AsyncSession = Depends(get_db),
) -> AcceptProposalOut:
    svc = DealService(db)
    try:
        deal = await svc.accept_proposal(
            deal_id=deal_id,
            accepted_tier=payload.accepted_tier,
            client_fingerprint=payload.client_device_fingerprint,
            decision_timestamp=payload.decision_timestamp,
        )
        await db.commit()
        return AcceptProposalOut(
            deal_id=deal.id,
            accepted_tier=str(deal.accepted_tier or ""),
            accepted_at=(deal.accepted_at.isoformat() if deal.accepted_at else ""),
            stage=str(deal.stage.value if hasattr(deal.stage, "value") else deal.stage),
            acceptance_version=int(deal.acceptance_version or 0),
        )
    except ValueError as e:
        code = str(e)
        if code == "deal_not_found":
            raise HTTPException(status_code=404, detail="deal_not_found")
        if code == "proposals_missing":
            raise HTTPException(status_code=409, detail="proposals_missing")
        if code in ("invalid_tier", "tier_not_found"):
            raise HTTPException(status_code=400, detail=code)
        if code == "already_accepted":
            raise HTTPException(status_code=409, detail="already_accepted")
        if code.startswith("stage_transition_denied:"):
            raise HTTPException(status_code=409, detail=code)
        raise
