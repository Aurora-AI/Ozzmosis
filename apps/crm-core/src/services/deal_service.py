from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from src.models.deal import Deal, DealStage
from src.schemas.life_map import LifeMapIn
from src.schemas.proposal import ProposalTier
from src.services.state_machine import PipelineGovernor

logger = logging.getLogger(__name__)


class DealService:
    """
    Único responsável por materializar decisões no domínio (Deal).
    Não “pensa”; aplica regras determinísticas e obedece ao PipelineGovernor.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_active_deal(
        self,
        contact_id: str,
        *,
        pipeline_type: str = "rodobens_wealth",
        title: Optional[str] = None,
    ) -> Deal:
        """
        Localiza o Deal ativo mais recente (não encerrado) ou cria um novo.
        """
        stmt = (
            select(Deal)
            .where(Deal.contact_id == contact_id)
            .where(Deal.stage.notin_([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]))
            .order_by(Deal.created_at.desc())
        )
        res = await self.db.execute(stmt)
        deal = res.scalars().first()

        if deal:
            return deal

        deal = Deal(
            contact_id=contact_id,
            title=title or f"Novo Negócio - {pipeline_type}",
            pipeline_type=pipeline_type,
            stage=DealStage.NEW,
            srv_matrix={},
            product_data={},
            safety_score=100,
        )
        self.db.add(deal)
        await self.db.flush()
        logger.info("Deal created: deal_id=%s contact_id=%s", deal.id, contact_id)
        return deal

    async def get_deal(self, deal_id: str) -> Deal | None:
        stmt = select(Deal).where(Deal.id == deal_id)
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def get_active_deal_for_contact(self, contact_id: str) -> Deal | None:
        stmt = (
            select(Deal)
            .where(Deal.contact_id == contact_id)
            .where(Deal.stage.notin_([DealStage.CLOSED_WON, DealStage.CLOSED_LOST]))
            .order_by(Deal.created_at.desc())
        )
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def apply_mhc_decision(
        self,
        deal: Deal,
        decision_data: Dict[str, Any],
        *,
        trace_id: str,
        ingest_event_id: Optional[str],
    ) -> None:
        """
        Aplica o output do MHC no Deal, de forma determinística e auditável.

        decision_data:
          {
            "decision": "BLOCK"|"PROCEED",
            "enriched_context": {...},
            "safety_score_delta": int
          }
        """
        decision = str(decision_data.get("decision") or "PROCEED").upper()
        enriched = decision_data.get("enriched_context") or {}
        delta = int(decision_data.get("safety_score_delta") or 0)

        srv_updates = enriched.get("srv_extractor") or {}
        if srv_updates:
            current_srv = dict(deal.srv_matrix or {})
            current_srv.update(dict(srv_updates))
            deal.srv_matrix = current_srv
            flag_modified(deal, "srv_matrix")

        current_score = int(deal.safety_score or 100)
        new_score = max(0, min(100, current_score + delta))
        deal.safety_score = new_score

        if decision == "BLOCK":
            target = DealStage.CHURN_ALERT
            if PipelineGovernor.can_advance(deal, target):
                deal.stage = target
            else:
                logger.warning(
                    "Governor denied BLOCK transition: deal_id=%s from=%s to=%s",
                    deal.id,
                    deal.stage,
                    target,
                )
        else:
            if deal.stage == DealStage.NEW:
                target = DealStage.DISCOVERY
                if PipelineGovernor.can_advance(deal, target):
                    deal.stage = target

        pd = dict(deal.product_data or {})
        pd["last_decision"] = {
            "trace_id": trace_id,
            "ingest_event_id": ingest_event_id,
            "decision": decision,
            "delta": delta,
            "safety_score_after": int(deal.safety_score or 100),
            "stage_after": str(deal.stage.value if hasattr(deal.stage, "value") else deal.stage),
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        }
        deal.product_data = pd
        flag_modified(deal, "product_data")

    async def attach_life_map(self, deal: Deal, life_map: LifeMapIn) -> Deal:
        current_version = int(deal.life_map_version or 0)

        deal.life_map = life_map.model_dump()
        deal.life_map_version = current_version + 1
        deal.life_map_updated_at = datetime.now(timezone.utc)
        flag_modified(deal, "life_map")

        return deal

    async def accept_proposal(
        self,
        deal_id: str,
        accepted_tier: str,
        client_fingerprint: Optional[str],
        decision_timestamp: Optional[datetime],
    ) -> Deal:
        deal = await self.get_deal(deal_id)
        if not deal:
            raise ValueError("deal_not_found")

        if not deal.proposals:
            raise ValueError("proposals_missing")

        if deal.accepted_tier or int(deal.acceptance_version or 0) > 0:
            raise ValueError("already_accepted")

        try:
            tier = ProposalTier(str(accepted_tier).upper())
        except Exception as e:
            raise ValueError("invalid_tier") from e

        bundles = (deal.proposals or {}).get("bundles") or []
        chosen = None
        for b in bundles:
            if str((b or {}).get("tier") or "").upper() == tier.value:
                chosen = b
                break
        if not chosen:
            raise ValueError("tier_not_found")

        accepted_at = decision_timestamp or datetime.now(timezone.utc)

        snapshot = {
            "accepted_tier": tier.value,
            "accepted_at": accepted_at.isoformat(),
            "client_fingerprint": client_fingerprint,
            "source": "frontend",
            "proposal_version_at_acceptance": int(deal.proposals_version or 0),
            "life_map_version_at_acceptance": int(deal.life_map_version or 0),
            "bundle": chosen,
        }

        deal.accepted_tier = tier.value
        deal.accepted_at = accepted_at
        deal.client_fingerprint = client_fingerprint
        deal.accepted_proposal_data = snapshot
        deal.acceptance_version = 1

        flag_modified(deal, "accepted_proposal_data")

        if deal.stage != DealStage.NEGOTIATION:
            if deal.stage != DealStage.PROPOSAL:
                if PipelineGovernor.can_advance(deal, DealStage.PROPOSAL):
                    deal.stage = DealStage.PROPOSAL
                else:
                    raise ValueError(f"stage_transition_denied:{deal.stage.value}->PROPOSAL")

            if PipelineGovernor.can_advance(deal, DealStage.NEGOTIATION):
                deal.stage = DealStage.NEGOTIATION
            else:
                raise ValueError(f"stage_transition_denied:{deal.stage.value}->NEGOTIATION")

        await self.db.flush()
        return deal
