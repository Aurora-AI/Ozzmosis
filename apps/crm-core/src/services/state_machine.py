from __future__ import annotations

from src.models.deal import Deal, DealStage


class PipelineGovernor:
    """
    Governa transições de estágio.
    A IA pode sugerir, mas o Python valida a permissão.

    Regras:
    - Bloqueia regressão de estágio.
    - Permite apenas transições previstas (mapa explícito).
    - Aplica regras determinísticas baseadas no dado persistido (Deal).
    """

    _ORDER = [
        DealStage.NEW,
        DealStage.DISCOVERY,
        DealStage.QUALIFIED,
        DealStage.PROPOSAL,
        DealStage.NEGOTIATION,
        DealStage.CLOSED_WON,
        DealStage.CLOSED_LOST,
        DealStage.CHURN_ALERT,
    ]
    _INDEX = {stage: i for i, stage in enumerate(_ORDER)}

    _ALLOWED = {
        DealStage.NEW: {DealStage.DISCOVERY, DealStage.CLOSED_LOST},
        DealStage.DISCOVERY: {DealStage.QUALIFIED, DealStage.CLOSED_LOST, DealStage.CHURN_ALERT},
        DealStage.QUALIFIED: {DealStage.PROPOSAL, DealStage.CLOSED_LOST, DealStage.CHURN_ALERT},
        DealStage.PROPOSAL: {DealStage.NEGOTIATION, DealStage.CLOSED_LOST, DealStage.CHURN_ALERT},
        DealStage.NEGOTIATION: {DealStage.CLOSED_WON, DealStage.CLOSED_LOST, DealStage.CHURN_ALERT},
        DealStage.CLOSED_WON: set(),
        DealStage.CLOSED_LOST: set(),
        DealStage.CHURN_ALERT: {DealStage.DISCOVERY, DealStage.NEGOTIATION, DealStage.CLOSED_LOST},
    }

    @staticmethod
    def can_advance(deal: Deal, next_stage: DealStage) -> bool:
        current_stage = deal.stage

        if next_stage == current_stage:
            return True

        if PipelineGovernor._INDEX.get(next_stage, -1) < PipelineGovernor._INDEX.get(current_stage, -1):
            if next_stage not in PipelineGovernor._ALLOWED.get(current_stage, set()):
                return False

        if next_stage not in PipelineGovernor._ALLOWED.get(current_stage, set()):
            return False

        if next_stage == DealStage.PROPOSAL and not bool(deal.life_map):
            return False

        if next_stage == DealStage.CLOSED_WON and int(deal.safety_score or 100) < 50:
            return False

        return True
