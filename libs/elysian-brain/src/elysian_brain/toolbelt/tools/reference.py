from __future__ import annotations

import hashlib
from typing import Any, Dict

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "reference"
TOOL_VERSION = "1.0.0"


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="reference",
        version=TOOL_VERSION,
        description=(
            "Deterministic reference resolver. Returns exact content for a reference id, "
            "without interpretation, rewriting, or analysis. "
            "Modes: inline (content passed in input), registry (placeholder for future adapters)."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "ref": {"type": "string", "description": "Reference identifier"},
                "mode": {"type": "string", "enum": ["inline", "registry"], "default": "inline"},
                "content": {"type": "string", "description": "Inline content (required in inline mode)"},
            },
            "required": ["ref"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {
                "ref": {"type": "string"},
                "content": {"type": "string"},
                "hash": {"type": "string", "description": "sha256 of content"},
            },
            "required": ["ref", "content", "hash"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(
                input={"ref": "doc:example", "mode": "inline", "content": "Art. 1o Texto integral."},
                output={
                    "ref": "doc:example",
                    "content": "Art. 1o Texto integral.",
                    "hash": "sha256:<computed>",
                },
            )
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    ref = inp.get("ref")
    mode = inp.get("mode", "inline")

    if not isinstance(ref, str) or not ref.strip():
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["REF_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    if mode not in ("inline", "registry"):
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["MODE_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    if mode == "inline":
        content = inp.get("content")
        if not isinstance(content, str):
            return ToolResult(
                tool=TOOL_NAME,
                ok=False,
                reason_codes=["CONTENT_REQUIRED"],
                output={},
                meta={"tool_version": TOOL_VERSION},
            )
        h = _sha256(content)
        return ToolResult(
            tool=TOOL_NAME,
            ok=True,
            reason_codes=[],
            output={"ref": ref, "content": content, "hash": f"sha256:{h}"},
            meta={"tool_version": TOOL_VERSION},
        )

    return ToolResult(
        tool=TOOL_NAME,
        ok=False,
        reason_codes=["REF_NOT_RESOLVED"],
        output={},
        meta={"tool_version": TOOL_VERSION},
    )


def _sha256(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()
