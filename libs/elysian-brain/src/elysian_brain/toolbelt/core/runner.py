from __future__ import annotations

from .registry import ToolRegistry
from .types import ToolCall, ToolResult


class ToolRunner:
    def __init__(self, registry: ToolRegistry) -> None:
        self.registry = registry

    def run(self, call: ToolCall) -> ToolResult:
        specs = self.registry.list_specs()
        if call.tool not in specs:
            return ToolResult(
                tool=call.tool,
                ok=False,
                reason_codes=["TOOL_NOT_FOUND"],
                output={},
                meta={},
            )
        fn = self.registry.get_fn(call.tool)
        return fn(call)
