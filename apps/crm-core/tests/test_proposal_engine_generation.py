import asyncio

import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import Deal
from src.services.proposal_service import ProposalService


def test_generate_blocked_without_life_map(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_proposals_1.db"
        engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            async with SessionLocal() as db:
                db.add(Contact(id="c1", whatsapp_id="wa_1"))
                db.add(Deal(id="d1", contact_id="c1", title="t1"))
                await db.commit()

                svc = ProposalService(db)
                with pytest.raises(ValueError) as exc:
                    await svc.generate_and_persist("d1")
                assert str(exc.value) == "life_map_missing"
        finally:
            await engine.dispose()

    asyncio.run(_run())


def test_generate_persists_three_tiers_and_versions(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_proposals_2.db"
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
                        life_map=life_map_payload,
                        life_map_version=1,
                    )
                )
                await db.commit()

                svc = ProposalService(db)
                out1 = await svc.generate_and_persist("d2")
                await db.commit()

                assert out1.deal_id == "d2"
                assert out1.life_map_version == 1
                assert out1.proposals_version == 1
                assert [b.tier.value for b in out1.bundles] == ["ESSENTIAL", "WEALTH", "LEGACY"]
                assert all(b.total_monthly_investment <= 2500 for b in out1.bundles)

                out2 = await svc.generate_and_persist("d2")
                await db.commit()
                assert out2.proposals_version == 2
        finally:
            await engine.dispose()

    asyncio.run(_run())
