$root = 'C:\Aurora\_thirdparty\corteza'
$out  = 'C:\Aurora\Ozzmosis\_thirdparty_evidences\corteza_hits.txt'

$exts = @('.go','.ts','.tsx','.js','.jsx','.php','.sql','.yaml','.yml','.json')
$excludeRegex = '\\node_modules\\|\\dist\\|\\build\\|\\.git\\|\\coverage\\|\\.webp$|\\.png$|\\.jpe?g$|\\.svg$|\\.map$|pnpm-lock\\.yaml$|package-lock\\.json$|yarn\\.lock$|\\\\LICENSE$'

if (-not (Test-Path $root)) { "# MISSING_ROOT: $root" | Out-File $out -Encoding utf8; exit 0 }

$files = Get-ChildItem -Path $root -File -Recurse -ErrorAction SilentlyContinue |
  Where-Object {
    ($exts -contains $_.Extension.ToLower()) -and (-not ($_.FullName -match $excludeRegex))
  } | Select-Object -ExpandProperty FullName

if (-not $files -or $files.Count -eq 0) { '' | Out-File $out -Encoding utf8; exit 0 }

Select-String -Path $files -Pattern '(rbac|acl|authorize|authorization|permission(s)?|role(s)?|access control)' -AllMatches -ErrorAction SilentlyContinue |
  ForEach-Object { "{0}:{1}:{2}" -f $_.Path, $_.LineNumber, $_.Line } |
  Out-File $out -Encoding utf8
