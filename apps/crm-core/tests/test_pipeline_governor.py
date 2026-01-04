from src.models.deal import Deal, DealStage
from src.services.state_machine import PipelineGovernor


def test_blocks_proposal_without_life_map():
    assert (
        PipelineGovernor.can_advance(Deal(contact_id="c1", title="t1", stage=DealStage.QUALIFIED, life_map=None), DealStage.PROPOSAL)
        is False
    )


def test_blocks_closed_won_with_low_safety():
    assert (
        PipelineGovernor.can_advance(
            Deal(
                contact_id="c1",
                title="t1",
                stage=DealStage.NEGOTIATION,
                safety_score=10,
                life_map={"age": 30},
            ),
            DealStage.CLOSED_WON,
        )
        is False
    )


def test_allows_noop_same_stage():
    assert (
        PipelineGovernor.can_advance(
            Deal(contact_id="c1", title="t1", stage=DealStage.DISCOVERY),
            DealStage.DISCOVERY,
        )
        is True
    )
