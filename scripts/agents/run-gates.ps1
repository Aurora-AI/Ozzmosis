$ErrorActionPreference = "Stop"

Write-Host "== Gates: verify-agent-law =="
powershell -ExecutionPolicy Bypass -File scripts\agents\verify-agent-law.ps1
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "== Gates: npm ci =="
npm ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "== Gates: repo:check =="
npm run repo:check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Gates PASS"
