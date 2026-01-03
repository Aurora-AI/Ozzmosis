from src.models.deal import DealStage
from src.services.state_machine import PipelineGovernor


def test_blocks_proposal_without_life_map():
    assert (
        PipelineGovernor.can_advance(
            current_stage=DealStage.QUALIFIED,
            next_stage=DealStage.PROPOSAL,
            metadata={"has_life_map": False},
        )
        is False
    )


def test_blocks_closed_won_with_low_safety():
    assert (
        PipelineGovernor.can_advance(
            current_stage=DealStage.NEGOTIATION,
            next_stage=DealStage.CLOSED_WON,
            metadata={"safety_score": 10, "has_life_map": True},
        )
        is False
    )


def test_allows_noop_same_stage():
    assert (
        PipelineGovernor.can_advance(
            current_stage=DealStage.DISCOVERY,
            next_stage=DealStage.DISCOVERY,
            metadata={},
        )
        is True
    )

