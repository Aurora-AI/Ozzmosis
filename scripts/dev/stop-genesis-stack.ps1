#requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = "C:\Aurora\Ozzmosis"
$RunDir   = Join-Path $RepoRoot ".run"

$BackendPidFile  = Join-Path $RunDir "_alvaro_uvicorn.pid"
$OllamaPidFile   = Join-Path $RunDir "_ollama.pid"
$FrontendPidFile = Join-Path $RunDir "_genesis_vite.pid"

function KillFromPidFile([string]$path, [string]$label) {
  if (-not (Test-Path $path)) { return }
  $pidText = (Get-Content $path -ErrorAction SilentlyContinue | Select-Object -First 1)
  if (-not $pidText) { return }
  $pid = [int]$pidText
  try {
    $p = Get-Process -Id $pid -ErrorAction Stop
    Write-Host "Stopping $label PID=$pid ($($p.ProcessName))"
    Stop-Process -Id $pid -Force
  } catch {}
  Remove-Item $path -Force -ErrorAction SilentlyContinue
}

KillFromPidFile $FrontendPidFile "frontend"
KillFromPidFile $BackendPidFile  "backend"
KillFromPidFile $OllamaPidFile   "ollama"

Write-Host "Done."
