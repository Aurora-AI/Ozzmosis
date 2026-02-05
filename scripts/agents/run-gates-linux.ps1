param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
)

$ErrorActionPreference = "Stop"

Write-Output "== Gates (Linux container): repo-root = $RepoRoot =="

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker not found. Install Docker Desktop and retry."
}

docker run --rm -t `
  -v "${RepoRoot}:/repo" `
  -v ozzmosis_root_node_modules:/repo/node_modules `
  -w /repo `
  node:20-slim bash -lc @"
set -euo pipefail
apt-get update -y >/dev/null
apt-get install -y git python3 python3-pip ca-certificates >/dev/null

echo '== npm ci =='
npm ci

echo '== repo:check =='
npm run -w @aurora/tooling repo:check

echo '== audit: entrypoints_check =='
python3 scripts/audit/entrypoints_check.py --repo-root . --out artifacts/entrypoints_check.json

echo '== audit: survival_check =='
python3 scripts/audit/survival_check.py --repo-root . --out artifacts/survival_check.json

echo '== done =='
ls -la artifacts/entrypoints_check.json artifacts/survival_check.json
"@

Write-Output "== Gates (Linux container): PASS =="
