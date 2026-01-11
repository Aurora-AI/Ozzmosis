from __future__ import annotations

from typing import Dict

from .types import ToolFn, ToolSpec


class ToolRegistry:
    def __init__(self) -> None:
        self._specs: Dict[str, ToolSpec] = {}
        self._fns: Dict[str, ToolFn] = {}

    def register(self, spec: ToolSpec, fn: ToolFn) -> None:
        if spec.name in self._specs:
            raise ValueError(f"tool already registered: {spec.name}")
        self._specs[spec.name] = spec
        self._fns[spec.name] = fn

    def get_spec(self, name: str) -> ToolSpec:
        return self._specs[name]

    def list_specs(self) -> Dict[str, ToolSpec]:
        return dict(self._specs)

    def get_fn(self, name: str) -> ToolFn:
        return self._fns[name]
