from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import trustware
from api.routes.trustware import router as trustware_router

logger = logging.getLogger("alvaro_core")

app = FastAPI(title="Alvaro Core", version="0.1.0")

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
