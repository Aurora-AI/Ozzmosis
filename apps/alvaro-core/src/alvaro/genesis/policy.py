from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional

import yaml


PolicyMode = Literal["error", "warn"]
Op = Literal["equals"]


@dataclass(frozen=True)
class PolicyWhen:
    field: str
    op: Op
    value: Any


@dataclass(frozen=True)
class PolicyRule:
    id: str
    description: str
    when: PolicyWhen
    verdict: Literal["BLOCK", "ALLOW"]
    reason_code: str


@dataclass(frozen=True)
class Policy:
    version: str
    mode: PolicyMode
    rules: List[PolicyRule]


def load_policy(policy_path: Path) -> Policy:
    raw = yaml.safe_load(policy_path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError("Policy root must be a mapping")

    version = str(raw.get("version", "0"))
    mode = raw.get("mode", "error")
    if mode not in ("error", "warn"):
        raise ValueError("Policy mode must be 'error' or 'warn'")

    rules_raw = raw.get("rules", [])
    if not isinstance(rules_raw, list):
        raise ValueError("Policy rules must be a list")

    rules: List[PolicyRule] = []
    for i, r in enumerate(rules_raw):
        if not isinstance(r, dict):
            raise ValueError(f"Rule[{i}] must be a mapping")

        rid = r.get("id")
        if not isinstance(rid, str) or not rid.strip():
            raise ValueError(f"Rule[{i}].id must be a non-empty string")

        desc = r.get("description", "")
        if not isinstance(desc, str):
            desc = str(desc)

        when_raw = r.get("when")
        if not isinstance(when_raw, dict):
            raise ValueError(f"Rule[{i}].when must be a mapping")

        field = when_raw.get("field")
        op = when_raw.get("op")
        value = when_raw.get("value")

        if not isinstance(field, str) or not field.strip():
            raise ValueError(f"Rule[{i}].when.field must be a non-empty string")
        if op not in ("equals",):
            raise ValueError(f"Rule[{i}].when.op must be 'equals' (MVP)")

        verdict = r.get("verdict", "BLOCK")
        if verdict not in ("BLOCK", "ALLOW"):
            raise ValueError(f"Rule[{i}].verdict must be BLOCK|ALLOW")

        reason_code = r.get("reason_code", rid)
        if not isinstance(reason_code, str) or not reason_code.strip():
            raise ValueError(f"Rule[{i}].reason_code must be a non-empty string")

        rules.append(
            PolicyRule(
                id=rid,
                description=desc,
                when=PolicyWhen(field=field, op=op, value=value),
                verdict=verdict,
                reason_code=reason_code,
            )
        )

    return Policy(version=version, mode=mode, rules=rules)


def evaluate_policy(policy: Policy, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministic evaluation.
    Returns:
      {
        "policy_version": "...",
        "policy_mode": "error|warn",
        "triggered_rule_ids": [...],
        "reason_codes": [...],
        "forced_verdict": Optional["BLOCK"|"ALLOW"]
      }
    """
    triggered: List[PolicyRule] = []

    for rule in policy.rules:
        v = payload.get(rule.when.field)
        if rule.when.op == "equals":
            if v == rule.when.value:
                triggered.append(rule)

    triggered_rule_ids = [r.id for r in triggered]
    reason_codes = [r.reason_code for r in triggered]

    forced_verdict: Optional[str] = None
    if policy.mode == "error" and triggered:
        forced_verdict = triggered[0].verdict

    return {
        "policy_version": policy.version,
        "policy_mode": policy.mode,
        "triggered_rule_ids": triggered_rule_ids,
        "reason_codes": reason_codes,
        "forced_verdict": forced_verdict,
    }
