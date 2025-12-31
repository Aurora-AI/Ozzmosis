# PLAN — ESLint root config + VS Code monorepo fix

Objetivo: eliminar o erro do VS Code ESLint (`Could not find config file`) garantindo um config raiz do ESLint (Flat Config) e ajustes mínimos de monorepo no workspace.

## Passos

1) Fixar dependencias ESLint/TS no root (package.json + lockfile)
   - Mudancas:
     - Atualizar `package.json` com devDependencies do ESLint/TS
     - Atualizar `package-lock.json` para refletir o root devDependencies
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

2) Atualizar flat config com TypeScript ESLint (root)
   - Mudancas:
     - Atualizar `eslint.config.mjs` com `@eslint/js`, `globals`, parser e plugin TS
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

3) Ajustar settings do VS Code (monorepo + flat config)
   - Mudancas:
     - Atualizar `.vscode/settings.json` (mesclar chaves ESLint sem remover as existentes)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

4) Verificacoes deterministicas (hard check)
   - Mudancas:
     - Nenhuma (somente verificacao)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `node -p "require.resolve('eslint/package.json')"`
     - `npx eslint --print-config apps/aurora-conductor-service/package.json > NUL`
     - `echo $LASTEXITCODE`
     - `npx eslint apps/aurora-conductor-service --ext .ts,.tsx,.js,.json`
     - `echo $LASTEXITCODE`
     - `scripts\agents\run-gates.ps1`
     - `echo "EXITCODE=$LASTEXITCODE"`
   - Criterios de aceite:
     - Provas 1-3 sem erro fatal de config/parsing
     - Gates retornam `EXITCODE=0`

5) Suporte definitivo a JSON no ESLint
   - Mudancas:
     - Adicionar `jsonc-eslint-parser` como devDependency no root
     - Atualizar `eslint.config.mjs` para usar parser JSON
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `npm i -D jsonc-eslint-parser`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates retornam `EXITCODE=0`

6) Repetir Prova 3 (lint do app com JSON)
   - Mudancas:
     - Nenhuma (somente verificacao)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `npx eslint apps/aurora-conductor-service --ext .ts,.tsx,.js,.json`
     - `echo $LASTEXITCODE`
   - Criterios de aceite:
     - Sem erro de parsing/config para JSON/TS
