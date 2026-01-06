#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-}"
VAULT_ROOT="${2:-apps/ozzmosis/data/vault/rodobens-wealth}"
CATEGORY="${3:-general}"

if [[ -z "${SOURCE_DIR}" ]]; then
  echo "Usage: scripts/rodobens/pdf2md.sh <SourceDir> [VaultRoot] [Category]"
  exit 2
fi

mkdir -p "${VAULT_ROOT}/raw/${CATEGORY}" "${VAULT_ROOT}/processed/${CATEGORY}" "${VAULT_ROOT}/index" "${VAULT_ROOT}/_runs"

RUN_ID="$(date +"%Y%m%d_%H%M%S")"
RUN_DIR="${VAULT_ROOT}/_runs/${RUN_ID}"
mkdir -p "${RUN_DIR}"

echo "Rodobens PDF->MD ingest"
echo "SourceDir: ${SOURCE_DIR}"
echo "VaultRoot: ${VAULT_ROOT}"
echo "Category:  ${CATEGORY}"
echo "RunId:     ${RUN_ID}"

find "${SOURCE_DIR}" -type f -name "*.pdf" -print0 | while IFS= read -r -d '' f; do
  cp -f "${f}" "${VAULT_ROOT}/raw/${CATEGORY}/$(basename "${f}")"
done

PY=".venv/bin/python"
if [[ ! -x "${PY}" ]]; then PY="python"; fi

"${PY}" - <<PY
from pathlib import Path
import json
from elysian_brain.toolbelt.pdf2md import convert_pdf_to_md, build_index_json

vault = Path("${VAULT_ROOT}")
raw_dir = vault / "raw" / "${CATEGORY}"
out_dir = vault / "processed" / "${CATEGORY}"

results = []
for pdf in sorted(raw_dir.glob("*.pdf")):
    out = out_dir / (pdf.stem + ".md")
    res = convert_pdf_to_md(pdf, out, vault_root=vault, source_hint="${CATEGORY}")
    results.append(res.__dict__)

index = build_index_json(vault / "processed", vault / "index" / "index.json")

(Path("${RUN_DIR}") / "run_meta.json").write_text(json.dumps({
  "run_id": "${RUN_ID}",
  "category": "${CATEGORY}",
  "raw_dir": str(raw_dir),
  "processed_dir": str(out_dir),
  "converted": len(results)
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

(Path("${RUN_DIR}") / "run_results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("OK", len(results), "converted; index entries:", index.get("count"))
PY
