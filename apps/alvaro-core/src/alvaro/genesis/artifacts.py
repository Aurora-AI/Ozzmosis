from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any, Dict, Union


def _to_plain(obj: Any) -> Any:
    if is_dataclass(obj):
        return asdict(obj)
    return obj


def canonical_json_bytes(data: Any) -> bytes:
    plain = _to_plain(data)
    return json.dumps(plain, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def sha256_hex(data: Union[bytes, str]) -> str:
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def artifacts_dir_from_repo_root(repo_root: Path) -> Path:
    return repo_root / "artifacts" / "genesis"


def write_artifacts(
    repo_root: Path,
    request_json_bytes: bytes,
    decision_json_bytes: bytes,
    pdf_bytes: bytes,
) -> Dict[str, str]:
    req_hash = sha256_hex(request_json_bytes)
    out_dir = artifacts_dir_from_repo_root(repo_root) / req_hash
    out_dir.mkdir(parents=True, exist_ok=True)

    json_path = out_dir / "decision.json"
    pdf_path = out_dir / "decision.pdf"

    json_path.write_bytes(decision_json_bytes)
    pdf_path.write_bytes(pdf_bytes)

    return {
        "request_sha256": req_hash,
        "decision_json_path": str(json_path),
        "decision_pdf_path": str(pdf_path),
    }
