from __future__ import annotations

import math
from typing import Any, Dict, List, Optional

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "finance"
TOOL_VERSION = "1.0.0"


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="finance",
        version=TOOL_VERSION,
        description=(
            "Deterministic finance functions. Generic building blocks (no domain specialization). "
            "Supported ops: simple_interest, compound_interest, fv, pv, pmt (annuity), "
            "amortization_price (summary schedule)."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "op": {
                    "type": "string",
                    "enum": [
                        "simple_interest",
                        "compound_interest",
                        "fv",
                        "pv",
                        "pmt",
                        "amortization_price",
                    ],
                },
                "rate": {"type": "number", "description": "Rate per period as decimal, e.g. 0.02"},
                "nper": {"type": "integer", "minimum": 1, "description": "Number of periods"},
                "pv": {"type": "number", "description": "Present value"},
                "fv": {"type": "number", "description": "Future value"},
                "pmt": {"type": "number", "description": "Payment per period"},
                "principal": {"type": "number", "description": "Principal amount (alias for pv in some ops)"},
                "periods": {"type": "integer", "minimum": 1, "description": "Alias for nper"},
                "round": {"type": "integer", "minimum": 0, "maximum": 8, "default": 2},
                "schedule_limit": {"type": "integer", "minimum": 1, "maximum": 60, "default": 12},
            },
            "required": ["op"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {
                "op": {"type": "string"},
                "value": {"type": "number"},
                "details": {"type": "object"},
            },
            "required": ["op", "value", "details"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(
                input={"op": "compound_interest", "principal": 1000, "rate": 0.02, "nper": 12},
                output={"op": "compound_interest", "value": 1268.24, "details": {"principal": 1000, "rate": 0.02, "nper": 12}},
            )
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    op = inp.get("op")
    r = inp.get("rate")
    nper = inp.get("nper", inp.get("periods"))
    round_n = inp.get("round", 2)
    sched_limit = inp.get("schedule_limit", 12)

    if not isinstance(op, str):
        return _fail(["OP_INVALID"])
    if not isinstance(round_n, int) or round_n < 0 or round_n > 8:
        round_n = 2
    if not isinstance(sched_limit, int) or sched_limit < 1 or sched_limit > 60:
        sched_limit = 12

    try:
        if op == "simple_interest":
            principal = _num(inp.get("principal", inp.get("pv")))
            rate = _num(r)
            periods = _int(nper)
            value = principal * (1.0 + rate * periods)
            return _ok(op, _rnd(value, round_n), {"principal": principal, "rate": rate, "nper": periods})

        if op == "compound_interest":
            principal = _num(inp.get("principal", inp.get("pv")))
            rate = _num(r)
            periods = _int(nper)
            value = principal * ((1.0 + rate) ** periods)
            return _ok(op, _rnd(value, round_n), {"principal": principal, "rate": rate, "nper": periods})

        if op == "fv":
            pv = _num(inp.get("pv"))
            rate = _num(r)
            periods = _int(nper)
            pmt = _num(inp.get("pmt", 0.0))
            if rate == 0:
                value = -pv - pmt * periods
            else:
                value = -pv * ((1.0 + rate) ** periods) - pmt * (((1.0 + rate) ** periods - 1.0) / rate)
            return _ok(op, _rnd(value, round_n), {"pv": pv, "rate": rate, "nper": periods, "pmt": pmt})

        if op == "pv":
            fv = _num(inp.get("fv"))
            rate = _num(r)
            periods = _int(nper)
            pmt = _num(inp.get("pmt", 0.0))
            if rate == 0:
                value = -(fv + pmt * periods)
            else:
                value = -(fv + pmt * (((1.0 + rate) ** periods - 1.0) / rate)) / ((1.0 + rate) ** periods)
            return _ok(op, _rnd(value, round_n), {"fv": fv, "rate": rate, "nper": periods, "pmt": pmt})

        if op == "pmt":
            rate = _num(r)
            periods = _int(nper)
            pv = _num(inp.get("pv", 0.0))
            fv = _num(inp.get("fv", 0.0))
            if periods <= 0:
                raise ValueError("nper_invalid")
            if rate == 0:
                value = -(fv + pv) / periods
            else:
                pow_ = (1.0 + rate) ** periods
                value = -(rate * (fv + pv * pow_)) / (pow_ - 1.0)
            return _ok(op, _rnd(value, round_n), {"pv": pv, "fv": fv, "rate": rate, "nper": periods})

        if op == "amortization_price":
            principal = _num(inp.get("principal", inp.get("pv")))
            rate = _num(r)
            periods = _int(nper)
            if periods <= 0:
                raise ValueError("nper_invalid")
            pmt_val = _pmt(rate, periods, principal, 0.0)
            schedule = []
            balance = principal
            for i in range(1, min(periods, sched_limit) + 1):
                interest = balance * rate
                amort = pmt_val - interest
                balance = max(balance - amort, 0.0)
                schedule.append(
                    {
                        "period": i,
                        "payment": _rnd(pmt_val, round_n),
                        "interest": _rnd(interest, round_n),
                        "amortization": _rnd(amort, round_n),
                        "balance": _rnd(balance, round_n),
                    }
                )
            details = {
                "principal": principal,
                "rate": rate,
                "nper": periods,
                "payment": _rnd(pmt_val, round_n),
                "schedule_preview": schedule,
                "schedule_limit": sched_limit,
            }
            return _ok(op, _rnd(pmt_val, round_n), details)

        return _fail(["OP_UNSUPPORTED"])
    except ZeroDivisionError:
        return _fail(["DIV_BY_ZERO"])
    except Exception:
        return _fail(["INPUT_INVALID"])


def _ok(op: str, value: float, details: Dict[str, Any]) -> ToolResult:
    return ToolResult(
        tool=TOOL_NAME,
        ok=True,
        reason_codes=[],
        output={"op": op, "value": value, "details": details},
        meta={"tool_version": TOOL_VERSION},
    )


def _fail(codes: List[str]) -> ToolResult:
    return ToolResult(tool=TOOL_NAME, ok=False, reason_codes=codes, output={}, meta={"tool_version": TOOL_VERSION})


def _num(x: Any) -> float:
    if isinstance(x, (int, float)):
        return float(x)
    raise ValueError("num_invalid")


def _int(x: Any) -> int:
    if isinstance(x, int):
        return x
    raise ValueError("int_invalid")


def _rnd(x: float, n: int) -> float:
    return float(round(x, n))


def _pmt(rate: float, nper: int, pv: float, fv: float) -> float:
    if rate == 0:
        return (pv + fv) / nper
    pow_ = (1.0 + rate) ** nper
    return (rate * (fv + pv * pow_)) / (pow_ - 1.0)
