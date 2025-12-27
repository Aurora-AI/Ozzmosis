# Ozzmosis — Fábrica Aurora (Monorepo canônico)

O Ozzmosis é a Fábrica (monorepo) do ecossistema Aurora: um ambiente limpo, determinístico e auditável onde componentes são produzidos sob um contrato único.
Este repositório não é um produto final.

## Contrato (não negociável)
- Instalação canônica na raiz: `npm ci`
- Um único lockfile: `package-lock.json` na raiz
- Side-effects por padrão = zero (artefatos são opt-in)
- Gates definem verdade: CI vermelho bloqueia merge

## Comandos canônicos (local/CI)
### Conductor (Kernel inviolável)
- `npm run build:conductor`
- `npm run typecheck:conductor`
- `npm run lint:conductor`
- `npm run smoke:conductor`
- `npm run survival:conductor`

### Repo contract
- `npm run repo:check`
- `npm run repo:clean` (rodar após gates; repo deve ficar limpo)
- `npm run install:clean` (quando `npm ci` falhar por lock local)

### Chronos (menção; evolução em OS própria)
- `npm run chronos:build`
- `npm run chronos:smoke`

## CI
- Conductor: `.github/workflows/ci-conductor.yml`
- Repo contract (com gates essenciais): `.github/workflows/ci-repo-contract.yml`

## Canônicos (onde está a verdade)
- Constituição Operacional: `docs/CONSTITUICAO/README.md`
- Processo + Checklist: `docs/CONSTITUICAO/PROCESSO_PRODUTIVO.md` e `docs/CONSTITUICAO/CHECKLIST_FABRICA.md`
- Manual do repo/fábrica: `docs/ozzmosis/MANUAL_PRODUTO_OZZMOSIS.md`
- SSOT/Vault (espelhamento obrigatório): `docs/Vault_SSoT_MANIFEST.md`
- Agent Skills (progressive disclosure): `agent-skills/README.md`
