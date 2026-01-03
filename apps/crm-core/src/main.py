from fastapi import FastAPI

from src.api.v1.contacts import router as contacts_router
from src.api.v1.deals import router as deals_router
from src.api.v1.health import router as health_router
from src.api.v1.ingest import router as ingest_router
from src.api.v1.life_map import router as life_map_router
from src.api.v1.proposals import router as proposals_router
from src.api.v1.rbac import router as rbac_router

app = FastAPI(title="crm-core")

app.include_router(health_router, prefix="/api/v1")
app.include_router(rbac_router, prefix="/api/v1")
app.include_router(ingest_router)

app.include_router(ingest_router, prefix="/v1")
app.include_router(contacts_router, prefix="/v1")
app.include_router(deals_router, prefix="/v1")
app.include_router(life_map_router, prefix="/v1")
app.include_router(proposals_router, prefix="/v1")
