from fastapi import FastAPI

from src.api.v1.health import router as health_router
from src.api.v1.rbac import router as rbac_router

app = FastAPI(title="crm-core")

app.include_router(health_router, prefix="/api/v1")
app.include_router(rbac_router, prefix="/api/v1")
