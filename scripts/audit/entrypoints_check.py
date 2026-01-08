#!/usr/bin/env python3
"""
Entrypoints Check (Deterministic)
- TS lib: requires src/index.ts OR package.json exports.
- Python lib: requires src/<pkg>/__init__.py and __all__.

Usage:
  python scripts/audit/entrypoints_check.py --repo-root . --out artifacts/entrypoints_check.json
Exit code:
  0 = ok
  2 = entrypoints/contract failure
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class Finding:
    lib_path: str
    lib_name: str
    kind: str  # "ts" | "py" | "unknown"
    status: str  # "ok" | "fail" | "skip"
    reason_codes: List[str]
    details: Dict[str, Any]


def _read_json(path: Path) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _detect_ts_lib(lib_dir: Path) -> Optional[Dict[str, Any]]:
    pkg = lib_dir / "package.json"
    if not pkg.exists():
        return None
    data = _read_json(pkg)
    if not isinstance(data, dict):
        return {"package_json": str(pkg), "parse_error": True}
    return {"package_json": str(pkg), "data": data}


def _detect_py_lib(lib_dir: Path) -> Optional[Dict[str, Any]]:
    pyproject = lib_dir / "pyproject.toml"
    setup_cfg = lib_dir / "setup.cfg"
    if not pyproject.exists() and not setup_cfg.exists():
        return None
    return {
        "pyproject": str(pyproject) if pyproject.exists() else None,
        "setup_cfg": str(setup_cfg) if setup_cfg.exists() else None,
    }


def _ts_has_entrypoint(
    lib_dir: Path, pkg_data: Dict[str, Any]
) -> Tuple[bool, List[str], Dict[str, Any]]:
    reasons: List[str] = []
    details: Dict[str, Any] = {}

    src_index = lib_dir / "src" / "index.ts"
    root_index = lib_dir / "index.ts"

    exports_field = pkg_data.get("exports")
    main_field = pkg_data.get("main")
    types_field = pkg_data.get("types") or pkg_data.get("typings")

    has_src_index = src_index.exists()
    has_root_index = root_index.exists()
    has_exports = exports_field is not None

    details.update(
        {
            "src_index_ts": str(src_index),
            "src_index_exists": has_src_index,
            "root_index_ts": str(root_index),
            "root_index_exists": has_root_index,
            "package_exports_present": has_exports,
            "package_main": main_field,
            "package_types": types_field,
        }
    )

    if has_src_index or has_root_index:
        return True, reasons, details

    if not has_exports:
        reasons.append("MISSING_ENTRYPOINT_TS")
        reasons.append("MISSING_PACKAGE_EXPORTS_TS")
        return False, reasons, details

    ok = False
    if isinstance(exports_field, str):
        ok = True
    elif isinstance(exports_field, dict):
        if "." in exports_field or "./" in exports_field:
            ok = True
        elif any(str(k).startswith(".") for k in exports_field.keys()):
            ok = True
    if not ok:
        reasons.append("INVALID_PACKAGE_EXPORTS_TS")
        return False, reasons, details

    return True, reasons, details


def _py_find_package_dir(lib_dir: Path) -> Optional[Path]:
    src = lib_dir / "src"
    if not src.exists():
        return None
    candidates = [p for p in src.iterdir() if p.is_dir() and not p.name.startswith((".", "_"))]
    if len(candidates) == 1:
        return candidates[0]
    for candidate in candidates:
        if (candidate / "__init__.py").exists():
            return candidate
    return None


def _py_has_entrypoint(lib_dir: Path) -> Tuple[bool, List[str], Dict[str, Any]]:
    reasons: List[str] = []
    details: Dict[str, Any] = {}

    pkg_dir = _py_find_package_dir(lib_dir)
    if pkg_dir is None:
        reasons.append("MISSING_PY_SRC_PACKAGE_DIR")
        details["expected"] = "libs/<lib>/src/<package>/__init__.py"
        return False, reasons, details

    init_py = pkg_dir / "__init__.py"
    details["package_dir"] = str(pkg_dir)
    details["init_py"] = str(init_py)

    if not init_py.exists():
        reasons.append("MISSING_INIT_PY")
        return False, reasons, details

    try:
        txt = init_py.read_text(encoding="utf-8")
    except Exception:
        reasons.append("INIT_PY_READ_ERROR")
        return False, reasons, details

    if "__all__" not in txt:
        reasons.append("MISSING___ALL___IN_INIT")
        return False, reasons, details

    return True, reasons, details


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=".", help="Repo root path")
    ap.add_argument(
        "--out",
        default="artifacts/entrypoints_check.json",
        help="Output json file",
    )
    ap.add_argument("--libs-dir", default="libs", help="Libs dir relative to repo root")
    ap.add_argument("--apps-dir", default="apps", help="Apps dir relative to repo root")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    libs_dir = (repo_root / args.libs_dir).resolve()
    apps_dir = (repo_root / args.apps_dir).resolve()
    out_path = (repo_root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    results: List[Finding] = []

    if not libs_dir.exists():
        payload = {
            "ok": False,
            "error": f"libs_dir_not_found: {str(libs_dir)}",
            "results": [],
            "scanned_roots": ["libs", "apps"],
        }
        out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        return 2

    scan_roots = [("libs", libs_dir), ("apps", apps_dir)]
    for _, root in scan_roots:
        if not root.exists():
            continue
        for lib in sorted([p for p in root.iterdir() if p.is_dir()]):
            lib_name = lib.name

            ts = _detect_ts_lib(lib)
            py = _detect_py_lib(lib)

            if ts and "data" in ts:
                pkg_data = ts["data"]
                ok, reasons, details = _ts_has_entrypoint(lib, pkg_data)
                status = "ok" if ok else "fail"
                results.append(
                    Finding(
                        lib_path=str(lib.relative_to(repo_root)),
                        lib_name=str(pkg_data.get("name", lib_name)),
                        kind="ts",
                        status=status,
                        reason_codes=reasons,
                        details=details,
                    )
                )
                continue

            if py:
                ok, reasons, details = _py_has_entrypoint(lib)
                status = "ok" if ok else "fail"
                results.append(
                    Finding(
                        lib_path=str(lib.relative_to(repo_root)),
                        lib_name=lib_name,
                        kind="py",
                        status=status,
                        reason_codes=reasons,
                        details=details,
                    )
                )
                continue

            results.append(
                Finding(
                    lib_path=str(lib.relative_to(repo_root)),
                    lib_name=lib_name,
                    kind="unknown",
                    status="skip",
                    reason_codes=["NOT_TS_OR_PY_LIB"],
                    details={},
                )
            )

    failed = [r for r in results if r.status == "fail"]

    payload = {
        "ok": len(failed) == 0,
        "failed_count": len(failed),
        "results": [asdict(r) for r in results],
        "scanned_roots": ["libs", "apps"],
    }
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return 0 if len(failed) == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
