<#
  Trustware-safe fix-and-collect (READ-ONLY)

  IMPORTANT:
    This script does NOT "fix" anything. In Trustware terms, "fix" is an explicit,
    human-authorized change set. This script only:
      - runs read-only checks
      - collects outputs into artifacts\wp3\checks\...

  Usage:
    pwsh -File .\scripts\wp2-wp3_fix_and_collect.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-ArtifactDir {
  param([Parameter(Mandatory=$true)][string]$Base)
  $ts = Get-Date -Format "yyyyMMdd_HHmmss"
  $dir = Join-Path $Base $ts
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  return $dir
}

function Write-TextFile {
  param([Parameter(Mandatory=$true)][string]$Path, [Parameter(Mandatory=$true)][string]$Content)
  $Content | Out-File -FilePath $Path -Encoding UTF8
}

function Try-Run {
  param([Parameter(Mandatory=$true)][string]$Name, [Parameter(Mandatory=$true)][scriptblock]$Block)
  try {
    & $Block
  } catch {
    $msg = $_.Exception.Message
    Write-Host "[WARN] $Name failed: $msg"
  }
}

$repoRoot = Resolve-Path "."
$artifactBase = Join-Path $repoRoot "artifacts\wp3\checks"
$artifactDir = New-ArtifactDir -Base $artifactBase

Write-Host "Checks artifact dir: $artifactDir"

# A) Git hygiene checks (read-only)
Try-Run "git_status" {
  $out = git status -sb 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "git_status.txt") -Content $out
}
Try-Run "untracked_list" {
  $out = git ls-files --others --exclude-standard 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "git_untracked.txt") -Content $out
}

# B) Minimal import proof for WP3 (read-only)
Try-Run "wp3_import_proof" {
  $out = py -c "from src.security.policy import *; from src.security.dependencies import *; print('OK')" 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "wp3_import_proof.txt") -Content $out
}

# C) Optional: pytest presence proof (read-only)
Try-Run "pytest_presence" {
  $out = py -c "import importlib; print('pytest_present=', importlib.util.find_spec('pytest') is not None)" 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "pytest_presence.txt") -Content $out
}

Write-Host "Done. No repository modifications performed."
exit 0
