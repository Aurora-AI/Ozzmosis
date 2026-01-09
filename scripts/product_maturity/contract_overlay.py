#!/usr/bin/env python3
"""
Contract Overlay (Deterministic)

Objective:
- Apply Amazon Q contract rules without coupling to the existing auditor.
- Consume entrypoints_check JSON and emit a JSON overlay for SSOT.

Usage:
  python scripts/product_maturity/contract_overlay.py \
    --entrypoints artifacts/entrypoints_check.json \
    --out artifacts/contract_overlay.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--entrypoints", required=True)
    ap.add_argument("--out", default="artifacts/contract_overlay.json")
    args = ap.parse_args()

    entrypoints_path = Path(args.entrypoints)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    data = json.loads(entrypoints_path.read_text(encoding="utf-8"))
    results: List[Dict[str, Any]] = data.get("results", [])

    overlay: Dict[str, Any] = {
        "version": "1.0",
        "rules": [
            "TS lib: stable_contract cannot be green/yellow without src/index.ts OR package.json exports.",
            "PY lib: stable_contract cannot be green/yellow without __init__.py and __all__.",
            "Doc: stable_contract cannot be green if README Public API is missing (rule not enforced here).",
        ],
        "updates": [],
    }

    for result in results:
        if result.get("status") != "fail":
            continue
        overlay["updates"].append(
            {
                "lib_path": result.get("lib_path"),
                "lib_name": result.get("lib_name"),
                "kind": result.get("kind"),
                "force": {"stable_contract": "red"},
                "reason_codes": result.get("reason_codes", []),
            }
        )

    out_path.write_text(json.dumps(overlay, indent=2, ensure_ascii=False), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
