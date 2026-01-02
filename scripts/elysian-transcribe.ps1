<#
  Elysian STT runner (Windows, Trustware-safe)

  Goal:
    - Ensure ffmpeg is available (PATH or WinGet install)
    - Ensure repo-local venv exists (.venv)
    - Ensure ToolBelt is installed editable (libs/elysian-brain)
    - Run elysian-transcribe with a per-run outdir under the Vault
    - Persist an execution log without transcript content

  Usage:
    pwsh -File .\scripts\elysian-transcribe.ps1 -InputPath "C:\Audios" -Recursive

  Notes:
    - Outputs (SRT/VTT/JSON) are sensitive. Default outdir is under:
      apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/<run_tag>
#>

param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [string]$OutBase = "",
  [string]$RunTag = "",
  [switch]$Recursive,

  [string]$Lang = "pt-BR",
  [string]$Model = "medium",
  [ValidateSet("cpu", "cuda")][string]$Device = "cpu",
  [string]$ComputeType = "int8",
  [int]$BeamSize = 5,

  [switch]$Vad,
  [int]$VadMinSilenceMs = 500,

  [switch]$Overwrite,
  [ValidateSet("srt", "vtt", "json", "all")][string]$Format = "all",

  [switch]$MergeSegments,
  [int]$MaxChars = 100,
  [switch]$Normalize,
  [int]$MaxDuration = 0,
  [string]$InitialPrompt = "",
  [switch]$KeepTemp,
  [string]$CacheDir = "",
  [switch]$ToolVerbose,

  [switch]$SaveFullReport
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RepoRoot {
  $root = Resolve-Path (Join-Path $PSScriptRoot "..")
  return $root.Path
}

function Ensure-FFmpeg {
  if (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
    return
  }

  $winGetPackages = Join-Path $env:LOCALAPPDATA "Microsoft\\WinGet\\Packages"
  if (!(Test-Path $winGetPackages)) {
    throw "ffmpeg nao encontrado no PATH e WinGet packages nao existe: $winGetPackages"
  }

  $candidates = Get-ChildItem $winGetPackages -Directory -Filter "Gyan.FFmpeg_*" -ErrorAction SilentlyContinue
  foreach ($pkg in $candidates) {
    $bin = Join-Path $pkg.FullName "ffmpeg-*-full_build\\bin"
    $binDirs = Get-ChildItem $bin -Directory -ErrorAction SilentlyContinue
    foreach ($b in $binDirs) {
      $ff = Join-Path $b.FullName "ffmpeg.exe"
      if (Test-Path $ff) {
        $env:PATH = "$($b.FullName);$env:PATH"
        return
      }
    }
  }

  # Fallback: look for ffmpeg.exe anywhere under WinGet packages
  $ffmpegExe = Get-ChildItem $winGetPackages -Recurse -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($ffmpegExe) {
    $env:PATH = "$($ffmpegExe.Directory.FullName);$env:PATH"
    return
  }

  throw "ffmpeg nao encontrado. Instale via winget (Gyan.FFmpeg) e reinicie o shell, ou ajuste o PATH."
}

function Ensure-Venv {
  param([Parameter(Mandatory = $true)][string]$RepoRoot)

  $venvPy = Join-Path $RepoRoot ".venv\\Scripts\\python.exe"
  if (Test-Path $venvPy) {
    return $venvPy
  }

  $py = Get-Command py -ErrorAction SilentlyContinue
  if ($py) {
    & py -3.11 -m venv (Join-Path $RepoRoot ".venv")
  } else {
    & python -m venv (Join-Path $RepoRoot ".venv")
  }

  if (!(Test-Path $venvPy)) {
    throw "Falha ao criar venv: $venvPy"
  }

  return $venvPy
}

function Ensure-Pip {
  param([Parameter(Mandatory = $true)][string]$VenvPy)
  & $VenvPy -m ensurepip --upgrade | Out-Null
  & $VenvPy -m pip install -U pip | Out-Null
}

function Ensure-Toolbelt {
  param([Parameter(Mandatory = $true)][string]$RepoRoot, [Parameter(Mandatory = $true)][string]$VenvPy)
  $cli = Join-Path $RepoRoot ".venv\\Scripts\\elysian-transcribe.exe"
  if (Test-Path $cli) {
    return $cli
  }

  $pkg = Join-Path $RepoRoot "libs\\elysian-brain"
  if (!(Test-Path $pkg)) {
    throw "ToolBelt nao encontrado: $pkg"
  }

  & $VenvPy -m pip install -e $pkg

  if (!(Test-Path $cli)) {
    throw "elysian-transcribe.exe nao encontrado apos install: $cli"
  }
  return $cli
}

function Safe-Name {
  param([Parameter(Mandatory = $true)][string]$Value)
  return ($Value -replace "[^a-zA-Z0-9_-]+", "_").Trim("_")
}

function Write-Json {
  param([Parameter(Mandatory = $true)][string]$Path, [Parameter(Mandatory = $true)]$Object)
  ($Object | ConvertTo-Json -Depth 12) | Out-File -FilePath $Path -Encoding UTF8
}

function Build-Args {
  param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutDir
  )

  $args = @("--input", $InputPath, "--outdir", $OutDir, "--lang", $Lang, "--model", $Model, "--device", $Device, "--compute-type", $ComputeType, "--beam-size", "$BeamSize", "--format", $Format)

  if ($Recursive) { $args += "--recursive" }
  if ($Vad) { $args += "--vad"; $args += @("--vad-min-silence-ms", "$VadMinSilenceMs") }
  if ($Overwrite) { $args += "--overwrite" }
  if ($MergeSegments) { $args += "--merge-segments"; $args += @("--max-chars", "$MaxChars") }
  if ($Normalize) { $args += "--normalize" }
  if ($MaxDuration -gt 0) { $args += @("--max-duration", "$MaxDuration") }
  if ($InitialPrompt.Trim()) { $args += @("--initial-prompt", $InitialPrompt) }
  if ($KeepTemp) { $args += "--keep-temp" }
  if ($CacheDir.Trim()) { $args += @("--cache-dir", $CacheDir) }
  if ($ToolVerbose) { $args += "--verbose" }

  return ,$args
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Ensure-FFmpeg
$ffmpegPath = (Get-Command ffmpeg).Source

if (!$OutBase.Trim()) {
  $OutBase = Join-Path $repoRoot "apps\\ozzmosis\\data\\vault\\rodobens\\trainings\\transcripts\\_runs"
}
New-Item -ItemType Directory -Force -Path $OutBase | Out-Null

if (!$RunTag.Trim()) {
  $ts = Get-Date -Format "yyyyMMdd_HHmmss"
  $RunTag = "run_{0}_{1}_{2}" -f $ts, (Safe-Name $Model), (Safe-Name $Lang.ToLower())
}

$outDir = Join-Path $OutBase $RunTag
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$venvPy = Ensure-Venv -RepoRoot $repoRoot
Ensure-Pip -VenvPy $venvPy
$cli = Ensure-Toolbelt -RepoRoot $repoRoot -VenvPy $venvPy

$stderrPath = Join-Path $outDir "run_stderr.log"
$reportPath = Join-Path $outDir "run_report.json"
$summaryPath = Join-Path $outDir "run_summary.json"
$metaPath = Join-Path $outDir "run_meta.json"

$args = Build-Args -InputPath $InputPath -OutDir $outDir

$start = Get-Date
& $cli @args 1> $reportPath 2> $stderrPath
$exit = $LASTEXITCODE
$end = Get-Date

$meta = [ordered]@{
  started_at = $start.ToString("o")
  finished_at = $end.ToString("o")
  exit_code = $exit
  repo_root = $repoRoot
  ffmpeg = [ordered]@{
    path = $ffmpegPath
    version_line = (ffmpeg -version | Select-Object -First 1)
  }
  python = [ordered]@{
    venv_python = $venvPy
    version_line = (& $venvPy -V 2>&1)
  }
  tool = [ordered]@{
    cli = $cli
  }
  run = [ordered]@{
    outdir = $outDir
    tag = $RunTag
    input_basename = (Split-Path $InputPath -Leaf)
    argv = $args
  }
}
Write-Json -Path $metaPath -Object $meta

if (Test-Path $reportPath) {
  $raw = Get-Content $reportPath -Raw
  try {
    $report = $raw | ConvertFrom-Json
  } catch {
    $report = $null
  }

  if ($report) {
    $safeResults = @()
    foreach ($r in $report.results) {
      $skippedVal = $false
      if ($r.PSObject.Properties.Name -contains "skipped") { $skippedVal = [bool]$r.skipped }

      $segmentsVal = $null
      if ($r.PSObject.Properties.Name -contains "segments") { $segmentsVal = $r.segments }

      $errorVal = $null
      if ($r.PSObject.Properties.Name -contains "error") { $errorVal = $r.error }

      $srtName = $null
      if ($r.srt) { $srtName = Split-Path $r.srt -Leaf }

      $vttName = $null
      if ($r.vtt) { $vttName = Split-Path $r.vtt -Leaf }

      $jsonName = $null
      if ($r.json) { $jsonName = Split-Path $r.json -Leaf }

      $safeResults += [ordered]@{
        ok = $r.ok
        skipped = $skippedVal
        file = (Split-Path $r.file -Leaf)
        segments = $segmentsVal
        error = $errorVal
        srt = $srtName
        vtt = $vttName
        json = $jsonName
      }
    }

    $defaultsVal = $null
    if ($report.PSObject.Properties.Name -contains "defaults") { $defaultsVal = $report.defaults }

    $summary = [ordered]@{
      ok = $report.ok
      total = $report.total
      processed = $report.processed
      failed = $report.failed
      skipped = $report.skipped
      defaults = $defaultsVal
      results = $safeResults
    }
    Write-Json -Path $summaryPath -Object $summary

    if (!$SaveFullReport) {
      # keep only summary + meta by default (avoid persisting full paths)
      Remove-Item -Force $reportPath -ErrorAction SilentlyContinue
    }
  }
}

Write-Host "Done. outdir=$outDir exit_code=$exit"
exit $exit
