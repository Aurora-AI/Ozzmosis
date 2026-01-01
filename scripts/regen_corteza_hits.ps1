Set-Location C:\Aurora\_thirdparty\corteza

rg -n --hidden `
  --glob '!**/node_modules/**' `
  --glob '!**/dist/**' `
  --glob '!**/build/**' `
  --glob '!**/.git/**' `
  --glob '!**/coverage/**' `
  --glob '!**/LICENSE' `
  --glob '!**/*.webp' `
  --glob '!**/*.png' `
  --glob '!**/*.jpg' `
  --glob '!**/*.jpeg' `
  --glob '!**/*.svg' `
  --glob '!**/*.map' `
  --glob '!**/*.lock' `
  --glob '!**/pnpm-lock.yaml' `
  --glob '!**/package-lock.json' `
  --glob '!**/yarn.lock' `
  -g'*.go' -g'*.ts' -g'*.tsx' -g'*.js' -g'*.jsx' -g'*.php' -g'*.sql' -g'*.yaml' -g'*.yml' -g'*.json' `
  "(rbac|acl|authorize|authorization|permission(s)?|role(s)?|access control)" `
  . | Out-File C:\Aurora\Ozzmosis\_thirdparty_evidences\corteza_hits.txt -Encoding utf8
