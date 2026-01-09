from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List


@dataclass(frozen=True)
class IndexEntry:
    relpath: str
    hash_source: str
    hash_output: str
    engine: str


def build_index_json(processed_dir: Path, index_path: Path) -> Dict[str, Any]:
    entries: List[IndexEntry] = []

    for md in sorted(processed_dir.rglob("*.md")):
        text = md.read_text(encoding="utf-8", errors="ignore")

        def find_value(key: str) -> str:
            needle = f"{key}:"
            for line in text.splitlines()[:80]:
                if line.startswith(needle):
                    return line.split(":", 1)[1].strip().strip('"')
            return ""

        entries.append(
            IndexEntry(
                relpath=md.relative_to(processed_dir).as_posix(),
                hash_source=find_value("hash_source"),
                hash_output=find_value("hash_output"),
                engine=find_value("engine"),
            )
        )

    payload = {
        "version": 1,
        "root": processed_dir.name,
        "count": len(entries),
        "entries": [entry.__dict__ for entry in entries],
    }

    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return payload
