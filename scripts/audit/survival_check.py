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
import shutil
import subprocess
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
    run: Optional[Dict[str, Any]] = None


def _read_json(path: Path) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _find_survival_files(base: Path) -> List[Evidence]:
    found: List[Evidence] = []
    try:
        for p in base.rglob("*"):
            try:
                if p.is_file() and "survival" in p.name.lower():
                    found.append(
                        Evidence(kind="file", path=str(p.relative_to(base)), note="survival_file")
                    )
            except (OSError, PermissionError):
                # Skip files we can't access (symlinks, permission denied)
                continue
    except (OSError, PermissionError):
        # If we can't traverse at all, return what we have
        pass
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

def _run_survival_script(repo_root: Path, workspace: str) -> Dict[str, Any]:
    npm_cmd = shutil.which("npm.cmd") or shutil.which("npm")
    if not npm_cmd:
        return {
            "command": "npm run -w {workspace} test:survival".format(workspace=workspace),
            "exit_code": 127,
            "stdout": "",
            "stderr": "npm_not_found_in_path",
        }

    cmd = [npm_cmd, "run", "-w", workspace, "test:survival"]
    result = subprocess.run(
        cmd,
        cwd=str(repo_root),
        capture_output=True,
        text=True,
        check=False,
    )
    return {
        "command": " ".join(cmd),
        "exit_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }


def _discover_survival_workspaces(repo_root: Path) -> List[tuple[str, str]]:
    """
    Discover workspaces that have test:survival script.
    Returns list of (workspace_name, relative_path) tuples.
    """
    root_pkg = _read_json(repo_root / "package.json")
    if not root_pkg or "workspaces" not in root_pkg:
        return []

    workspaces_patterns: List[str] = root_pkg.get("workspaces", [])
    candidates: List[tuple[str, str]] = []

    for pattern in workspaces_patterns:
        # Resolve glob patterns like "apps/*", "libs/*"
        if "*" in pattern:
            base_dir = repo_root / pattern.replace("/*", "")
            if base_dir.exists() and base_dir.is_dir():
                for subdir in base_dir.iterdir():
                    if subdir.is_dir():
                        pkg_path = subdir / "package.json"
                        if pkg_path.exists():
                            pkg_data = _read_json(pkg_path)
                            if isinstance(pkg_data, dict):
                                name = pkg_data.get("name", subdir.name)
                                rel_path = str(subdir.relative_to(repo_root)).replace("\\", "/")
                                candidates.append((name, rel_path))
        else:
            # Exact path
            subdir = repo_root / pattern
            if subdir.exists() and subdir.is_dir():
                pkg_path = subdir / "package.json"
                if pkg_path.exists():
                    pkg_data = _read_json(pkg_path)
                    if isinstance(pkg_data, dict):
                        name = pkg_data.get("name", subdir.name)
                        rel_path = str(subdir.relative_to(repo_root)).replace("\\", "/")
                        candidates.append((name, rel_path))

    # Filter: only those with test:survival
    discovered: List[tuple[str, str]] = []
    for name, rel_path in candidates:
        base = repo_root / rel_path
        pkg_path = base / "package.json"
        pkg_data = _read_json(pkg_path)
        if isinstance(pkg_data, dict):
            scripts = pkg_data.get("scripts", {})
            if scripts.get("test:survival"):
                discovered.append((name, rel_path))

    return discovered


def _check_component(repo_root: Path, key: str, rel_path: str) -> ComponentResult:
    base = repo_root / rel_path
    kind = _component_kind(base)
    evidence: List[Evidence] = []
    reasons: List[str] = []
    run: Optional[Dict[str, Any]] = None

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
            # Run survival script for all Node workspaces with test:survival
            run = _run_survival_script(repo_root, key)
            evidence.append(
                Evidence(
                    kind="run",
                    path=str(pkg.relative_to(repo_root)),
                    note=f"test:survival_exit_code={run['exit_code']}",
                )
            )
        else:
            reasons.append("MISSING_TEST_SURVIVAL_SCRIPT")
    else:
        if not (base / "tests").exists():
            reasons.append("MISSING_TESTS_DIR")

    survival_files = _find_survival_files(base)
    if survival_files:
        evidence.extend(survival_files)

    # Workflow evidence: look for ci-survival-<slug>.yml patterns
    workflow_evidence = _find_workflow_evidence(repo_root, key, "survival")
    if workflow_evidence:
        evidence.extend(workflow_evidence)

    if run and run.get("exit_code") != 0:
        reasons.append("SURVIVAL_SCRIPT_FAILED")

    has_core_evidence = has_script or bool(survival_files)
    status = "ok" if has_core_evidence else "fail"
    if status == "ok" and not reasons:
        reasons = []

    return ComponentResult(
        key=key,
        path=rel_path,
        kind=kind,
        status=status,
        reason_codes=reasons,
        evidence=evidence,
        run=run,
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=".", help="Repo root path")
    ap.add_argument("--out", default="artifacts/survival_check.json")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    out_path = (repo_root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Discover workspaces with test:survival generically
    discovered = _discover_survival_workspaces(repo_root)

    # Prepare components: (key_for_report, workspace_name_for_npm, rel_path)
    # key_for_report: simplified name for JSON key (e.g., "trustware" from "@aurora/trustware")
    # workspace_name_for_npm: full workspace name to use with npm run -w
    components: List[tuple[str, str, str]] = []
    for workspace_name, rel_path in discovered:
        # Use last component as key (e.g., "trustware" from "@aurora/trustware")
        key = workspace_name.split("/")[-1] if "/" in workspace_name else workspace_name
        components.append((key, workspace_name, rel_path))

    results: List[ComponentResult] = []
    for key, workspace_name, rel_path in components:
        # Pass workspace_name (full) but report under simplified key
        comp = _check_component(repo_root, workspace_name, rel_path)
        # Override key to simplified version
        comp.key = key
        results.append(comp)

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
