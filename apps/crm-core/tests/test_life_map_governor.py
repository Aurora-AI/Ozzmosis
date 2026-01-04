from src.models.deal import Deal, DealStage
from src.services.state_machine import PipelineGovernor


def test_governor_blocks_proposal_without_life_map():
    deal = Deal(contact_id="c1", title="t1", stage=DealStage.QUALIFIED, safety_score=100, life_map=None)
    assert PipelineGovernor.can_advance(deal, DealStage.PROPOSAL) is False


def test_governor_allows_proposal_with_life_map():
    deal = Deal(contact_id="c1", title="t1", stage=DealStage.QUALIFIED, safety_score=100, life_map={"age": 30})
    assert PipelineGovernor.can_advance(deal, DealStage.PROPOSAL) is True

