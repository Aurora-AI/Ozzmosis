Param(
  [Parameter(Mandatory = $true)][string]$SourceDir,
  [Parameter(Mandatory = $false)][string]$VaultRoot = "apps/ozzmosis/data/vault/rodobens-wealth",
  [Parameter(Mandatory = $false)][string]$Category = "general"
)

$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
}

Ensure-Dir $VaultRoot
Ensure-Dir "$VaultRoot/raw/$Category"
Ensure-Dir "$VaultRoot/processed/$Category"
Ensure-Dir "$VaultRoot/index"
Ensure-Dir "$VaultRoot/_runs"

$runId = (Get-Date).ToString("yyyyMMdd_HHmmss")
$runDir = "$VaultRoot/_runs/$runId"
Ensure-Dir $runDir

Write-Host "Rodobens PDF->MD ingest"
Write-Host "SourceDir: $SourceDir"
Write-Host "VaultRoot: $VaultRoot"
Write-Host "Category:  $Category"
Write-Host "RunId:     $runId"

Get-ChildItem -Path $SourceDir -Filter *.pdf -Recurse | ForEach-Object {
  $dest = Join-Path "$VaultRoot/raw/$Category" $_.Name
  Copy-Item $_.FullName $dest -Force
}

$py = ".\.venv\Scripts\python.exe"
if (-not (Test-Path $py)) { $py = "python" }

$script = @"
from pathlib import Path
import json
from elysian_brain.toolbelt.pdf2md import convert_pdf_to_md, build_index_json

vault = Path(r"$VaultRoot")
raw_dir = vault / "raw" / r"$Category"
out_dir = vault / "processed" / r"$Category"

results = []
for pdf in sorted(raw_dir.glob("*.pdf")):
    out = out_dir / (pdf.stem + ".md")
    res = convert_pdf_to_md(pdf, out, vault_root=vault, source_hint=r"$Category")
    results.append(res.__dict__)

index = build_index_json(vault / "processed", vault / "index" / "index.json")

(Path(r"$runDir") / "run_meta.json").write_text(json.dumps({
  "run_id": r"$runId",
  "category": r"$Category",
  "raw_dir": str(raw_dir),
  "processed_dir": str(out_dir),
  "converted": len(results)
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

(Path(r"$runDir") / "run_results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("OK", len(results), "converted; index entries:", index.get("count"))
"@

& $py -c $script
