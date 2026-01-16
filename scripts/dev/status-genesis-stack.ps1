#requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$Backend = "http://127.0.0.1:8010"
$Frontend = "http://127.0.0.1:3002"

Write-Host "Backend health:"
Invoke-WebRequest "$Backend/health" -Method Get | Select-Object StatusCode

Write-Host "Backend status:"
Invoke-RestMethod "$Backend/api/v1/system/status"

Write-Host "Frontend:"
try { Invoke-WebRequest $Frontend -Method Get | Select-Object StatusCode } catch { Write-Host $_.Exception.Message }
