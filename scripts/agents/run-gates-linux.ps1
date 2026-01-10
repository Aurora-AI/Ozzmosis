#!/usr/bin/env pwsh
# scripts/agents/run-gates-linux.ps1
# Canonical Linux-container gate runner for Ozzmosis.
# Purpose: avoid Windows EPERM/EBUSY locks on native Node addons (*.node) during npm ci.
# Runs: npm ci + repo:check + audit:maturity (entrypoints_check + survival_check) inside node:20-slim.

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Write-Output "[gates-linux] repoRoot: $repoRoot"

# Preconditions:
# - Docker Desktop installed and running
# - Access to pull node:20-slim image

docker run --rm -t `
  -v "${repoRoot}:/repo" `
  -w /repo `
  node:20-slim bash -lc @"
set -euo pipefail

apt-get update
apt-get install -y --no-install-recommends git ca-certificates python3 >/dev/null

npm ci
npm run -w @aurora/tooling repo:check

python3 scripts/audit/entrypoints_check.py --repo-root . --out artifacts/entrypoints_check.json
python3 scripts/audit/survival_check.py --repo-root . --out artifacts/survival_check.json

echo '--- artifacts ---'
ls -l artifacts/entrypoints_check.json artifacts/survival_check.json
"@
