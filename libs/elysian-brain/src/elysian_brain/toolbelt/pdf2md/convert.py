from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import pdfplumber  # type: ignore

from .backend import select_runtime_backend


@dataclass(frozen=True)
class ConvertResult:
    source_pdf: str
    output_md: str
    engine: str
    hash_source: str
    hash_output: str
    extracted_pages: int


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_relpath(path: Path, base: Path) -> str:
    try:
        rel = path.resolve().relative_to(base.resolve())
        return rel.as_posix()
    except Exception:
        return path.name


def _to_front_matter(meta: Dict[str, Any]) -> str:
    lines = ["---"]
    for key, value in meta.items():
        if isinstance(value, (dict, list)):
            lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def _normalize_text_to_md(text: str) -> str:
    lines = [ln.rstrip() for ln in text.splitlines()]
    out = []
    blank = 0
    for ln in lines:
        if ln.strip() == "":
            blank += 1
            if blank <= 1:
                out.append("")
        else:
            blank = 0
            out.append(ln)
    return "\n".join(out).strip() + "\n"


def convert_pdf_to_md(
    source_pdf: Path,
    output_md: Path,
    vault_root: Optional[Path] = None,
    source_hint: Optional[str] = None,
) -> ConvertResult:
    if not source_pdf.exists():
        raise FileNotFoundError(f"PDF not found: {source_pdf}")

    output_md.parent.mkdir(parents=True, exist_ok=True)

    backend = select_runtime_backend()
    hash_source = sha256_file(source_pdf)

    extracted_pages = 0
    parts = []

    with pdfplumber.open(str(source_pdf)) as pdf:
        extracted_pages = len(pdf.pages)
        for i, page in enumerate(pdf.pages, start=1):
            page_text = page.extract_text() or ""
            if page_text.strip():
                parts.append(f"\n\n## Pagina {i}\n\n")
                parts.append(page_text)

    body = _normalize_text_to_md("\n".join(parts))
    hash_output = sha256_text(body)

    meta = {
        "doc_type": "rodobens_wealth_source",
        "source_pdf": _safe_relpath(source_pdf, vault_root) if vault_root else source_pdf.name,
        "source_hint": source_hint or "",
        "engine": backend.engine,
        "providers": backend.providers,
        "hash_source": hash_source,
        "hash_output": hash_output,
        "generated_at_utc": _utc_now_iso(),
    }

    md = _to_front_matter(meta) + "\n\n" + body

    output_md.write_text(md, encoding="utf-8")

    return ConvertResult(
        source_pdf=str(source_pdf),
        output_md=str(output_md),
        engine=backend.engine,
        hash_source=hash_source,
        hash_output=hash_output,
        extracted_pages=extracted_pages,
    )
