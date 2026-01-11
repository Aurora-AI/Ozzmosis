from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Response
from pydantic import BaseModel

from .engine import decide

router = APIRouter(prefix="/genesis", tags=["genesis"])


class GenesisDecideRequest(BaseModel):
    force_block: bool = False


@router.post("/decide")
def genesis_decide(payload: GenesisDecideRequest) -> dict:
    repo_root = Path(__file__).resolve().parents[6]

    decision, _pdf_bytes, artifacts = decide(
        repo_root=repo_root,
        request_model=payload.model_dump(),
    )
    return {**decision, "artifacts": artifacts}


@router.post("/decide.pdf")
def genesis_decide_pdf(payload: GenesisDecideRequest) -> Response:
    repo_root = Path(__file__).resolve().parents[6]
    decision, pdf_bytes, _artifacts = decide(
        repo_root=repo_root,
        request_model=payload.model_dump(),
    )

    headers = {
        "X-Genesis-Request-SHA256": decision["request_sha256"],
        "X-Genesis-Verdict": decision["verdict"],
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
