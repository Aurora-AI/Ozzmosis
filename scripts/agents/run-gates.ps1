$ErrorActionPreference = "Stop"

Write-Host "== Gates: npm ci =="
npm ci

Write-Host "== Gates: repo:check =="
npm run repo:check

Write-Host "Gates PASS"

