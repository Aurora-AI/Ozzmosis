from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import trustware
from api.routes.trustware import router as trustware_router
from alvaro.ai.api import router as ai_router
from alvaro.genesis.api import router as genesis_router

logger = logging.getLogger("alvaro_core")

@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    logger.info("shutdown: complete")


app = FastAPI(title="Alvaro Core", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trustware_router, prefix="/api/v1/trustware")
app.include_router(ai_router)
app.include_router(genesis_router)

try:
    snap = trustware.engine.health_snapshot()
    logger.info(
        "trustware_boot: enabled=%s version=%s products=%s rules_path=%s",
        snap.get("enabled"),
        snap.get("template_version"),
        snap.get("products_count"),
        snap.get("rules_path"),
    )
except Exception as exc:
    logger.critical("trustware_boot_failed: %s", exc)
    raise


@app.get("/health")
async def health():
    return {
        "status": "operational",
        "system": "Alvaro Core",
        "trustware": trustware.engine.health_snapshot(),
    }


@app.get("/readiness")
async def readiness():
    try:
        trustware.engine.health_snapshot()
        return {"status": "ready"}
    except Exception:
        from fastapi.responses import JSONResponse

        return JSONResponse(status_code=503, content={"status": "not_ready", "reason": "trustware_unavailable"})
