from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "calendar"
TOOL_VERSION = "1.0.0"


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="calendar",
        version=TOOL_VERSION,
        description=(
            "Deterministic calendar utilities (no system clock). Supported ops: "
            "parse_iso_date, add_days, diff_days, add_months."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "op": {"type": "string", "enum": ["parse_iso_date", "add_days", "diff_days", "add_months"]},
                "iso": {"type": "string", "description": "ISO date (YYYY-MM-DD)"},
                "iso_a": {"type": "string"},
                "iso_b": {"type": "string"},
                "days": {"type": "integer"},
                "months": {"type": "integer"},
            },
            "required": ["op"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {"op": {"type": "string"}, "value": {"type": "string"}, "details": {"type": "object"}},
            "required": ["op", "value", "details"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(input={"op": "add_days", "iso": "2026-01-01", "days": 10}, output={"op": "add_days", "value": "2026-01-11", "details": {}}),
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    op = inp.get("op")

    if not isinstance(op, str):
        return _fail(["OP_INVALID"])

    try:
        if op == "parse_iso_date":
            iso = _str(inp.get("iso"))
            d = _parse_date(iso)
            return _ok(op, d.isoformat(), {})

        if op == "add_days":
            iso = _str(inp.get("iso"))
            days = _int(inp.get("days"))
            d = _parse_date(iso) + timedelta(days=days)
            return _ok(op, d.isoformat(), {"days": days})

        if op == "diff_days":
            a = _parse_date(_str(inp.get("iso_a")))
            b = _parse_date(_str(inp.get("iso_b")))
            delta = (b - a).days
            return _ok(op, str(delta), {"iso_a": a.isoformat(), "iso_b": b.isoformat()})

        if op == "add_months":
            iso = _str(inp.get("iso"))
            months = _int(inp.get("months"))
            d = _parse_date(iso)
            d2 = _add_months(d, months)
            return _ok(op, d2.isoformat(), {"months": months})

        return _fail(["OP_UNSUPPORTED"])
    except Exception:
        return _fail(["INPUT_INVALID"])


def _add_months(d: date, months: int) -> date:
    year = d.year + (d.month - 1 + months) // 12
    month = (d.month - 1 + months) % 12 + 1
    day = min(d.day, _days_in_month(year, month))
    return date(year, month, day)


def _days_in_month(year: int, month: int) -> int:
    if month == 12:
        nxt = date(year + 1, 1, 1)
    else:
        nxt = date(year, month + 1, 1)
    cur = date(year, month, 1)
    return (nxt - cur).days


def _parse_date(s: str) -> date:
    return datetime.strptime(s, "%Y-%m-%d").date()


def _ok(op: str, value: str, details: Dict[str, Any]) -> ToolResult:
    return ToolResult(tool=TOOL_NAME, ok=True, reason_codes=[], output={"op": op, "value": value, "details": details}, meta={"tool_version": TOOL_VERSION})


def _fail(codes: List[str]) -> ToolResult:
    return ToolResult(tool=TOOL_NAME, ok=False, reason_codes=codes, output={}, meta={"tool_version": TOOL_VERSION})


def _str(x: Any) -> str:
    if isinstance(x, str) and x.strip():
        return x
    raise ValueError("str_invalid")


def _int(x: Any) -> int:
    if isinstance(x, int):
        return x
    raise ValueError("int_invalid")
