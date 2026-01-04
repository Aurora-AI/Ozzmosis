from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.read_models import DealOut
from src.services.deal_service import DealService

router = APIRouter(prefix="/deals", tags=["deals"])


@router.get("/active/by-contact/{contact_id}", response_model=DealOut)
async def get_active_deal_by_contact(contact_id: str, db: AsyncSession = Depends(get_db)) -> DealOut:
    svc = DealService(db)
    deal = await svc.get_active_deal_for_contact(contact_id)
    if not deal:
        raise HTTPException(status_code=404, detail="deal_not_found")
    return DealOut.model_validate(deal)


@router.get("/{deal_id}", response_model=DealOut)
async def get_deal(deal_id: str, db: AsyncSession = Depends(get_db)) -> DealOut:
    svc = DealService(db)
    deal = await svc.get_deal(deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="deal_not_found")
    return DealOut.model_validate(deal)

