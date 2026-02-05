from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse, Response
from pathlib import Path
from typing import Any, Dict
import tempfile
import re

from .genesis.engine import decide


app = FastAPI()

_SHA256_HEX_RE = re.compile(r"^[a-f0-9]{64}$")
_GENESIS_ARTIFACT_MEDIA_TYPES: Dict[str, str] = {
    "decision.json": "application/json",
    "decision.pdf": "application/pdf",
}


def _repo_root() -> Path:
    # .../apps/alvaro-core/src/alvaro/app.py -> repo root
    return Path(__file__).resolve().parents[5]


@app.get("/genesis/artifacts/{request_sha256}/{filename}")
async def genesis_artifact(request_sha256: str, filename: str):
    """
    Canonical artifact hosting for Genesis decisions.

    Security:
    - request_sha256 must be strict sha256 hex
    - filename is allowlisted (no traversal)
    """
    if not _SHA256_HEX_RE.fullmatch(request_sha256):
        raise HTTPException(status_code=400, detail="GENESIS_REQUEST_SHA256_INVALID")

    media_type = _GENESIS_ARTIFACT_MEDIA_TYPES.get(filename)
    if not media_type:
        # 404 to avoid giving attackers an oracle for valid filenames.
        raise HTTPException(status_code=404, detail="GENESIS_ARTIFACT_NOT_FOUND")

    repo_root = _repo_root()
    artifact_path = repo_root / "artifacts" / "genesis" / request_sha256 / filename
    if not artifact_path.exists() or not artifact_path.is_file():
        raise HTTPException(status_code=404, detail="GENESIS_ARTIFACT_NOT_FOUND")

    return FileResponse(
        path=str(artifact_path),
        media_type=media_type,
        headers={
            # Conservative default (artifacts may contain sensitive data in future iterations).
            "Cache-Control": "no-store",
        },
    )


@app.post("/genesis/decide")
async def genesis_decide_json(request: Dict[str, Any]):
    """Genesis Decide endpoint returning JSON decision."""
    repo_root = _repo_root()
    decision, pdf_bytes, artifacts = decide(repo_root=repo_root, request_model=request)
    return JSONResponse(content=decision)


@app.post("/genesis/decide.pdf")
async def genesis_decide_pdf(request: Dict[str, Any]):
    """Genesis Decide PDF endpoint returning PDF stub."""
    repo_root = _repo_root()
    decision, pdf_bytes, artifacts = decide(repo_root=repo_root, request_model=request)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "X-Genesis-Request-SHA256": decision.get("request_sha256", ""),
            "X-Genesis-Verdict": decision.get("verdict", "UNKNOWN"),
            "X-Genesis-Decision-JSON-URL": decision.get("ui", {}).get("artifacts", {}).get("decision_json", ""),
            "X-Genesis-Decision-PDF-URL": decision.get("ui", {}).get("artifacts", {}).get("decision_pdf", ""),
        },
    )


@app.get("/readiness")
async def readiness():
    return {"status": "ready"}
