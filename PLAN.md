# PLAN — OS-CODEX-OZZMOSIS-SDK-AUDIT-AND-INTEGRATION-20260205-001
Data: 2026-02-05
Autor: Aurora (via Comandante) / executor: Codex

## Objetivo
Auditar, consolidar e implementar a integracao Backend (Genesis/Trustware) <-> Frontends
(Genesis/Mycelium), com contrato canonico UI-ready (thin-client), artifacts por URL e docs SSOT.

## Escopo
Inclui:
- Auditoria tecnica factual (read-only) do estado atual (endpoints, contratos, artifacts, SDKs).
- Decisao arquitetural e implementacao: Genesis serve seus artifacts (URLs canonicas).
- Contrato `POST /genesis/decide` v1.1 UI-ready mantendo compatibilidade v1.0.
- Exposicao de artifacts do Genesis por URL (GET) com hardening basico (allowlist + sha estrito).
- Consolidacao do SDK/clients tipados no frontend (Mycelium) para consumir `ui.*`.
- Atualizacao/criacao de docs SSOT:
  - `docs/GENESIS_DEV_RUNBOOK.md`
  - `docs/GENESIS_E2E_SMOKE.md`
  - `docs/GENESIS_CONTRACT.md` (se nao existir)

Nao inclui:
- Refactors cosmeticos ou reescrita ampla de frontends.
- Novos fluxos/produtos Rodobens alem do minimo UI-ready.
- Mudancas de arquitetura no Conductor (a menos que seja exigido por gates).

## Riscos
- R1: Exposicao de dados sensiveis via artifacts por URL.
  Mitigacao: allowlist de arquivos; sha estrito; opcao de auth por env (dev aberto).
- R2: Quebra de compatibilidade com clientes v1.0.
  Mitigacao: manter campos v1.0 no topo (verdict/reasons/policy_*); adicionar `ui`/`policy`.
- R3: Divergencia entre entrypoints/handlers (`alvaro.app` vs `alvaro.genesis.api`).
  Mitigacao: handler unico; respostas identicas nos dois caminhos.

## Passos (executar 1 por vez)
1) Auditoria tecnica final (read-only) + relatorio factual
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `rg -n "genesis/decide|trustware|artifacts|DecisionStep|GenesisArtifact" apps docs`
   - Arquivos:
     - `docs/ozzmosis/sdk-map.md` (novo)
   - Criterios de aceite:
     - Relatorio inclui endpoints, contratos e paths reais (sem sugestoes).
     - Sem secrets em texto/log.

2) Artifacts por URL (Genesis host) — hardening basico
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
     - (se houver falha EPERM no Windows) `scripts\agents\run-gates-linux.ps1`
   - Arquivos:
     - `apps/alvaro-core/src/alvaro/app.py`
   - Criterios de aceite:
     - `GET /genesis/artifacts/{sha}/decision.json` retorna JSON.
     - `GET /genesis/artifacts/{sha}/decision.pdf` retorna PDF.
     - Allowlist aplicada e path traversal bloqueado.

3) Contrato v1.1 UI-ready + unificacao de handlers
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
     - (se houver falha EPERM no Windows) `scripts\agents\run-gates-linux.ps1`
   - Arquivos:
     - `apps/alvaro-core/src/alvaro/app.py`
     - `apps/alvaro-core/src/alvaro/genesis/api.py`
     - `apps/alvaro-core/src/alvaro/genesis/engine.py`
     - `apps/alvaro-core/src/alvaro/genesis/contracts.py` (se necessario)
   - Criterios de aceite:
     - `POST /genesis/decide` retorna v1.1 com `ui.*` e `policy.*`.
     - Campos v1.0 permanecem no topo (compatibilidade).
     - `app.py` e `api.py` retornam a mesma estrutura.

4) SDK/Client (frontend) consumindo `ui.*` + PDF por URL
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
     - (se houver falha EPERM no Windows) `scripts\agents\run-gates-linux.ps1`
   - Arquivos:
     - `apps/mycelium-front/src/lib/genesis/client.ts`
     - `apps/mycelium-front/src/lib/genesis/contracts.ts` (se necessario)
     - `apps/mycelium-front/src/app/page.tsx` (UI minima)
   - Criterios de aceite:
     - Front renderiza `ui.status`, `ui.user_message`, `ui.steps`, `ui.next_actions`.
     - PDF aberto via URL em `ui.artifacts`.

5) Docs SSOT v1.1 + smoke evidence
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
     - (se houver falha EPERM no Windows) `scripts\agents\run-gates-linux.ps1`
   - Arquivos:
     - `docs/GENESIS_DEV_RUNBOOK.md`
     - `docs/GENESIS_E2E_SMOKE.md`
     - `docs/GENESIS_CONTRACT.md` (novo se necessario)
   - Criterios de aceite:
     - Exemplos ALLOW/BLOCK refletem v1.1.
     - URLs reais de artifacts documentadas.

6) Vault: criar pasta Genesis + registrar fechamento SSOT (Vault-ready)
   - Comandos:
     - `cd C:\Aurora\Projetos Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
     - (se houver falha EPERM no Windows) `scripts\agents\run-gates-linux.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/genesis/README.md` (novo)
     - `apps/ozzmosis/data/vault/genesis/_runs/.gitkeep` (novo)
     - `apps/ozzmosis/data/vault/genesis/os/OS-CODEX-OZZMOSIS-SDK-AUDIT-AND-INTEGRATION-20260205-001_CLOSE.md` (novo)
   - Criterios de aceite:
     - Pasta `apps/ozzmosis/data/vault/genesis/` existe e entra no git.
     - Registro de fechamento lista evidencias (docs/paths) + decisao arquitetural + commits.

## Gates
- `scripts/agents/run-gates.ps1`
- `scripts/agents/run-gates-linux.ps1` (canonico se EPERM no Windows)

## Rollback
- `git revert <sha>`

---

# PLAN — OS-CONFIG-GITHUB-MODELS-TOKEN-20260116
Data: 2026-01-16
Autor: agent

## Objetivo
Configurar o token do GitHub para acesso a modelos no projeto, garantindo uso em
dev local e CI sem commit de segredos.

## Escopo
Inclui:
- Dev local: `.env.local` (nao commitado).
- CI: GitHub Actions secrets (nao commitado).
- Runbook minimo de setup + validacao.

Nao inclui:
- Alteracoes em codigo de produto.
- Mudanca de provider de modelos.

## Riscos
- R1: Exposicao do token em repo publico ou historico do git.
  Mitigacao: nunca commitar `.env.local`; garantir `.gitignore`; rotacionar se vazar.
- R2: Misconfig causando falha de acesso.
  Mitigacao: escopos minimos; nome de env consistente; smoke check fail-fast.

## Passos (executar 1 por vez)
1) Dev local: configurar `.env.local`
   - Comandos:
     - N/A (edicao local; sem commit)
   - Arquivos:
     - `.env.local` (nao versionado)
     - `.gitignore`
   - Criterios de aceite:
     - `.env.local` contem `GITHUB_TOKEN=<token>`.
     - `.gitignore` inclui `.env.local` e `.env.*.local`.

2) CI (GitHub Actions): configurar secret
   - Comandos:
     - N/A (GitHub UI)
   - Arquivos:
     - N/A
   - Criterios de aceite:
     - Secret `GITHUB_TOKEN` criado em Settings -> Secrets and variables -> Actions.
     - Workflows referenciam `${{ secrets.GITHUB_TOKEN }}`.

3) Validacao / smoke check
   - Comandos:
     - Comando minimo do projeto que exige o token (definir no runbook).
   - Arquivos:
     - `docs/runbooks/` (se houver runbook especifico)
   - Criterios de aceite:
     - Falha rapida quando `GITHUB_TOKEN` estiver ausente.
     - Token nao aparece em logs.

## Gates
- N/A (configuracao e runbook)

## Rollback
- Remover secret `GITHUB_TOKEN` do GitHub Actions.
- Remover `GITHUB_TOKEN` de `.env.local`.
- Rotacionar o token se houver suspeita de exposicao.
