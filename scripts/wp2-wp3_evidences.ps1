<#
  Trustware-safe evidence collector (READ-ONLY)

  Purpose:
    - Collect environment + repo evidence for WP2/WP3 without modifying the machine or repo state.
    - No installs, no deletes, no registry writes, no service manipulation.

  Guarantees:
    - Read-only commands only.
    - Output is written to a timestamped folder under .\artifacts\wp3\ (repo-local).
    - Does not stage/commit/modify Git state.

  Usage:
    pwsh -File .\scripts\wp2-wp3_evidences.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-ArtifactDir {
  param(
    [Parameter(Mandatory=$true)][string]$Base
  )
  $ts = Get-Date -Format "yyyyMMdd_HHmmss"
  $dir = Join-Path $Base $ts
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  return $dir
}

function Write-TextFile {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )
  $Content | Out-File -FilePath $Path -Encoding UTF8
}

function Try-Run {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][scriptblock]$Block
  )
  try {
    & $Block
  } catch {
    # Capture error deterministically without failing the whole run.
    $msg = $_.Exception.Message
    Write-Host "[WARN] $Name failed: $msg"
  }
}

$repoRoot = Resolve-Path "."
$artifactBase = Join-Path $repoRoot "artifacts\wp3\evidence"
$artifactDir = New-ArtifactDir -Base $artifactBase

Write-Host "Evidence artifact dir: $artifactDir"

# 1) Repo identity
Try-Run "git_status" {
  $out = git status -sb 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "git_status.txt") -Content $out
}
Try-Run "git_log" {
  $out = git log -10 --oneline 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "git_log_last10.txt") -Content $out
}
Try-Run "git_diff_stat" {
  $out = git diff --stat 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "git_diff_stat.txt") -Content $out
}

# 2) Python info (read-only)
Try-Run "python_launcher" {
  $out = py -V 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "py_version.txt") -Content $out
}
Try-Run "python_pip_list" {
  $out = py -m pip list 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "pip_list.txt") -Content $out
}
Try-Run "python_import_probe" {
  $out = py -c "import sys; print(sys.version); import importlib;
mods=['fastapi','sqlalchemy','alembic','pytest'];
print({m: (importlib.util.find_spec(m) is not None) for m in mods})" 2>&1
  Write-TextFile -Path (Join-Path $artifactDir "python_import_probe.txt") -Content $out
}

# 3) CRM-core structure snapshot (read-only)
Try-Run "tree_snapshot" {
  $paths = @(
    "apps\crm-core\src",
    "apps\crm-core\alembic",
    "apps\crm-core\tests"
  )
  $lines = New-Object System.Collections.Generic.List[string]
  foreach ($p in $paths) {
    $full = Join-Path $repoRoot $p
    if (Test-Path $full) {
      $lines.Add("== $p ==")
      Get-ChildItem -Recurse -File $full | ForEach-Object { $lines.Add($_.FullName) }
      $lines.Add("")
    } else {
      $lines.Add("== $p == (missing)")
    }
  }
  Write-TextFile -Path (Join-Path $artifactDir "crmcore_files.txt") -Content ($lines -join "`r`n")
}

Write-Host "Done. No changes were made to repo state."
exit 0
