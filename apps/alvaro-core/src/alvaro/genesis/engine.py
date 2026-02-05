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

    artifact_base_url = f"/genesis/artifacts/{req_hash}"
    decision_json_url = f"{artifact_base_url}/decision.json"
    decision_pdf_url = f"{artifact_base_url}/decision.pdf"

    ui_status = "blocked" if verdict == "BLOCK" else "allowed"
    ui_message = (
        "Nao conseguimos avancar com a simulacao neste momento. Vamos ajustar alguns dados e tentar novamente."
        if ui_status == "blocked"
        else "Tudo certo. Posso montar a proxima etapa para voce."
    )

    steps = [
        {
            "id": "policy_check",
            "title": "Validacao de politica",
            "status": "done",
            "summary": "Regras verificadas e avaliadas.",
        }
    ]

    if ui_status == "blocked":
        next_actions = [
            {
                "id": "retry",
                "label": "Tentar novamente",
                "type": "retry",
            },
            {
                "id": "handoff_human",
                "label": "Falar com um especialista",
                "type": "handoff",
                "channel": "whatsapp",
            },
        ]
    else:
        next_actions = [
            {
                "id": "collect_params",
                "label": "Continuar",
                "type": "collect_input",
                "fields": ["produto", "valor", "prazo", "perfil"],
            },
            {
                "id": "open_decision_pdf",
                "label": "Baixar decisao (PDF)",
                "type": "open_artifact",
                "url": decision_pdf_url,
            },
        ]

    decision = {
        # v1.0 compatibility (keep top-level fields)
        "contract_version": "1.1",
        "endpoint": "/genesis/decide",
        "request_sha256": req_hash,
        "decision_id": req_hash,
        # Deterministic correlation id (avoid randomness so decision.json stays stable for same request).
        "correlation_id": f"genesis:{req_hash}",
        "verdict": verdict,
        "reasons": reasons,
        "policy_version": policy_eval["policy_version"],
        "policy_mode": policy_eval["policy_mode"],
        "policy_rule_ids_triggered": policy_eval["triggered_rule_ids"],
        # v1.1 namespaces
        "policy": {
            "verdict": verdict,
            "reasons": reasons,
            "version": policy_eval["policy_version"],
            "mode": policy_eval["policy_mode"],
            "rules_triggered": policy_eval["triggered_rule_ids"],
        },
        "artifacts": {
            "decision_json": decision_json_url,
            "decision_pdf": decision_pdf_url,
        },
        "ui": {
            "status": ui_status,
            "user_message": ui_message,
            "steps": steps,
            "next_actions": next_actions,
            "artifacts": {
                "decision_json": decision_json_url,
                "decision_pdf": decision_pdf_url,
            },
        },
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
