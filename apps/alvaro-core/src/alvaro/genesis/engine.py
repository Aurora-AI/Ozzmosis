from __future__ import annotations

from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any, Dict, Tuple

from .artifacts import canonical_json_bytes, sha256_hex, write_artifacts
from .pdf_stub import build_pdf_stub


def _plain(obj: Any) -> Any:
    if is_dataclass(obj):
        return asdict(obj)
    return obj


def decide(repo_root: Path, request_model: Any) -> Tuple[Dict[str, Any], bytes, Dict[str, str]]:
    """
    Deterministic decision function.
    Returns: decision dict, pdf bytes, artifacts metadata.
    """
    request_plain = _plain(request_model)
    req_bytes = canonical_json_bytes(request_plain)
    req_hash = sha256_hex(req_bytes)

    force_block = bool(request_plain.get("force_block")) if isinstance(request_plain, dict) else False

    decision = {
        "contract_version": "1.0",
        "endpoint": "/genesis/decide",
        "request_sha256": req_hash,
        "verdict": "BLOCK" if force_block else "ALLOW",
        "reasons": ["force_block=true"] if force_block else [],
    }

    decision_bytes = canonical_json_bytes(decision)
    pdf_bytes = build_pdf_stub(req_hash)

    artifacts = write_artifacts(
        repo_root=repo_root,
        request_json_bytes=req_bytes,
        decision_json_bytes=decision_bytes,
        pdf_bytes=pdf_bytes,
    )

    return decision, pdf_bytes, artifacts
