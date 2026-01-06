#!/usr/bin/env python3
"""
Survival Check (Deterministic)

Detects survival evidence by:
- presence of test:survival script (Node)
- presence of files with "survival" in name
- workflows containing "survival" (or "smoke" for shield)

Usage:
  python scripts/product_maturity/survival_check.py --repo-root . --out artifacts/survival_check.json
Exit code:
  0 = ok
  2 = missing survival evidence
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass
class Evidence:
    kind: str
    path: str
    note: str


@dataclass
class ComponentResult:
    key: str
    path: str
    kind: str  # "node" | "python"
    status: str  # "ok" | "fail"
    reason_codes: List[str]
    evidence: List[Evidence]


def _read_json(path: Path) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _find_survival_files(base: Path) -> List[Evidence]:
    found: List[Evidence] = []
    for p in base.rglob("*"):
        if p.is_file() and "survival" in p.name.lower():
            found.append(
                Evidence(kind="file", path=str(p.relative_to(base)), note="survival_file")
            )
    return found


def _find_workflow_evidence(repo_root: Path, key: str, needle: str) -> List[Evidence]:
    wf_dir = repo_root / ".github" / "workflows"
    if not wf_dir.exists():
        return []
    found: List[Evidence] = []
    for wf in wf_dir.glob("*.yml"):
        txt = wf.read_text(encoding="utf-8", errors="ignore").lower()
        if needle in txt and (key in txt or f"{key}/" in txt or f"/{key}" in txt):
            found.append(
                Evidence(
                    kind="workflow",
                    path=str(wf.relative_to(repo_root)),
                    note=f"workflow_contains_{needle}",
                )
            )
    return found


def _component_kind(base: Path) -> str:
    if (base / "package.json").exists():
        return "node"
    return "python"


def _check_component(repo_root: Path, key: str, rel_path: str) -> ComponentResult:
    base = repo_root / rel_path
    kind = _component_kind(base)
    evidence: List[Evidence] = []
    reasons: List[str] = []

    has_script = False
    if kind == "node":
        pkg = base / "package.json"
        data = _read_json(pkg) if pkg.exists() else None
        scripts = data.get("scripts", {}) if isinstance(data, dict) else {}
        if scripts.get("test:survival"):
            has_script = True
            evidence.append(
                Evidence(kind="script", path=str(pkg.relative_to(repo_root)), note="test:survival")
            )
        elif key == "butantan-shield" and scripts.get("smoke"):
            has_script = True
            evidence.append(
                Evidence(kind="script", path=str(pkg.relative_to(repo_root)), note="smoke")
            )
        else:
            reasons.append("MISSING_TEST_SURVIVAL_SCRIPT")
    else:
        if not (base / "tests").exists():
            reasons.append("MISSING_TESTS_DIR")

    survival_files = _find_survival_files(base)
    if survival_files:
        evidence.extend(survival_files)
    else:
        reasons.append("MISSING_SURVIVAL_FILES")

    if key == "butantan-shield":
        workflow_evidence = _find_workflow_evidence(repo_root, key, "smoke")
        if workflow_evidence:
            evidence.extend(workflow_evidence)
        else:
            reasons.append("MISSING_SMOKE_WORKFLOW")
    else:
        workflow_evidence = _find_workflow_evidence(repo_root, key, "survival")
        if workflow_evidence:
            evidence.extend(workflow_evidence)
        else:
            reasons.append("MISSING_SURVIVAL_WORKFLOW")

    has_core_evidence = has_script or bool(survival_files)
    status = "ok" if has_core_evidence else "fail"
    if status == "ok":
        reasons = []

    return ComponentResult(
        key=key,
        path=rel_path,
        kind=kind,
        status=status,
        reason_codes=reasons,
        evidence=evidence,
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=".", help="Repo root path")
    ap.add_argument("--out", default="artifacts/survival_check.json")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    out_path = (repo_root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    components = [
        ("aurora-chronos", "libs/aurora-chronos"),
        ("crm-core", "apps/crm-core"),
        ("alvaro-core", "apps/alvaro-core"),
        ("butantan-shield", "apps/butantan-shield"),
    ]

    results: List[ComponentResult] = []
    for key, rel_path in components:
        results.append(_check_component(repo_root, key, rel_path))

    failed = [r for r in results if r.status == "fail"]
    payload = {
        "ok": len(failed) == 0,
        "failed_count": len(failed),
        "results": [asdict(r) for r in results],
    }
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return 0 if len(failed) == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
