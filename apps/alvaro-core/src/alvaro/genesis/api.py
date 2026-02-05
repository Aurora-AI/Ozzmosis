from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, Response

from .engine import decide

router = APIRouter(prefix="/genesis", tags=["genesis"])


def _repo_root() -> Path:
    # .../apps/alvaro-core/src/alvaro/genesis/api.py -> repo root
    return Path(__file__).resolve().parents[5]


@router.post("/decide")
def genesis_decide(payload: Dict[str, Any]) -> Dict[str, Any]:
    repo_root = _repo_root()
    decision, _pdf_bytes, _artifacts = decide(repo_root=repo_root, request_model=payload)
    return decision


@router.post("/decide.pdf")
def genesis_decide_pdf(payload: Dict[str, Any]) -> Response:
    repo_root = _repo_root()
    decision, pdf_bytes, _artifacts = decide(repo_root=repo_root, request_model=payload)

    headers = {
        "X-Genesis-Request-SHA256": decision["request_sha256"],
        "X-Genesis-Verdict": decision["verdict"],
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
