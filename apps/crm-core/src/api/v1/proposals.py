from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.proposal import ProposalOut
from src.services.proposal_service import ProposalService

router = APIRouter(prefix="/proposals", tags=["proposals"])


@router.post("/generate", response_model=ProposalOut)
async def generate_and_persist(deal_id: str, db: AsyncSession = Depends(get_db)) -> ProposalOut:
    svc = ProposalService(db)
    try:
        out = await svc.generate_and_persist(deal_id)
        await db.commit()
        return out
    except ValueError as e:
        code = str(e)
        if code == "deal_not_found":
            raise HTTPException(status_code=404, detail="deal_not_found")
        if code == "life_map_missing":
            raise HTTPException(status_code=409, detail="life_map_missing")
        raise


@router.get("/by-deal/{deal_id}", response_model=ProposalOut)
async def get_by_deal(deal_id: str, db: AsyncSession = Depends(get_db)) -> ProposalOut:
    svc = ProposalService(db)
    out = await svc.get_by_deal(deal_id)
    if not out:
        raise HTTPException(status_code=404, detail="proposal_not_found")
    return out

