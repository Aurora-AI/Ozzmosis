from __future__ import annotations

import math
from typing import Any, Dict, List

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "stats"
TOOL_VERSION = "1.0.0"


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="stats",
        version=TOOL_VERSION,
        description=(
            "Deterministic descriptive statistics. Supported ops: mean, median, variance, stdev, percentile."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "op": {"type": "string", "enum": ["mean", "median", "variance", "stdev", "percentile"]},
                "values": {"type": "array", "items": {"type": "number"}, "minItems": 1},
                "p": {"type": "number", "minimum": 0, "maximum": 100, "description": "percentile (0-100)"},
                "sample": {"type": "boolean", "default": True, "description": "sample variance/stdev if True"},
                "round": {"type": "integer", "minimum": 0, "maximum": 8, "default": 4},
            },
            "required": ["op", "values"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {"op": {"type": "string"}, "value": {"type": "number"}, "details": {"type": "object"}},
            "required": ["op", "value", "details"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(input={"op": "mean", "values": [1, 2, 3]}, output={"op": "mean", "value": 2.0, "details": {"n": 3}})
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    op = inp.get("op")
    values = inp.get("values")
    round_n = inp.get("round", 4)
    sample = inp.get("sample", True)
    p = inp.get("p")

    if not isinstance(op, str):
        return _fail(["OP_INVALID"])
    if not isinstance(values, list) or len(values) == 0 or not all(isinstance(v, (int, float)) for v in values):
        return _fail(["VALUES_INVALID"])
    if not isinstance(round_n, int) or round_n < 0 or round_n > 8:
        round_n = 4
    if not isinstance(sample, bool):
        sample = True

    xs = [float(v) for v in values]
    n = len(xs)

    try:
        if op == "mean":
            val = sum(xs) / n
            return _ok(op, _rnd(val, round_n), {"n": n})

        if op == "median":
            xs2 = sorted(xs)
            mid = n // 2
            if n % 2 == 1:
                val = xs2[mid]
            else:
                val = (xs2[mid - 1] + xs2[mid]) / 2.0
            return _ok(op, _rnd(val, round_n), {"n": n})

        if op in ("variance", "stdev"):
            mean = sum(xs) / n
            ss = sum((x - mean) ** 2 for x in xs)
            denom = (n - 1) if sample else n
            if denom <= 0:
                return _fail(["N_TOO_SMALL"])
            var = ss / denom
            if op == "variance":
                return _ok(op, _rnd(var, round_n), {"n": n, "sample": sample})
            sd = math.sqrt(var)
            return _ok("stdev", _rnd(sd, round_n), {"n": n, "sample": sample})

        if op == "percentile":
            if not isinstance(p, (int, float)):
                return _fail(["P_INVALID"])
            prc = float(p)
            xs2 = sorted(xs)
            if n == 1:
                return _ok(op, _rnd(xs2[0], round_n), {"n": n, "p": prc})
            rank = (prc / 100.0) * (n - 1)
            lo = int(math.floor(rank))
            hi = int(math.ceil(rank))
            if lo == hi:
                val = xs2[lo]
            else:
                w = rank - lo
                val = xs2[lo] * (1 - w) + xs2[hi] * w
            return _ok(op, _rnd(val, round_n), {"n": n, "p": prc})

        return _fail(["OP_UNSUPPORTED"])
    except Exception:
        return _fail(["INPUT_INVALID"])


def _ok(op: str, value: float, details: Dict[str, Any]) -> ToolResult:
    return ToolResult(tool=TOOL_NAME, ok=True, reason_codes=[], output={"op": op, "value": value, "details": details}, meta={"tool_version": TOOL_VERSION})


def _fail(codes: List[str]) -> ToolResult:
    return ToolResult(tool=TOOL_NAME, ok=False, reason_codes=codes, output={}, meta={"tool_version": TOOL_VERSION})


def _rnd(x: float, n: int) -> float:
    return float(round(x, n))
