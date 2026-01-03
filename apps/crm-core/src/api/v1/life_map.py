from fastapi import APIRouter

from src.schemas.life_map import FinancialComparison, LifeMapIn
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

