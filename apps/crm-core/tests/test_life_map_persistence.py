import asyncio

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.database import get_db
from src.main import app
from src.models.base import Base
from src.models.contact import Contact


def test_persist_life_map_increments_version(tmp_path):
    async def _init_db(engine, session_maker) -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with session_maker() as db:
            db.add(Contact(id="contact_test", whatsapp_id="wa_test"))
            await db.commit()

    db_path = tmp_path / "crm_core_life_map.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", future=True)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    asyncio.run(_init_db(engine, SessionLocal))

    async def override_get_db():
        async with SessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        client = TestClient(app)
        payload = {
            "age": 35,
            "monthly_income": 20000,
            "monthly_capacity": 2500,
            "dependents": 2,
            "goals": [{"id": "g1", "title": "Casa", "target_value": 500000, "deadline_years": 5}],
        }

        r1 = client.post("/v1/life-map", params={"contact_id": "contact_test"}, json=payload)
        assert r1.status_code == 200
        d1 = r1.json()
        assert d1["life_map_version"] >= 1
        assert d1["life_map"]

        r2 = client.post("/v1/life-map", params={"contact_id": "contact_test"}, json=payload)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["life_map_version"] == d1["life_map_version"] + 1
    finally:
        app.dependency_overrides.clear()
        asyncio.run(engine.dispose())

