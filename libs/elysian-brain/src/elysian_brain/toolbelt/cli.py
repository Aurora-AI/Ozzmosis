from __future__ import annotations

import json
import sys
from typing import Any, Dict

from pydantic import ValidationError

from . import build_registry, build_runner
from .core.types import ToolCall, ToolResult


def main() -> int:
    runner = build_runner()
    registry = build_registry()

    try:
        raw = sys.stdin.read()
        payload: Dict[str, Any] = json.loads(raw) if raw.strip() else {}
    except Exception:
        sys.stdout.write(json.dumps({"ok": False, "reason_codes": ["INVALID_JSON"]}))
        return 1

    if payload.get("op") == "list":
        specs = {k: v.model_dump() for k, v in registry.list_specs().items()}
        sys.stdout.write(json.dumps({"ok": True, "specs": specs}))
        return 0

    try:
        call = ToolCall.model_validate(payload)
    except ValidationError:
        res = ToolResult(
            tool=str(payload.get("tool", "unknown")),
            ok=False,
            reason_codes=["INPUT_SCHEMA_INVALID"],
            output={},
            meta={},
        )
        sys.stdout.write(res.model_dump_json())
        return 0

    res = runner.run(call)
    sys.stdout.write(res.model_dump_json())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
