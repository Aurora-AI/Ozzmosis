param(
  [string]$RepoRoot = (Get-Location).Path
)

Set-Location $RepoRoot

$staged = git diff --cached --name-only

if ($staged -match "^PLAN\.md$") {
  Write-Error "PLAN.md is staged. Abort."
  exit 1
}

if ($staged -match "^artifacts/") {
  Write-Error "Raw artifacts are staged. Abort."
  exit 1
}

if ($staged -match "^\.agent/") {
  Write-Error ".agent/ is staged. Abort."
  exit 1
}

if ($staged -match "^\.antigravity/mcp/servers\.json$") {
  Write-Error "MCP secrets file is staged. Abort."
  exit 1
}

Write-Host "stage-check: OK"
exit 0
