from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.contact import Contact
from src.schemas.life_map import FinancialComparison, LifeMapIn
from src.schemas.read_models import DealOut
from src.services.deal_service import DealService
from src.services.math_engine import BankModelConfig, WealthMathEngine

router = APIRouter(prefix="/life-map", tags=["life-map"])


@router.post("/compare", response_model=FinancialComparison)
async def compare(payload: LifeMapIn) -> FinancialComparison:
    if not payload.goals:
        return FinancialComparison(
            total_bank_cost=0.0,
            total_aurora_cost=0.0,
            net_savings=0.0,
            efficiency_gain_pct=0.0,
        )

    amount = max(g.target_value for g in payload.goals)
    months = max(1, max(g.deadline_years for g in payload.goals) * 12)

    cfg = BankModelConfig(bank_rate_year=0.18, months=months)
    return WealthMathEngine.compare_bank_vs_consorcio(amount=amount, config_bank=cfg)


@router.post("", response_model=DealOut)
async def persist_life_map(
    payload: LifeMapIn,
    contact_id: str,
    db: AsyncSession = Depends(get_db),
) -> DealOut:
    res = await db.execute(select(Contact).where(Contact.id == contact_id).limit(1))
    contact = res.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="contact_not_found")

    svc = DealService(db)
    deal = await svc.get_active_deal_for_contact(contact_id)
    if not deal:
        deal = await svc.get_or_create_active_deal(contact_id)

    await svc.attach_life_map(deal, payload)
    await db.commit()
    await db.refresh(deal)

    return DealOut.model_validate(deal)
