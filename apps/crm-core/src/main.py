import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import text

from src.api.v1.contacts import router as contacts_router
from src.api.v1.deals import router as deals_router
from src.api.v1.health import router as health_router
from src.api.v1.ingest import router as ingest_router
from src.api.v1.life_map import router as life_map_router
from src.api.v1.proposals import router as proposals_router
from src.api.v1.proposal_acceptance import router as proposal_acceptance_router
from src.api.v1.rbac import router as rbac_router
from src.database import close_engine, get_db_session

@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    await close_engine()


app = FastAPI(title="crm-core", lifespan=lifespan)

@app.get("/readiness")
async def readiness():
    try:
        async with get_db_session() as session:
            await asyncio.wait_for(session.execute(text("SELECT 1")), timeout=2.0)
        return {"status": "ready"}
    except Exception:
        return JSONResponse(status_code=503, content={"status": "not_ready", "reason": "db_unavailable"})

app.include_router(health_router, prefix="/api/v1")
app.include_router(rbac_router, prefix="/api/v1")
app.include_router(ingest_router)

app.include_router(ingest_router, prefix="/v1")
app.include_router(contacts_router, prefix="/v1")
app.include_router(deals_router, prefix="/v1")
app.include_router(life_map_router, prefix="/v1")
app.include_router(proposals_router, prefix="/v1")
app.include_router(proposal_acceptance_router, prefix="/v1")
