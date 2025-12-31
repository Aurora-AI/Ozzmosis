$ErrorActionPreference = "Stop"

Write-Host "== Gates: npm ci =="
npm ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "== Gates: repo:check =="
npm run repo:check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Gates PASS"
