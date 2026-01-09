param(
  [string]$RepoRoot
)

$ErrorActionPreference = "Stop"

$resolvedRoot = $RepoRoot
if (-not $resolvedRoot) {
  $resolvedRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path
}

$manifestPath = Join-Path $resolvedRoot "scripts/agents/context/agent_context_manifest.yaml"
$lawManual = Join-Path $resolvedRoot "docs/manual/Manual_de_Construcao_Aurora.md"
$lawAgents = Join-Path $resolvedRoot "docs/AGENTS/LAW.md"

if (-not (Test-Path $manifestPath)) {
  throw "Manifest ausente: $manifestPath"
}

if (-not (Test-Path $lawManual)) {
  throw "Manual canonico ausente: $lawManual"
}

if (-not (Test-Path $lawAgents)) {
  throw "Lei dos agentes ausente: $lawAgents"
}

Write-Host "OK - Agent law context presente:"
Write-Host " - $lawManual"
Write-Host " - $lawAgents"
Write-Host " - $manifestPath"
