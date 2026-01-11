from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response
from pathlib import Path
from typing import Any, Dict
import tempfile

from .genesis.engine import decide


app = FastAPI()


@app.post("/genesis/decide")
async def genesis_decide_json(request: Dict[str, Any]):
    """Genesis Decide endpoint returning JSON decision."""
    repo_root = Path(__file__).parent.parent.parent.parent.parent
    decision, pdf_bytes, artifacts = decide(repo_root=repo_root, request_model=request)
    return JSONResponse(content=decision)


@app.post("/genesis/decide.pdf")
async def genesis_decide_pdf(request: Dict[str, Any]):
    """Genesis Decide PDF endpoint returning PDF stub."""
    repo_root = Path(__file__).parent.parent.parent.parent.parent
    decision, pdf_bytes, artifacts = decide(repo_root=repo_root, request_model=request)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "X-Genesis-Request-SHA256": decision.get("request_sha256", ""),
            "X-Genesis-Verdict": decision.get("verdict", "UNKNOWN"),
        },
    )
