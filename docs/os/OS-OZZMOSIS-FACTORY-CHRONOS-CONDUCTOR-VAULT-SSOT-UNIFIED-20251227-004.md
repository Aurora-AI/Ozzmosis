# OS-OZZMOSIS-FACTORY-CHRONOS-CONDUCTOR-VAULT-SSOT-UNIFIED-20251227-004

**Status:** Autorizada — pronta para execução
**Repo:** `Aurora-AI/Ozzmosis`
**Executor:** Agente (Codex) em GitHub

## Regras não negociáveis (contrato de fábrica)
1. Contexto é ativo operacional: regras viram contrato (gates), guias viram playbooks (docs), rotinas viram skills.
2. Side-effects por padrão = zero: nenhum comando deixa o repo “sujo” (artefatos opt-in).
3. Determinismo por default: sem rede/clock em testes críticos (exceto quando explicitamente permitido).
4. Gates definem verdade: se falhar no gate/CI, não entra em `main`.
5. SSOT: canônicos versionados no repo + espelhamento obrigatório no Vault (procedimento e registro no manifesto).
6. Agent Skills como mecanismo de contexto sob demanda: progressive disclosure (carregar apenas o necessário, quando necessário).

## Objetivo
Consolidar o Ozzmosis como Fábrica Aurora (não produto), com:
- Conductor como Kernel inviolável
- Chronos como pilar em desenvolvimento (scaffold governado)
- Constituição/contrato explícitos e canônicos
- Agent Skills como padrão oficial de execução
- Vault/SSOT como procedimento obrigatório e auditável

## Escopo
Inclui contrato/detalhes do repo, docs canônicas, agent skills, tooling de checks, scaffold do Chronos e CI complementar.
Exclui produtos (CRM/Jurídico/UI/etc) e automação de upload para Drive/Vault.

## Entregáveis (pós-merge)
1. Contrato e higiene: `.editorconfig`, `.gitattributes`, `.gitignore`
2. Canônicos: Constituição, Processo, Checklist, Manual do repo, Manifesto Vault/SSOT
3. Agent Skills: padrão `agent-skills/<skill>/SKILL.md` com precondições, comandos, critérios, artefatos e rollback
4. Repo contract gate: `npm run repo:check`
5. Repo cleanliness gate: `npm run repo:clean` (rodar após gates)
6. CI complementar: repo contract + gates essenciais do Conductor
7. DX hardening: procedimento canônico quando `npm ci` falhar localmente por lock (`npm run install:clean`)
8. (Opcional) Chronos: manter como menção e scripts; evolução em OS própria

## Comandos (mínimo antes do PR)
```bash
npm ci

npm run repo:check

npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
npm run smoke:conductor
npm run survival:conductor

npm run repo:clean
git status --porcelain
```
