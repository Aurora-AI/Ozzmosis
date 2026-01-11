from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Tuple

from ..core.types import ToolCall, ToolExample, ToolResult, ToolSpec

TOOL_NAME = "search_local"
TOOL_VERSION = "1.0.0"


def spec() -> ToolSpec:
    return ToolSpec(
        name=TOOL_NAME,
        kind="search_local",
        version=TOOL_VERSION,
        description=(
            "Deterministic local search over an inline corpus. "
            "This is a generic building block; future adapters may wire it to Chronos/Vault indexes. "
            "Returns matches with ref ids and small excerpts. No web search."
        ),
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "corpus": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ref": {"type": "string"},
                            "text": {"type": "string"},
                        },
                        "required": ["ref", "text"],
                        "additionalProperties": False,
                    },
                },
                "limit": {"type": "integer", "minimum": 1, "maximum": 20, "default": 5},
            },
            "required": ["query", "corpus"],
            "additionalProperties": False,
        },
        output_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "results": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ref": {"type": "string"},
                            "score": {"type": "number"},
                            "excerpt": {"type": "string"},
                            "hash": {"type": "string"},
                        },
                        "required": ["ref", "score", "excerpt", "hash"],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["query", "results"],
            "additionalProperties": False,
        },
        examples=[
            ToolExample(
                input={
                    "query": "peculato",
                    "corpus": [{"ref": "norm:example", "text": "Art. 312 Peculato ..."}],
                    "limit": 3,
                },
                output={
                    "query": "peculato",
                    "results": [
                        {
                            "ref": "norm:example",
                            "score": 1.0,
                            "excerpt": "Art. 312 Peculato ...",
                            "hash": "sha256:<computed>",
                        }
                    ],
                },
            )
        ],
    )


def run(call: ToolCall) -> ToolResult:
    inp: Dict[str, Any] = call.input or {}
    query = inp.get("query")
    corpus = inp.get("corpus")
    limit = inp.get("limit", 5)

    if not isinstance(query, str) or not query.strip():
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["QUERY_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    if not isinstance(corpus, list) or len(corpus) == 0:
        return ToolResult(
            tool=TOOL_NAME,
            ok=False,
            reason_codes=["CORPUS_INVALID"],
            output={},
            meta={"tool_version": TOOL_VERSION},
        )

    if not isinstance(limit, int) or limit < 1 or limit > 20:
        limit = 5

    q = query.lower().strip()
    scored: List[Tuple[str, float, str]] = []

    for item in corpus:
        if not isinstance(item, dict):
            continue
        ref = item.get("ref")
        text = item.get("text")
        if not isinstance(ref, str) or not isinstance(text, str):
            continue

        t = text.lower()
        score = _score(q, t)
        if score > 0:
            excerpt = _excerpt(text, q, max_len=180)
            scored.append((ref, score, excerpt))

    scored.sort(key=lambda x: x[1], reverse=True)
    scored = scored[:limit]

    out_results = []
    for ref, score, excerpt in scored:
        out_results.append(
            {
                "ref": ref,
                "score": float(score),
                "excerpt": excerpt,
                "hash": f"sha256:{_sha256(excerpt)}",
            }
        )

    return ToolResult(
        tool=TOOL_NAME,
        ok=True,
        reason_codes=[],
        output={"query": query, "results": out_results},
        meta={"tool_version": TOOL_VERSION},
    )


def _score(q: str, t: str) -> float:
    score = 0.0
    if q in t:
        score += 1.0
    tokens = [tok for tok in q.split() if tok]
    for tok in tokens:
        if tok in t:
            score += 0.1
    return score


def _excerpt(text: str, q: str, max_len: int = 180) -> str:
    low = text.lower()
    idx = low.find(q)
    if idx == -1:
        return text[:max_len]
    start = max(idx - 60, 0)
    end = min(start + max_len, len(text))
    return text[start:end]


def _sha256(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()
