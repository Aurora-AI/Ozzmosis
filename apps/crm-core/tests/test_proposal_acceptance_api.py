import asyncio

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.database import get_db
from src.main import app
from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import Deal, DealStage
from src.services.proposal_service import ProposalService


def test_accept_proposal_api_happy_path_and_immutability(tmp_path):
    async def _init_db(engine, session_maker) -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        life_map_payload = {
            "age": 35,
            "monthly_income": 20000,
            "monthly_capacity": 2500,
            "dependents": 2,
            "goals": [{"id": "g1", "title": "Casa", "target_value": 500000, "deadline_years": 5}],
        }

        async with session_maker() as db:
            db.add(Contact(id="c1", whatsapp_id="wa_1"))
            db.add(Deal(id="d_missing", contact_id="c1", title="t_missing", stage=DealStage.QUALIFIED))
            db.add(
                Deal(
                    id="d_ok",
                    contact_id="c1",
                    title="t_ok",
                    stage=DealStage.QUALIFIED,
                    life_map=life_map_payload,
                    life_map_version=1,
                )
            )
            await db.commit()

            proposals = ProposalService(db)
            await proposals.generate_and_persist("d_ok")
            await db.commit()

    db_path = tmp_path / "crm_core_acceptance_api.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    asyncio.run(_init_db(engine, SessionLocal))

    async def override_get_db():
        async with SessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        client = TestClient(app)

        missing = client.post("/v1/proposals/d_missing/accept", json={"accepted_tier": "ESSENTIAL"})
        assert missing.status_code == 409
        assert missing.json()["detail"] == "proposals_missing"

        invalid = client.post("/v1/proposals/d_ok/accept", json={"accepted_tier": "NOPE"})
        assert invalid.status_code == 400

        ok = client.post(
            "/v1/proposals/d_ok/accept",
            json={"accepted_tier": "LEGACY", "client_device_fingerprint": "fp_1"},
        )
        assert ok.status_code == 200
        body = ok.json()
        assert body["deal_id"] == "d_ok"
        assert body["accepted_tier"] == "LEGACY"
        assert body["acceptance_version"] == 1
        assert body["stage"] == "NEGOTIATION"

        again = client.post("/v1/proposals/d_ok/accept", json={"accepted_tier": "LEGACY"})
        assert again.status_code == 409
        assert again.json()["detail"] == "already_accepted"
    finally:
        app.dependency_overrides.clear()
        asyncio.run(engine.dispose())

