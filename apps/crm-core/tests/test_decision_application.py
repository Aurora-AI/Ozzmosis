import asyncio

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import DealStage
from src.services.deal_service import DealService


def test_apply_mhc_decision_blocks_records_audit_and_score(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_test.db"
        engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

            async with SessionLocal() as db:
                db.add(Contact(id="contact_test_1", whatsapp_id="wa_1"))
                await db.commit()

                svc = DealService(db)
                deal = await svc.get_or_create_active_deal("contact_test_1")
                assert deal.stage == DealStage.NEW

                decision = {
                    "decision": "BLOCK",
                    "enriched_context": {"srv_extractor": {"detected_s": "x"}},
                    "safety_score_delta": -50,
                }

                await svc.apply_mhc_decision(
                    deal,
                    decision,
                    trace_id="evt_test_1",
                    ingest_event_id="ing_1",
                )
                await db.flush()

                assert deal.safety_score == 50
                assert deal.stage in (DealStage.CHURN_ALERT, DealStage.NEW)
                assert "last_decision" in (deal.product_data or {})
                assert deal.product_data["last_decision"]["trace_id"] == "evt_test_1"
        finally:
            await engine.dispose()

    asyncio.run(_run())


def test_apply_mhc_decision_proceed_advances_new_to_discovery(tmp_path):
    async def _run() -> None:
        db_path = tmp_path / "crm_core_test_2.db"
        engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

            async with SessionLocal() as db:
                db.add(Contact(id="contact_test_2", whatsapp_id="wa_2"))
                await db.commit()

                svc = DealService(db)
                deal = await svc.get_or_create_active_deal("contact_test_2")
                assert deal.stage == DealStage.NEW

                decision = {
                    "decision": "PROCEED",
                    "enriched_context": {},
                    "safety_score_delta": 0,
                }

                await svc.apply_mhc_decision(
                    deal,
                    decision,
                    trace_id="evt_test_2",
                    ingest_event_id="ing_2",
                )
                await db.flush()

                assert deal.stage == DealStage.DISCOVERY
        finally:
            await engine.dispose()

    asyncio.run(_run())
