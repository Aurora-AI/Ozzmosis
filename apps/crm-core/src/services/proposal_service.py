from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from src.models.deal import Deal
from src.schemas.life_map import LifeGoal, LifeMapIn
from src.schemas.proposal import ProposalBundle, ProposalItem, ProposalOut, ProposalTier
from src.services.math_engine import BankModelConfig, ConsorcioModelConfig, WealthMathEngine
from src.services.proposal_policy import ProposalPolicy

logger = logging.getLogger(__name__)


def _now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _pick_primary_goal(goals: List[LifeGoal]) -> LifeGoal:
    return max(goals, key=lambda g: float(g.target_value))


def _goal_kind(goal: LifeGoal) -> str:
    title = (goal.title or "").lower()
    service_keywords = ("viagem", "curso", "tratamento", "saude", "saúde", "educacao", "educação", "faculdade")
    if any(k in title for k in service_keywords):
        return "service"
    return "property"


class ProposalService:
    def __init__(self, db: AsyncSession, policy: Optional[ProposalPolicy] = None):
        self.db = db
        self.policy = policy or ProposalPolicy()

    async def _get_deal(self, deal_id: str) -> Deal | None:
        stmt = select(Deal).where(Deal.id == deal_id)
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def get_by_deal(self, deal_id: str) -> ProposalOut | None:
        deal = await self._get_deal(deal_id)
        if not deal or not deal.proposals:
            return None
        return ProposalOut.model_validate(deal.proposals)

    async def generate_and_persist(self, deal_id: str) -> ProposalOut:
        deal = await self._get_deal(deal_id)
        if not deal:
            raise ValueError("deal_not_found")
        if not deal.life_map:
            raise ValueError("life_map_missing")

        life_map = LifeMapIn.model_validate(deal.life_map)
        bundles = self._generate_bundles(life_map)

        current_version = int(deal.proposals_version or 0)
        next_version = current_version + 1

        out = ProposalOut(
            deal_id=deal.id,
            life_map_version=int(deal.life_map_version or 0),
            proposals_version=next_version,
            bundles=bundles,
            generated_at=_now_utc_iso(),
        )

        deal.proposals = out.model_dump()
        deal.proposals_version = next_version
        deal.proposals_updated_at = datetime.now(timezone.utc)
        flag_modified(deal, "proposals")

        await self.db.flush()
        logger.info("Proposals persisted: deal_id=%s proposals_version=%s", deal.id, next_version)
        return out

    def _insurance_items(self, monthly_capacity: float, dependents: int, tier: ProposalTier) -> Tuple[List[ProposalItem], float, List[str]]:
        items: List[ProposalItem] = []
        notes: List[str] = []

        if dependents <= 0:
            return items, 0.0, notes

        term = max(self.policy.min_insurance_monthly, monthly_capacity * self.policy.insurance_term_ratio_of_capacity)
        prestamista = monthly_capacity * self.policy.insurance_prestamista_ratio_of_capacity

        protection_value = 0.0
        items.append(
            ProposalItem(
                product_type="insurance_life_term",
                value=0.0,
                monthly_cost=round(term, 2),
                description="Seguro de vida termo (estimativa determinística; sem cotação real).",
                metadata={"dependents": dependents},
            )
        )
        protection_value += 1.0

        items.append(
            ProposalItem(
                product_type="insurance_prestamista",
                value=0.0,
                monthly_cost=round(prestamista, 2),
                description="Seguro prestamista (estimativa determinística; sem cotação real).",
                metadata={"dependents": dependents},
            )
        )
        protection_value += 1.0

        if tier in (ProposalTier.WEALTH, ProposalTier.LEGACY):
            ci = monthly_capacity * self.policy.insurance_critical_illness_ratio_of_capacity
            items.append(
                ProposalItem(
                    product_type="insurance_critical_illness",
                    value=0.0,
                    monthly_cost=round(ci, 2),
                    description="Seguro doença grave (estimativa determinística; sem cotação real).",
                    metadata={"dependents": dependents},
                )
            )
            protection_value += 1.0

        notes.append("Proteção estimada por policy (sem cotação real).")
        return items, protection_value, notes

    def _consorcio_item(
        self,
        *,
        goal: LifeGoal,
        monthly_budget: float,
        tier: ProposalTier,
        consorcio_fee_rate_total: float,
        bank_rate_year: float,
    ) -> Tuple[ProposalItem, List[str]]:
        months = max(1, int(goal.deadline_years) * 12)
        cons_cfg = ConsorcioModelConfig(fee_rate_total=consorcio_fee_rate_total)

        aurora_total = float(goal.target_value) * (1.0 + cons_cfg.fee_rate_total)
        monthly_cost_raw = aurora_total / months
        monthly_cost = min(monthly_cost_raw, monthly_budget)

        cfg_bank = BankModelConfig(bank_rate_year=bank_rate_year, months=months)
        comparison = WealthMathEngine.compare_bank_vs_consorcio(
            amount=float(goal.target_value),
            config_bank=cfg_bank,
            config_consorcio=cons_cfg,
        )

        kind = _goal_kind(goal)
        product_type = "consortium_property" if kind == "property" else "consortium_service"

        notes: List[str] = []
        if monthly_cost < monthly_cost_raw:
            notes.append("Mensalidade de consórcio capada pelo orçamento (policy).")

        if tier in (ProposalTier.WEALTH, ProposalTier.LEGACY) and product_type == "consortium_property":
            notes.append("Inclui tese de lance embutido/plano pontual (metadata).")

        return (
            ProposalItem(
                product_type=product_type,
                value=float(goal.target_value),
                monthly_cost=round(monthly_cost, 2),
                description=f"Consórcio para objetivo: {goal.title}",
                metadata={
                    "goal_id": goal.id,
                    "deadline_years": int(goal.deadline_years),
                    "fee_rate_total": cons_cfg.fee_rate_total,
                    "monthly_cost_raw": round(monthly_cost_raw, 2),
                    "bank_vs_consorcio": comparison.model_dump(),
                    "strategy": "lance_embutido" if tier in (ProposalTier.WEALTH, ProposalTier.LEGACY) else "baseline",
                },
            ),
            notes,
        )

    def _reserve_services_item(self, monthly_budget: float) -> ProposalItem:
        reserve_value = _clamp(
            monthly_budget * 24.0,
            self.policy.reserve_services_value_min,
            self.policy.reserve_services_value_max,
        )
        months = 36
        fee = self.policy.consorcio_fee_rate_total_default
        monthly_cost = min((reserve_value * (1.0 + fee)) / months, monthly_budget)
        return ProposalItem(
            product_type="consortium_service_reserve",
            value=round(reserve_value, 2),
            monthly_cost=round(monthly_cost, 2),
            description="Reserva modular via consórcio de serviços (estimativa determinística).",
            metadata={"months": months, "fee_rate_total": fee},
        )

    def _bundle_budget(self, capacity: float, tier: ProposalTier) -> float:
        if capacity <= 0:
            return 0.0
        ratio = {
            ProposalTier.ESSENTIAL: self.policy.essential_budget_ratio,
            ProposalTier.WEALTH: self.policy.wealth_budget_ratio,
            ProposalTier.LEGACY: self.policy.legacy_budget_ratio,
        }[tier]
        return round(capacity * ratio, 2)

    def _finalize_bundle(self, tier: ProposalTier, items: List[ProposalItem], protection_value: float, notes: List[str]) -> ProposalBundle:
        total_monthly = round(sum(float(i.monthly_cost or 0.0) for i in items), 2)
        projected = round(total_monthly * 120.0 * self.policy.patrimony_growth_factor_10y, 2)
        return ProposalBundle(
            tier=tier,
            items=items,
            total_monthly_investment=total_monthly,
            projected_patrimony_10y=projected,
            protection_value=round(protection_value, 2),
            notes=notes,
        )

    def _generate_bundles(self, life_map: LifeMapIn) -> List[ProposalBundle]:
        capacity = float(life_map.monthly_capacity or 0.0)
        dependents = int(life_map.dependents or 0)
        goals = list(life_map.goals or [])
        primary_goal = _pick_primary_goal(goals) if goals else None

        bundles: List[ProposalBundle] = []

        for tier in (ProposalTier.ESSENTIAL, ProposalTier.WEALTH, ProposalTier.LEGACY):
            budget = self._bundle_budget(capacity, tier)
            items: List[ProposalItem] = []
            notes: List[str] = []
            protection_value = 0.0

            insurance_items, protection_value, insurance_notes = self._insurance_items(capacity, dependents, tier)
            items.extend(insurance_items)
            notes.extend(insurance_notes)

            remaining = max(0.0, budget - sum(i.monthly_cost for i in items))

            if primary_goal and remaining > 0:
                cons_item, cons_notes = self._consorcio_item(
                    goal=primary_goal,
                    monthly_budget=remaining,
                    tier=tier,
                    consorcio_fee_rate_total=self.policy.consorcio_fee_rate_total_default,
                    bank_rate_year=self.policy.bank_rate_year_default,
                )
                items.append(cons_item)
                notes.extend(cons_notes)
                remaining = max(0.0, budget - sum(i.monthly_cost for i in items))

            if tier in (ProposalTier.WEALTH, ProposalTier.LEGACY) and remaining > 0:
                items.append(self._reserve_services_item(remaining))
                remaining = max(0.0, budget - sum(i.monthly_cost for i in items))

            if tier == ProposalTier.LEGACY and len(goals) > 1 and remaining > 0:
                secondary_goal = sorted(goals, key=lambda g: float(g.target_value), reverse=True)[1]
                cons_item, cons_notes = self._consorcio_item(
                    goal=secondary_goal,
                    monthly_budget=remaining,
                    tier=tier,
                    consorcio_fee_rate_total=self.policy.consorcio_fee_rate_total_default,
                    bank_rate_year=self.policy.bank_rate_year_default,
                )
                items.append(cons_item)
                notes.extend(cons_notes)

            notes.append("Proposta determinística (Proposal as Code); sem cotação real nesta fase.")
            notes.append(f"Budget cap aplicado: {budget} (<= monthly_capacity={capacity}).")
            bundles.append(self._finalize_bundle(tier, items, protection_value, notes))

        return bundles

