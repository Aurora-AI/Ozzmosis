import asyncio

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.database import get_db
from src.main import app
from src.models.base import Base
from src.models.contact import Contact
from src.models.deal import Deal


def test_proposals_generate_and_get_by_deal(tmp_path):
    async def _init_db(engine, session_maker) -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with session_maker() as db:
            db.add(Contact(id="c1", whatsapp_id="wa_1"))
            db.add(Deal(id="d1", contact_id="c1", title="t1"))
            db.add(
                Deal(
                    id="d2",
                    contact_id="c1",
                    title="t2",
                    life_map={
                        "age": 35,
                        "monthly_income": 20000,
                        "monthly_capacity": 2500,
                        "dependents": 2,
                        "goals": [{"id": "g1", "title": "Casa", "target_value": 500000, "deadline_years": 5}],
                    },
                    life_map_version=1,
                )
            )
            await db.commit()

    db_path = tmp_path / "crm_core_proposals_api.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    asyncio.run(_init_db(engine, SessionLocal))

    async def override_get_db():
        async with SessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        client = TestClient(app)

        missing = client.post("/v1/proposals/generate", params={"deal_id": "d1"})
        assert missing.status_code == 409
        assert missing.json()["detail"] == "life_map_missing"

        resp = client.post("/v1/proposals/generate", params={"deal_id": "d2"})
        assert resp.status_code == 200
        body = resp.json()
        assert body["deal_id"] == "d2"
        assert body["proposals_version"] >= 1
        assert [b["tier"] for b in body["bundles"]] == ["ESSENTIAL", "WEALTH", "LEGACY"]

        get_resp = client.get("/v1/proposals/by-deal/d2")
        assert get_resp.status_code == 200
        assert get_resp.json()["proposals_version"] == body["proposals_version"]
    finally:
        app.dependency_overrides.clear()
        asyncio.run(engine.dispose())

