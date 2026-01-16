#requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = "C:\Aurora\Ozzmosis"
$RunDir   = Join-Path $RepoRoot ".run"
$LogDir   = Join-Path $RunDir "logs"
New-Item -ItemType Directory -Force -Path $RunDir, $LogDir | Out-Null

# --- Config (canônica) ---
$BackendHost = "127.0.0.1"
$BackendPort = 8010
$FrontendPort = 3002
$BackendBase = "http://$BackendHost:$BackendPort"

$AlvaroDir = Join-Path $RepoRoot "apps\alvaro-core"
$PythonExe = Join-Path $RepoRoot ".venv\Scripts\python.exe"

$BackendPidFile  = Join-Path $RunDir "_alvaro_uvicorn.pid"
$OllamaPidFile   = Join-Path $RunDir "_ollama.pid"
$FrontendPidFile = Join-Path $RunDir "_genesis_vite.pid"

function Write-Log([string]$msg) {
  $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  Write-Host "[$ts] $msg"
}

function Get-ListeningPid([int]$port) {
  $line = netstat -ano | Select-String -Pattern "127\.0\.0\.1:$port\s+.*LISTENING\s+(\d+)"
  if ($line -and $line.Matches.Count -gt 0) {
    return [int]$line.Matches[0].Groups[1].Value
  }
  return $null
}

function Kill-PidIfAlive([int]$pid, [string]$label) {
  if (-not $pid) { return }
  try {
    $p = Get-Process -Id $pid -ErrorAction Stop
    Write-Log "Killing $label PID=$pid ($($p.ProcessName))"
    Stop-Process -Id $pid -Force
  } catch {
    # already dead
  }
}

function Wait-Http200([string]$url, [int]$timeoutSec = 30) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
      $resp = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 3
      if ($resp.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Milliseconds 300
  }
  return $false
}

function Ensure-Ollama() {
  # If ollama already running, do nothing.
  $existing = Get-Process -Name "ollama" -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Log "Ollama already running (PID=$($existing[0].Id))"
    Set-Content -Encoding ascii -Path $OllamaPidFile -Value $existing[0].Id
    return
  }

  # Start ollama serve detached
  Write-Log "Starting Ollama..."
  $logPath = Join-Path $LogDir "ollama.log"
  $p = Start-Process -FilePath "ollama" -ArgumentList "serve" -PassThru -WindowStyle Hidden -RedirectStandardOutput $logPath -RedirectStandardError $logPath
  Set-Content -Encoding ascii -Path $OllamaPidFile -Value $p.Id

  # No official HTTP health check reliably exposed; wait a bit
  Start-Sleep -Seconds 2
  Write-Log "Ollama started (PID=$($p.Id))"
}

function Ensure-Backend() {
  # If port is occupied, kill it (definitivo)
  $pid = Get-ListeningPid -port $BackendPort
  if ($pid) {
    Write-Log "Backend port $BackendPort is occupied by PID=$pid; freeing it"
    Kill-PidIfAlive -pid $pid -label "backend"
    Start-Sleep -Seconds 1
  }

  # Start uvicorn using venv python (never PATH python)
  if (-not (Test-Path $PythonExe)) {
    throw "Python venv not found at: $PythonExe. Run venv bootstrap / npm ci / setup first."
  }

  Write-Log "Starting backend (Alvaro Core) on $BackendBase ..."
  $logPath = Join-Path $LogDir "alvaro-backend.log"

  $env:PYTHONPATH = "src"
  $env:AURORA_LLM_STRICT = "0"
  $env:AURORA_LLM_MODEL  = "llama3.1"

  $p = Start-Process -FilePath $PythonExe `
    -WorkingDirectory $AlvaroDir `
    -ArgumentList @("-m","uvicorn","alvaro.app:app","--host",$BackendHost,"--port",$BackendPort,"--reload") `
    -PassThru `
    -RedirectStandardOutput $logPath `
    -RedirectStandardError $logPath `
    -WindowStyle Hidden

  Set-Content -Encoding ascii -Path $BackendPidFile -Value $p.Id

  # Wait health endpoints
  if (-not (Wait-Http200 -url "$BackendBase/health" -timeoutSec 40)) {
    throw "Backend did not become healthy at $BackendBase/health. Check logs: $logPath"
  }
  if (-not (Wait-Http200 -url "$BackendBase/api/v1/system/status" -timeoutSec 10)) {
    throw "Backend status endpoint failed. Check logs: $logPath"
  }

  Write-Log "Backend is healthy."
}

function Ensure-Frontend() {
  # Start Vite (Genesis) from repo root using npm script (monorepo contract)
  Write-Log "Starting frontend (Genesis) ..."
  $logPath = Join-Path $LogDir "genesis-frontend.log"

  # avoid base url pollution when proxy is used
  Remove-Item Env:\AURORA_API_BASE_URL -ErrorAction SilentlyContinue
  $env:AI_PROVIDER = "aurora"

  $p = Start-Process -FilePath "npm" `
    -WorkingDirectory $RepoRoot `
    -ArgumentList @("run","dev:genesis","--","--host","127.0.0.1","--port",$FrontendPort) `
    -PassThru `
    -RedirectStandardOutput $logPath `
    -RedirectStandardError $logPath `
    -WindowStyle Hidden

  Set-Content -Encoding ascii -Path $FrontendPidFile -Value $p.Id

  # Wait frontend to respond
  if (-not (Wait-Http200 -url "http://127.0.0.1:$FrontendPort" -timeoutSec 40)) {
    throw "Frontend did not become available at http://127.0.0.1:$FrontendPort. Check logs: $logPath"
  }

  Write-Log "Frontend is up."
}

function Validate-Stack() {
  # Confirm backend says llm ready (best effort)
  try {
    $status = Invoke-RestMethod "$BackendBase/api/v1/system/status"
    Write-Log ("Backend status: backend={0} llm={1} strict={2} provider={3}" -f $status.backend, $status.llm, $status.strict_mode, $status.provider)
  } catch {
    Write-Log "Warning: could not read /system/status: $($_.Exception.Message)"
  }

  # Smoke check (non-fatal)
  try {
    $env:AURORA_SMOKE_BASE_URL = $BackendBase
    Write-Log "Running smoke:genesis..."
    $smoke = Start-Process -FilePath "npm" -WorkingDirectory $RepoRoot -ArgumentList @("run","smoke:genesis") -Wait -PassThru -NoNewWindow
    Write-Log "smoke:genesis exitcode=$($smoke.ExitCode)"
  } catch {
    Write-Log "Warning: smoke:genesis failed: $($_.Exception.Message)"
  }
}

# --- MAIN ---
Write-Log "Genesis Stack Boot: START"
Ensure-Ollama
Ensure-Backend
Ensure-Frontend
Validate-Stack

Write-Log "Opening browser..."
Start-Process "http://127.0.0.1:$FrontendPort"

Write-Log "Genesis Stack Boot: DONE"
Write-Log "Backend:  $BackendBase"
Write-Log "Frontend: http://127.0.0.1:$FrontendPort"
Write-Log "Logs:     $LogDir"
