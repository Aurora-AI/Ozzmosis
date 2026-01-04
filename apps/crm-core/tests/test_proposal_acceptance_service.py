import asyncio

import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import Deal, DealStage
from src.services.deal_service import DealService
from src.services.proposal_service import ProposalService


def test_accept_proposal_requires_proposals(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_acceptance_1.db"
        engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            async with SessionLocal() as db:
                db.add(Contact(id="c1", whatsapp_id="wa_1"))
                db.add(
                    Deal(
                        id="d1",
                        contact_id="c1",
                        title="t1",
                        stage=DealStage.QUALIFIED,
                        life_map={"age": 30, "monthly_income": 1, "monthly_capacity": 1, "dependents": 0, "goals": []},
                        life_map_version=1,
                    )
                )
                await db.commit()

                svc = DealService(db)
                with pytest.raises(ValueError) as exc:
                    await svc.accept_proposal("d1", "ESSENTIAL", None, None)
                assert str(exc.value) == "proposals_missing"
        finally:
            await engine.dispose()

    asyncio.run(_run())


def test_accept_proposal_persists_snapshot_and_advances_stage(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_acceptance_2.db"
        engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            life_map_payload = {
                "age": 35,
                "monthly_income": 20000,
                "monthly_capacity": 2500,
                "dependents": 2,
                "goals": [{"id": "g1", "title": "Casa", "target_value": 500000, "deadline_years": 5}],
            }

            async with SessionLocal() as db:
                db.add(Contact(id="c2", whatsapp_id="wa_2"))
                db.add(
                    Deal(
                        id="d2",
                        contact_id="c2",
                        title="t2",
                        stage=DealStage.QUALIFIED,
                        life_map=life_map_payload,
                        life_map_version=1,
                    )
                )
                await db.commit()

                proposals = ProposalService(db)
                await proposals.generate_and_persist("d2")
                await db.commit()

                svc = DealService(db)
                deal = await svc.accept_proposal("d2", "WEALTH", "fp_1", None)
                await db.commit()

                assert deal.accepted_tier == "WEALTH"
                assert deal.acceptance_version == 1
                assert deal.accepted_at is not None
                assert deal.accepted_proposal_data is not None
                assert deal.accepted_proposal_data["proposal_version_at_acceptance"] == 1
                assert deal.accepted_proposal_data["life_map_version_at_acceptance"] == 1
                assert deal.stage == DealStage.NEGOTIATION

                with pytest.raises(ValueError) as exc:
                    await svc.accept_proposal("d2", "WEALTH", None, None)
                assert str(exc.value) == "already_accepted"
        finally:
            await engine.dispose()

    asyncio.run(_run())

