from __future__ import annotations

from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any, Dict, Tuple

from .artifacts import canonical_json_bytes, sha256_hex, write_artifacts
from .pdf_stub import build_pdf_stub
from .policy import evaluate_policy, load_policy


def _plain(obj: Any) -> Any:
    if is_dataclass(obj):
        return asdict(obj)
    return obj


def decide(repo_root: Path, request_model: Any) -> Tuple[Dict[str, Any], bytes, Dict[str, str]]:
    request_plain = _plain(request_model)
    if not isinstance(request_plain, dict):
        raise ValueError("Genesis decide request must be a dict-like object in MVP")

    req_bytes = canonical_json_bytes(request_plain)
    req_hash = sha256_hex(req_bytes)

    policy_path = repo_root / "apps" / "alvaro-core" / "src" / "alvaro" / "genesis" / "policies" / "genesis.v0.yaml"
    policy = load_policy(policy_path)
    policy_eval = evaluate_policy(policy, request_plain)

    verdict = "ALLOW"
    reasons = []

    if policy_eval["forced_verdict"] is not None:
        verdict = policy_eval["forced_verdict"]
        reasons = policy_eval["reason_codes"]
    else:
        reasons = policy_eval["reason_codes"]

    decision = {
        "contract_version": "1.0",
        "endpoint": "/genesis/decide",
        "request_sha256": req_hash,
        "verdict": verdict,
        "reasons": reasons,
        "policy_version": policy_eval["policy_version"],
        "policy_mode": policy_eval["policy_mode"],
        "policy_rule_ids_triggered": policy_eval["triggered_rule_ids"],
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
