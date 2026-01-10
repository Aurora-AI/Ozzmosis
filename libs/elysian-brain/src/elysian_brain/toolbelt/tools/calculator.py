from __future__ import annotations

import ast
import math
from typing import Any, Dict

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "calculator"
TOOL_VERSION = "1.0.0"


_ALLOWED_BINOPS = {
    ast.Add: lambda a, b: a + b,
    ast.Sub: lambda a, b: a - b,
    ast.Mult: lambda a, b: a * b,
    ast.Div: lambda a, b: a / b,
    ast.Mod: lambda a, b: a % b,
    ast.Pow: lambda a, b: a**b,
}

_ALLOWED_UNARYOPS = {
    ast.UAdd: lambda a: +a,
    ast.USub: lambda a: -a,
}

_SCI_FUNCS = {
    "sqrt": math.sqrt,
    "log": math.log,
    "log10": math.log10,
    "exp": math.exp,
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "pi": math.pi,
    "e": math.e,
}


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="calculator",
        version=TOOL_VERSION,
        description=(
            "Deterministic calculator for safe arithmetic expressions. "
            "Supports standard operators (+,-,*,/,%,**) and (in scientific mode) "
            "sqrt/log/log10/exp/sin/cos/tan and constants pi,e."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "expression": {"type": "string"},
                "mode": {"type": "string", "enum": ["standard", "scientific"], "default": "standard"},
            },
            "required": ["expression"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {
                "value": {"type": "number"},
            },
            "required": ["value"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(input={"expression": "2+2", "mode": "standard"}, output={"value": 4.0}),
            ToolExample(input={"expression": "sqrt(9) + 1", "mode": "scientific"}, output={"value": 4.0}),
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    expr = inp.get("expression")
    mode = inp.get("mode", "standard")

    if not isinstance(expr, str) or not expr.strip():
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["INPUT_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    if mode not in ("standard", "scientific"):
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["MODE_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    try:
        value = _eval_expr(expr, scientific=(mode == "scientific"))
        return ToolResult(
            tool=TOOL_NAME,
            ok=True,
            reason_codes=[],
            output={"value": float(value)},
            meta={"tool_version": TOOL_VERSION},
        )
    except ZeroDivisionError:
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["DIV_BY_ZERO"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )
    except Exception:
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["EXPRESSION_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )


def _eval_expr(expression: str, scientific: bool) -> float:
    node = ast.parse(expression, mode="eval")
    return float(_eval_node(node.body, scientific=scientific))


def _eval_node(node: ast.AST, scientific: bool) -> float:
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return float(node.value)

    if isinstance(node, ast.BinOp):
        op_type = type(node.op)
        if op_type not in _ALLOWED_BINOPS:
            raise ValueError("binop_not_allowed")
        left = _eval_node(node.left, scientific=scientific)
        right = _eval_node(node.right, scientific=scientific)
        return float(_ALLOWED_BINOPS[op_type](left, right))

    if isinstance(node, ast.UnaryOp):
        op_type = type(node.op)
        if op_type not in _ALLOWED_UNARYOPS:
            raise ValueError("unary_not_allowed")
        operand = _eval_node(node.operand, scientific=scientific)
        return float(_ALLOWED_UNARYOPS[op_type](operand))

    if isinstance(node, ast.Call):
        if not scientific:
            raise ValueError("calls_not_allowed_in_standard_mode")
        if not isinstance(node.func, ast.Name):
            raise ValueError("invalid_func")
        name = node.func.id
        if name not in _SCI_FUNCS:
            raise ValueError("func_not_allowed")
        fn = _SCI_FUNCS[name]
        args = [_eval_node(a, scientific=scientific) for a in node.args]
        if isinstance(fn, (float, int)):
            if args:
                raise ValueError("constant_called")
            return float(fn)
        return float(fn(*args))

    if isinstance(node, ast.Name):
        if not scientific:
            raise ValueError("name_not_allowed")
        name = node.id
        if name in ("pi", "e"):
            return float(_SCI_FUNCS[name])  # type: ignore[arg-type]
        raise ValueError("name_not_allowed")

    raise ValueError("node_not_allowed")
