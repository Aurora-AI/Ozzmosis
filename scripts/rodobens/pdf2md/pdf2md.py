from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

import yaml
from rich.console import Console
from rich.progress import track

console = Console()

DEFAULT_MIN_TEXT_CHARS = 300  # heuristica simples p/ detectar scans


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def safe_mkdir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_relpath(path: Path) -> str:
    return str(path.as_posix())


@dataclass
class ExtractionResult:
    markdown: str
    engine: str
    used_ocr: bool
    warnings: List[str]


def extract_text_and_tables_pdfplumber(pdf_path: Path) -> ExtractionResult:
    warnings: List[str] = []
    try:
        import pdfplumber  # type: ignore
    except Exception as exc:
        raise RuntimeError(f"pdfplumber nao disponivel: {exc}")

    md_lines: List[str] = []
    text_chars = 0

    with pdfplumber.open(str(pdf_path)) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            md_lines.append(f"\n\n## Pagina {i}\n")

            text = page.extract_text() or ""
            text_chars += len(text.strip())
            if text.strip():
                md_lines.append(text.strip())

            try:
                tables = page.extract_tables() or []
                for t_idx, table in enumerate(tables, start=1):
                    if not table or not table[0]:
                        continue

                    header = [str(c or "").strip() for c in table[0]]
                    rows = [[str(c or "").strip() for c in r] for r in table[1:]]

                    md_lines.append(f"\n\n### Tabela {i}.{t_idx}\n")
                    md_lines.append("| " + " | ".join(header) + " |")
                    md_lines.append("| " + " | ".join(["---"] * len(header)) + " |")
                    for r in rows:
                        if len(r) < len(header):
                            r = r + [""] * (len(header) - len(r))
                        md_lines.append("| " + " | ".join(r[: len(header)]) + " |")
            except Exception:
                warnings.append(f"Falha ao extrair tabela na pagina {i} (ignorado).")

    engine = "pdfplumber(text+tables)"
    md = "\n".join(md_lines).strip()
    if text_chars < DEFAULT_MIN_TEXT_CHARS:
        warnings.append("Pouco texto extraido; este PDF pode ser scan (OCR recomendado).")

    return ExtractionResult(markdown=md, engine=engine, used_ocr=False, warnings=warnings)


def select_ort_providers() -> List[str]:
    """
    Selecao em runtime. Nao garante que o EP esteja instalado.
    A ordem privilegia OpenVINO (Intel), depois CUDA, depois CoreML/Metal, depois CPU.
    """
    providers: List[str] = []
    providers.append("OpenVINOExecutionProvider")
    providers.append("CUDAExecutionProvider")
    providers.append("CoreMLExecutionProvider")
    providers.append("CPUExecutionProvider")
    return providers


def ocr_stub_not_enabled(_: Path) -> ExtractionResult:
    return ExtractionResult(
        markdown="",
        engine="ocr(unavailable)",
        used_ocr=True,
        warnings=[
            "OCR nao configurado. Instale deps opcionais e implemente o adaptador OCR conforme necessario."
        ],
    )


def extract_via_ocr(pdf_path: Path) -> ExtractionResult:
    """
    Placeholder deliberado: o OCR real depende de modelo/engine escolhido.
    A OS exige hardware-agnostic, mas nao exige OCR completo ja no dia 1.
    Implementacao minima: falhar de forma clara e governada.
    """
    return ocr_stub_not_enabled(pdf_path)


def build_frontmatter(meta: Dict[str, Any]) -> str:
    return "---\n" + yaml.safe_dump(meta, sort_keys=False, allow_unicode=True) + "---\n"


def write_index(index_path: Path, items: List[Dict[str, Any]]) -> None:
    safe_mkdir(index_path.parent)
    with index_path.open("w", encoding="utf-8") as f:
        json.dump({"items": items, "generated_at": now_utc_iso()}, f, ensure_ascii=False, indent=2)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="Diretorio raiz com PDFs (ex: OneDrive\\Rodobens)")
    ap.add_argument(
        "--vault",
        required=True,
        help="Caminho do vault no repo (apps/ozzmosis/data/vault/rodobens-wealth)",
    )
    ap.add_argument("--mode", choices=["text", "ocr", "auto"], default="auto")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    input_dir = Path(args.input).expanduser().resolve()
    vault_root = Path(args.vault).resolve()

    sources_inbox = vault_root / "sources" / "_inbox"
    sources_root = vault_root / "sources"
    out_root = vault_root / "knowledge" / "_generated"
    evidence_root = vault_root / "evidence"
    index_path = vault_root / "knowledge" / "_index" / "index.json"

    for p in [sources_inbox, sources_root, out_root, evidence_root]:
        safe_mkdir(p)

    pdfs = sorted([p for p in input_dir.rglob("*.pdf") if p.is_file()])
    console.print(f"[bold]Encontrados {len(pdfs)} PDFs[/bold] em {input_dir}")

    index_items: List[Dict[str, Any]] = []
    run_id = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    for pdf_path in track(pdfs, description="Convertendo PDFs"):
        rel = pdf_path.relative_to(input_dir)
        safe_rel = Path(*rel.parts)

        inbox_target = sources_inbox / safe_rel
        safe_mkdir(inbox_target.parent)

        if not args.dry_run:
            inbox_target.write_bytes(pdf_path.read_bytes())

        source_hash = sha256_file(pdf_path)
        md_target = out_root / safe_rel.with_suffix(".md")
        safe_mkdir(md_target.parent)

        if args.mode == "text":
            res = extract_text_and_tables_pdfplumber(pdf_path)
        elif args.mode == "ocr":
            res = extract_via_ocr(pdf_path)
        else:
            res_text = extract_text_and_tables_pdfplumber(pdf_path)
            if any("scan" in w.lower() for w in res_text.warnings):
                res_ocr = extract_via_ocr(pdf_path)
                res = res_ocr if res_ocr.markdown.strip() else res_text
            else:
                res = res_text

        output_meta = {
            "source_pdf_rel": normalize_relpath(rel),
            "source_hash_sha256": source_hash,
            "generated_at": now_utc_iso(),
            "engine": res.engine,
            "used_ocr": res.used_ocr,
            "warnings": res.warnings,
        }
        md_body = build_frontmatter(output_meta) + "\n" + res.markdown.strip() + "\n"
        out_hash = hashlib.sha256(md_body.encode("utf-8")).hexdigest()
        output_meta["output_hash_sha256"] = out_hash

        if not args.dry_run:
            md_target.write_text(md_body, encoding="utf-8")

        index_items.append(
            {
                "pdf_rel": normalize_relpath(rel),
                "md_rel": normalize_relpath(md_target.relative_to(vault_root)),
                "source_hash_sha256": source_hash,
                "output_hash_sha256": out_hash,
                "engine": res.engine,
                "used_ocr": res.used_ocr,
            }
        )

    if not args.dry_run:
        write_index(index_path, index_items)
        (evidence_root / f"pdf2md_run_{run_id}.json").write_text(
            json.dumps({"run_id": run_id, "count": len(index_items), "items": index_items}, indent=2),
            encoding="utf-8",
        )

    console.print("[green]OK[/green] - Conversao concluida.")
    console.print(f"Index: {index_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
