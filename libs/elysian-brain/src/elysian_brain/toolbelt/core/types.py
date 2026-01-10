from __future__ import annotations

from typing import Any, Callable, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

ToolKind = Literal["calculator", "finance", "stats", "calendar", "reference", "search_local"]


class ToolExample(BaseModel):
    input: Dict[str, Any]
    output: Dict[str, Any]


class ToolSpec(BaseModel):
    name: str
    kind: ToolKind
    version: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    examples: List[ToolExample] = Field(default_factory=list)


class ToolCall(BaseModel):
    tool: str
    input: Dict[str, Any]
    request_id: Optional[str] = None


class ToolResult(BaseModel):
    tool: str
    ok: bool
    reason_codes: List[str] = Field(default_factory=list)
    output: Dict[str, Any] = Field(default_factory=dict)
    meta: Dict[str, Any] = Field(default_factory=dict)


ToolFn = Callable[[ToolCall], ToolResult]
