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

---

# PLAN — OS-OZZMOSIS-STT-HARDENING-WRAPPER-20260102-003
Data: 2026-01-02
Autor: agent

## Objetivo
Padronizar a execucao operacional do ToolBelt STT (elysian-transcribe) no Windows com:
- wrapper PowerShell deterministico (ffmpeg + venv + CLI + logs)
- outdir por rodada no Vault Rodobens
- playbook atualizado com comandos recomendados

## Escopo
Inclui:
- `scripts/elysian-transcribe.ps1` (wrapper)
- Atualizar `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md`
- Criar pasta de execucoes no Vault de transcripts (se necessario)
Nao inclui:
- Integracao com Chronos para indexar transcripts automaticamente
- Dados reais de audio no repo

## Riscos
- R1: PATH do ffmpeg varia por maquina/sessao; wrapper precisa localizar/install detectavel.
- R2: Logs nao podem vazar conteudo sensivel; logar apenas metadados.
- R3: Dependencias Python nao fazem parte dos gates Node; validar por smoke local e gates do repo.

## Passos (executar 1 por vez)
1) Implementar wrapper e padrao de outputs no Vault
   - Mudancas:
     - Adicionar `scripts/elysian-transcribe.ps1`
     - Atualizar playbook do Vault Rodobens com comandos e recomendacoes
     - Criar `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/.gitkeep` (se necessario)
     - Atualizar `.gitignore` para evitar commit acidental de outputs reais (SRT/VTT/JSON) sob `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Wrapper executa `--help` e valida ffmpeg/venv
     - `git status -sb` nao lista outputs de transcricao sob o Vault
     - Gates passam

2) Commit e push (unico) do hardening STT
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add scripts/elysian-transcribe.ps1 apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/.gitkeep .gitignore`
     - `git commit -m "chore(stt): add windows wrapper + vault runbook for elysian-transcribe"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates passam

## Gates
- `scripts\agents\run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `scripts\agents\run-gates.ps1`

---

# PLAN — OS-OZZMOSIS-STT-MD-EXPORT-20260102-005
Data: 2026-01-02
Autor: agent

## Objetivo
Exportar o texto bruto das transcricoes para `.md` (sem `id/start/end`) automaticamente, e gerar `.md` para os 5 arquivos de teste atuais.

## Escopo
Inclui:
- Atualizar o ToolBelt STT para escrever `<stem>.md` com texto bruto por default
- Adicionar opcao de desligar export (`--no-md`) para casos especiais
Nao inclui:
- Commitar outputs de transcricao no repo (devem permanecer ignorados)

## Passos (executar 1 por vez)
1) Implementar export Markdown (texto bruto) no toolbelt
   - Mudancas:
     - Atualizar `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `.\.venv\Scripts\python.exe -m pytest libs\elysian-brain\tests -q`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - CLI gera `<stem>.md` junto com `.srt/.vtt/*_transcript.json`
     - Testes e gates passam

2) Gerar `.md` para os 5 transcripts atuais (local-only)
   - Mudancas:
     - Nenhuma em arquivos versionados (somente gerar `.md` em `_runs/`)
   - Comandos:
     - Rodar conversao dos 5 `*_transcript.json` em `.md` na mesma pasta
   - Criterios de aceite:
     - Para cada arquivo: existe `<stem>.md` com texto bruto
     - `git status -sb` continua limpo

3) Commit e push (unico) do export `.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
     - `git commit -m "feat(stt): export raw transcript to markdown"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-OZZMOSIS-STT-CPU-PERF-TUNING-20260102-006
Data: 2026-01-02
Autor: agent

## Objetivo
Melhorar previsibilidade de performance no Windows sem CUDA (Intel Iris) ajustando:
- `cpu_threads` (CTranslate2 / faster-whisper)
- `num_workers`
- `batch_size` do `transcribe`

## Escopo
Inclui:
- Expor flags no CLI e no wrapper PowerShell
- Atualizar playbook com recomendação para Intel Iris (CPU tuning)
Nao inclui:
- Suporte a aceleração Intel via OpenVINO/DirectML (WP futuro, se necessário)

## Passos (executar 1 por vez)
1) Expor tuning CPU no toolbelt/CLI
   - Mudancas:
     - Atualizar `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `.\.venv\Scripts\python.exe -m pytest libs\elysian-brain\tests -q`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `elysian-transcribe --help` lista `--cpu-threads`, `--workers`, `--batch-size`
     - Execução CPU funciona com defaults
     - Testes e gates PASS

2) Atualizar wrapper + playbook (Windows)
   - Mudancas:
     - Atualizar `scripts/elysian-transcribe.ps1` para passar tuning e defaults bons
     - Atualizar `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md` com recomendações
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Wrapper aceita `-CpuThreads`, `-Workers`, `-BatchSize` e passa para o CLI
     - Gates PASS

3) Commit e push (unico) do tuning CPU
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py scripts/elysian-transcribe.ps1 apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md PLAN.md`
     - `git commit -m "chore(stt): add cpu perf tuning knobs (threads/workers/batch)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004
Data: 2026-01-03
Autor: agent

## Objetivo
Materializar o CRM Headless Genesis (mínimo) com:
- Models `Contact` e `Deal`
- Endpoint de ingestão `/ingest/message` (sem LLM)
- Migração Alembic criando `crm_contacts` e `crm_deals` (JSONB no Postgres)

## Escopo
Inclui somente as tarefas 1..5 da OS (arquivos listados abaixo).
Não inclui UI, automação LLM, nem entidades extras.

## Passos (executar 1 por vez)
1) Criar/atualizar models e API de ingestão
   - Mudanças:
     - Criar/sobrescrever:
       - `apps/crm-core/src/models/contact.py`
       - `apps/crm-core/src/models/deal.py`
       - `apps/crm-core/src/api/v1/ingest.py`
     - Atualizar:
       - `apps/crm-core/src/main.py` (registrar `ingest_router` sem prefix extra)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - App importa sem erro
     - `POST /ingest/message` existe (rota registrada)
     - Gates PASS

---

# PLAN — OS-CANONICALIZE-CRM-OS-004-005-20260103-007
Data: 2026-01-03
Autor: agent

## Objetivo
Versionar no Vault (SSOT) as duas OS canônicas:
1) Fechamento OS 004 (CRM Headless Genesis)
2) OS 005 pronta para execução (Ingest Persistence + Evento Canônico)

## Passos (executar 1 por vez)
1) Criar OS no Vault
   - Mudanças:
     - Adicionar:
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004.md`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-INGEST-PERSISTENCE-20260103-005.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Arquivos existem com conteúdo fechado (sem lacunas)
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004.md apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-INGEST-PERSISTENCE-20260103-005.md PLAN.md`
     - `git commit -m "chore(vault): canonicalize CRM OS 004 + OS 005"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL
Data: 2026-01-03
Autor: agent

## Objetivo
Implementar MHC Router + Worker blindado no CRM Headless:
- Payload normalizado (contrato rígido)
- Paralelismo via asyncio.gather (Safety + SRV stubs)
- Idempotência por status + lock
- Retry/backoff via `compute_next_retry`
- Extensão do Dispatcher com fetch/lock + mark_success/mark_failure
- Registrar OS 007 no Vault

## Passos (executar 1 por vez)
1) Implementar Router/Processors/Dispatcher/Worker + payload completo no ingest
   - Mudanças:
     - Adicionar:
       - `apps/crm-core/src/processors/base.py`
       - `apps/crm-core/src/processors/safety.py`
       - `apps/crm-core/src/processors/srv.py`
       - `apps/crm-core/src/services/router.py`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL.md`
     - Atualizar:
       - `apps/crm-core/src/services/dispatcher.py` (adicionar métodos, manter compat)
       - `apps/crm-core/src/workers/outbox_worker.py` (sobrescrever)
       - `apps/crm-core/src/api/v1/ingest.py` (garantir `raw_content` + `metadata` no payload)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `py -3.11 -m compileall apps\crm-core\src`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Worker importa sem SyntaxError
     - Payload para Router sempre contém `trace_id`, `contact_id`, `raw_content`, `metadata`
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/processors/base.py apps/crm-core/src/processors/safety.py apps/crm-core/src/processors/srv.py apps/crm-core/src/services/router.py apps/crm-core/src/services/dispatcher.py apps/crm-core/src/workers/outbox_worker.py apps/crm-core/src/api/v1/ingest.py apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL.md PLAN.md`
     - `git commit -m "feat(crm-core): MHC router + idempotent outbox worker (OS 007)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B
Data: 2026-01-03
Autor: agent

## Objetivo
Desbloquear `ci-crm-core` (PR #19) corrigindo `ModuleNotFoundError: sqlalchemy` durante collection do pytest, adicionando SQLAlchemy (asyncio) às deps de teste do `crm-core`.

## Passos (executar 1 por vez)
1) Atualizar deps de teste do crm-core
   - Mudanças:
     - Atualizar `apps/crm-core/requirements-test.txt` adicionando `sqlalchemy[asyncio]`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - `apps/crm-core/requirements-test.txt` inclui `sqlalchemy[asyncio]>=2.0,<3`
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/requirements-test.txt PLAN.md`
     - `git commit -m "chore(crm-core): add sqlalchemy asyncio to test deps to fix CI import collection"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B (VAULT CLOSE)
Data: 2026-01-03
Autor: agent

## Objetivo
Registrar no Vault (SSOT) o fechamento canônico da OS 007B (hotfix CI do crm-core).

## Passos (executar 1 por vez)
1) Criar registro no Vault
   - Mudanças:
     - Adicionar `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Arquivo existe com evidências (branch/commit/gates)
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B.md PLAN.md`
     - `git commit -m "chore(vault): close CRM OS 007B (sqlalchemy test deps)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL
Data: 2026-01-03
Autor: agent

## Objetivo
Implantar contratos, matemática determinística e governança de estados no `crm-core`:
- Schemas Pydantic (Constituição)
- Engine determinístico (Respiração)
- Máquina de estados (Coração)
- Testes mínimos para impedir regressão
- Registro no Vault (SSOT)

## Passos (executar 1 por vez)
1) Criar módulos e testes do CRM
   - Mudanças:
     - Adicionar:
       - `apps/crm-core/src/schemas/__init__.py`
       - `apps/crm-core/src/services/__init__.py`
       - `apps/crm-core/src/schemas/life_map.py`
       - `apps/crm-core/src/services/math_engine.py`
       - `apps/crm-core/src/services/state_machine.py`
       - `apps/crm-core/tests/test_math_engine.py`
       - `apps/crm-core/tests/test_pipeline_governor.py`
       - `apps/crm-core/PLAN.md`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis\apps\crm-core`
     - `py -3.11 -m compileall src`
     - `py -3.11 -m pytest -q`
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Imports estáveis (`src.schemas.life_map`, `src.services.math_engine`, `src.services.state_machine`)
     - Testes PASS
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/schemas/__init__.py apps/crm-core/src/services/__init__.py apps/crm-core/src/schemas/life_map.py apps/crm-core/src/services/math_engine.py apps/crm-core/src/services/state_machine.py apps/crm-core/tests/test_math_engine.py apps/crm-core/tests/test_pipeline_governor.py apps/crm-core/PLAN.md apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL.md PLAN.md`
     - `git commit -m "chore(crm-core): add life map schemas, deterministic math engine, and pipeline governor"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

2) Criar migração Alembic (contacts + deals)
   - Mudanças:
     - Adicionar nova migration em `apps/crm-core/alembic/versions/` criando:
       - `crm_contacts`
       - `crm_deals` + FK `contact_id -> crm_contacts.id`
       - colunas JSON com JSONB no Postgres (via `with_variant`)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Migration versionada no repo
     - Gates PASS

3) Commit e push (unico) da OS CRM Headless Genesis
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/models/contact.py apps/crm-core/src/models/deal.py apps/crm-core/src/api/v1/ingest.py apps/crm-core/src/main.py apps/crm-core/alembic/versions/* .gitignore PLAN.md`
     - `git commit -m "feat(crm-core): headless genesis (contacts, deals, ingest, migration)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

# PLAN — WP5 RBAC Clean-Room (crm-core)

Objetivo: implementar RBAC clean-room em `apps/crm-core` com motor determinístico deny-wins, auditoria mínima e pontos de integração (tests + FastAPI opcional), sem adicionar dependências novas no Node.

## Passos

1) Normalizar modelo + motor RBAC (compilável e determinístico)
   - Mudancas:
     - Corrigir `apps/crm-core/src/models/security.py` (campos exigidos pelo SSOT, default_factory para timestamp, remover imports duplicados)
     - Corrigir `apps/crm-core/src/security/authorize.py` (imports, store injetável opcional, auditoria inclui correlation_id + matched_rules)
     - Adicionar `__init__.py` mínimos para suportar imports via `src` no sys.path
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam

2) Adicionar testes unitários do motor (sem dependências externas)
   - Mudancas:
     - Criar `apps/crm-core/tests/test_authorize.py` usando `unittest`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam
     - Testes cobrem: allow, deny-wins, default deny, wildcard, scope

3) Integração FastAPI (opcional, import-safe)
   - Mudancas:
     - Criar `apps/crm-core/src/security/fastapi_integration.py` com:
       - `build_authz_router()` (endpoint /authz/check)
       - `RBACMiddleware` (enforce via headers `x-rbac-resource`/`x-rbac-action` + `x-principal-id`)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam

---

# PLAN — OS-ROTA-A-ENCERRAR-SSOT-20251231-003 (Freeze Evidence Pack)

Objetivo: congelar no Git (SSOT) o pacote mínimo de evidências da Rota A, sem interpretação, e registrar nota canônica no Chronos.

## Passos

1) WP1 — Consolidar evidências no repo (pasta canônica)
   - Mudancas:
     - Garantir que `C:\Aurora\Ozzmosis\_thirdparty_evidences\` contém:
       - `commits.txt`
       - `erxes_hits.txt`
       - `odoo_hits.txt`
       - `corteza_hits.txt`
     - Se `odoo_hits.txt` não existir, gerar de forma determinística a partir de `C:\Aurora\_thirdparty\odoo`.
   - Prova (PowerShell):
     - `$e = 'C:\Aurora\Ozzmosis\_thirdparty_evidences'`
     - `Get-ChildItem $e | Select-Object Name, Length | Format-Table -AutoSize`
     - `(Get-Item (Join-Path $e 'commits.txt')).Length`
     - `(Get-Item (Join-Path $e 'erxes_hits.txt')).Length`
     - `(Get-Item (Join-Path $e 'odoo_hits.txt')).Length`
     - `(Get-Item (Join-Path $e 'corteza_hits.txt')).Length`
   - Criterios de aceite:
     - Os 4 arquivos existem e `Length > 0`

2) WP2 — Congelar SSOT no Git (sem interpretação)
   - Mudancas:
     - Commit do diretório `_thirdparty_evidences/` contendo os 4 arquivos.
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add _thirdparty_evidences`
     - `git commit -m "chore(thirdparty): freeze evidence pack (erxes/odoo/corteza) [ROTA-A]"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Commit criado contendo os 4 arquivos

3) WP3 — Registro no Chronos (SSOT editorial)
   - Mudancas:
     - Criar `docs/chronos/THIRDPARTY_EVIDENCEPACK_ROTA_A.md` contendo:
       - data/hora
       - 3 SHAs (erxes/odoo/corteza) do `commits.txt`
       - paths dos 4 arquivos no repo
       - regra clean-room (“sem copiar código”)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git add docs/chronos/THIRDPARTY_EVIDENCEPACK_ROTA_A.md`
     - `git commit -m "chore(chronos): record ROTA-A evidence pack SSOT"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Arquivo criado e commitado

---

# PLAN — OS-ROTA-B-MODELAGEM-CLEANROOM-20260101-001 (Specs SSOT)

Objetivo: produzir especificações implementáveis (sem copiar código) para Inbox/Conversas, Pipeline Vendas (Cotação→Proposta→Contrato + Approvals) e RBAC, com glossário de mapeamento; cada spec referencia explicitamente os SHAs em `_thirdparty_evidences/commits.txt`.

## Passos

1) Criar specs SSOT (arquivos)
   - Mudancas:
     - Criar:
       - `docs/specs/inbox_conversations_spec.md`
       - `docs/specs/pipeline_sales_b2g_spec.md`
       - `docs/specs/rbac_spec.md`
       - `docs/specs/glossary_cleanroom.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Specs implementáveis (campos, estados, invariantes, APIs mínimas)
     - Sem trechos de código third-party
     - Cada spec cita explicitamente SHAs do `commits.txt`
     - Gates passam

2) Commitar specs (SSOT)
   - Mudancas:
     - Commit contendo os 4 arquivos em `docs/specs/`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git add docs/specs`
     - `git commit -m "docs(specs): add clean-room specs (ROTA-B)"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Commit criado

---

# PLAN — OS-CODEX-CHRONOS-POINT-TO-VAULT-20260102-003
Data: 2026-01-02
Autor: agent

## Objetivo
Conectar o Chronos ao Vault Ademicon para navegacao e indexacao SSOT, sem duplicar conteudo.

## Escopo
Inclui:
- Descobrir onde o Chronos vive e como indexa.
- Conectar o Vault Ademicon como root (preferencial) ou via stubs.
- Expor item de navegacao "Ademicon (Vault)".
- Rodar o index/build do Chronos para prova de indexacao.
- Registrar evidencias em `CHRONOS_LINK_STATUS.md`.
Nao inclui:
- Criar features novas.
- Alterar logica de negocio.
- Copiar a verdade para fora do Vault.
- Remediacao do erro npm EBUSY (OS humana separada).

## Riscos
- R1: Alterar configuracoes do Chronos sem conhecer o indexador pode quebrar a navegacao.
- R2: Duplicar conteudo (copiar arquivos) viola SSOT.
- R3: Gates nao executados apos cada passo podem violar o processo do repo.

## Passos (executar 1 por vez)
1) Descoberta do Chronos e indexador (somente leitura)
   - Comandos:
     - `dir apps`
     - `Get-ChildItem -Recurse apps | Select-Object -First 200`
     - `rg -n "index\\.json|frontmatter|yaml|metadata|generate.*index|build.*index|library" -S .`
     - `rg -n "Chronos" -S .`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente leitura).
   - Criterios de aceite:
     - Identificar a pasta raiz do Chronos.
     - Identificar o script/rota que gera index/busca.
     - Gates passam.

2) Conectar Vault Ademicon ao Chronos (roots ou stubs)
   - Comandos:
     - `apply_patch` (ajustar config/roots ou criar stubs conforme achado)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Arquivos de config do Chronos (a definir na descoberta)
     - Possiveis stubs em `apps/<chronos>/content/vault/ademicon/**` (se necessario)
   - Criterios de aceite:
     - Chronos referencia o Vault Ademicon sem copiar conteudo.
     - Gates passam.

3) Expor navegacao minima (menu "Ademicon (Vault)")
   - Comandos:
     - `apply_patch` (ajustar nav do Chronos)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Arquivo(s) de navegacao do Chronos (a definir na descoberta)
   - Criterios de aceite:
     - Menu inclui item "Ademicon (Vault)" com link para `SSOT_STATES.md`.
     - Gates passam.

4) Prova de indexacao (smoke)
   - Comandos:
     - `<comando real do Chronos>` (ex.: `npm -w <chronos> run build` ou `npm -w <chronos> run index`)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Artefato de index/manifest do Chronos (gerado pelo build).
   - Criterios de aceite:
     - Index/manifest inclui ao menos 4 docs do Vault Ademicon.
     - Gates passam.

5) Registrar evidencias (CHRONOS_LINK_STATUS.md)
   - Comandos:
     - `apply_patch` (criar arquivo de status com evidencias)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/CHRONOS_LINK_STATUS.md`
   - Criterios de aceite:
     - Arquivo criado com data, caminho do Chronos, metodo de consumo, comandos e local do index.
     - Gates passam.

6) Commit e push (mudancas do Chronos + status)
   - Comandos:
     - `git add <arquivos alterados>`
     - `git status -sb`
     - `git commit -m "chore(chronos): link Ademicon vault to Chronos SSOT"`
     - `git push`
   - Arquivos:
     - Arquivos alterados do Chronos e `CHRONOS_LINK_STATUS.md`.
   - Criterios de aceite:
     - `git status -sb` limpo apos commit.
     - Commit criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-DIA-03-MOCK-MRS-ADEMICON-GOLD
Data: 2026-01-02
Autor: agent

## Objetivo
Gerar o Mock Integration Environment MRS (Maturity, Rhythm, Safety) com dados sintéticos Ademicon para Chronos/Conductor/Dashboard.

## Escopo
Inclui:
- Criar `apps/ozzmosis/data/mocks/ademicon/`.
- Criar README e projections.json.
- Gerar datasets `consultants_mrs.csv`, `chat_logs_srv.json`, `events_stream.json`.
Nao inclui:
- UI nova ou alteracoes em produtos fora Ademicon.
- Integracoes reais ou dependencias externas.

## Riscos
- R1: Distribuicoes (55/25/20 e 80/20) fora do especificado invalidam o mock.
- R2: Incoerencia entre scores e sinais quebra o modelo MRS.
- R3: Gates nao executados apos cada passo violam processo do repo.

## Passos (executar 1 por vez)
1) Criar estrutura do mock, README e projections.json
   - Comandos:
     - `apply_patch` (README.md e projections.json)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/README.md`
     - `apps/ozzmosis/data/mocks/ademicon/projections.json`
   - Criterios de aceite:
     - Arquivos criados com conteudo conforme OS.
     - Gates passam.

2) Gerar `consultants_mrs.csv` (500 consultores, distribuicao MRS)
   - Comandos:
     - `python` (gerador deterministico para CSV)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/consultants_mrs.csv`
   - Criterios de aceite:
     - 500 linhas de consultores + header.
     - Distribuicoes 55/25/20 e 80/20 atendidas.
     - Gates passam.

3) Gerar `chat_logs_srv.json` e `events_stream.json`
   - Comandos:
     - `python` (gerador deterministico a partir do CSV)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/chat_logs_srv.json`
     - `apps/ozzmosis/data/mocks/ademicon/events_stream.json`
   - Criterios de aceite:
     - Campos obrigatorios presentes e coerentes com MRS.
     - Gates passam.

4) Commit e push
   - Comandos:
     - `git add apps/ozzmosis/data/mocks/ademicon`
     - `git status -sb`
     - `git commit -m "chore(mocks): add Ademicon MRS mock dataset"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/**`
   - Criterios de aceite:
     - `git status -sb` limpo apos commit.
     - Commit criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-JULES-ELYBI-MIGRATION-PLAN-AND-STT-TOOLBELT-20260102-001
Data: 2026-01-02
Autor: agent

## Objetivo
Localizar o Elysian Brain no repo Elysian, decidir a integracao com Ozzmosis e entregar o ToolBelt STT como lib/CLI em `libs/elysian-brain`, com playbook e evidencias no Vault.

## Escopo
Inclui:
- Forense no repo `C:\\Aurora\\Elysian` (tree + inventario de pyproject/proto + referencias).
- Registrar forense e plano de integracao no Vault Ozzmosis.
- Criar `libs/elysian-brain` com ToolBelt STT e CLI.
- Criar playbook e estrutura de transcripts no Vault Rodobens.
- Registrar evidencias e executar gates.
Nao inclui:
- Migracao total do Brain sem decisao (opcao B).
- Alteracoes em UIs ou produtos fora do escopo.

## Riscos
- R1: Repo Elysian nao acessivel/localizacao divergente.
- R2: Introduzir Python sem quebrar gates Node.
- R3: Evidencias incompletas invalidam a OS.

## Passos (executar 1 por vez)
1) WP0/WP1 Forense no Elysian (somente leitura)
   - Comandos:
     - `cd C:\\Aurora\\Elysian`
     - `git remote -v`
     - `git rev-parse HEAD`
     - `git status -sb`
     - `tree apps\\aurora-brain /f`
     - `tree shared\\proto /f`
     - `Get-ChildItem -Recurse -Filter pyproject.toml | Select-Object FullName`
     - `Get-ChildItem -Recurse -Filter \"aurora_brain.v1.proto\" | Select-Object FullName`
     - `rg -n \"aurora[-_ ]brain|elysian[-_ ]brain|brain|toolbelt|transcribe|whisper|ffmpeg\" .`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente leitura).
   - Criterios de aceite:
     - Forense concluida com paths encontrados.
     - Gates passam.

2) WP1 Entregavel: ELYBI_FORENSICS.md
   - Comandos:
     - `apply_patch` (criar arquivo com status factual e tabela)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_FORENSICS.md`
   - Criterios de aceite:
     - Arquivo criado com status, paths e tabela.
     - Gates passam.

3) WP2 Entregavel: ELYBI_INTEGRATION_PLAN.md
   - Comandos:
     - `apply_patch` (escolha A/B + justificativa + estrutura)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_INTEGRATION_PLAN.md`
   - Criterios de aceite:
     - Opcao escolhida com justificativa e estrutura final.
     - Gates passam.

4) WP3 Criar libs/elysian-brain (ToolBelt STT + CLI + smoke test)
   - Comandos:
     - `apply_patch` (criar estrutura, pyproject, README, toolbelt e tests)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `libs/elysian-brain/pyproject.toml`
     - `libs/elysian-brain/README.md`
     - `libs/elysian-brain/src/elysian_brain/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
     - `libs/elysian-brain/tests/test_smoke_transcribe_cli.py`
   - Criterios de aceite:
     - CLI `elysian-transcribe --help` executavel via poetry script.
     - Smoke test importa o modulo sem erro.
     - Gates passam.

5) WP4 Vault Rodobens (playbook + diretório)
   - Comandos:
     - `apply_patch` (criar playbook + .gitkeep)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md`
     - `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/.gitkeep`
   - Criterios de aceite:
     - Arquivos criados conforme OS.
     - Gates passam.

6) WP5 Evidencias + commits
   - Comandos:
     - `apply_patch` (criar ELYBI_EXECUTION_EVIDENCE.md)
     - `scripts/agents/run-gates.ps1`
     - `git add <arquivos>`
     - `git commit -m \"chore(vault): add elysian brain forensics + integration plan + playbook\"`
     - `git commit -m \"chore(toolbelt): add elysian brain stt toolbelt\"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_EXECUTION_EVIDENCE.md`
     - arquivos do WP1-WP4
   - Criterios de aceite:
     - Dois commits atomicos com mensagens especificadas.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-CRMCORE-IMPLEMENT-SPECS-20260101-001 (FastAPI + DB + RBAC)

Objetivo: implementar `apps/crm-core` conforme `docs/specs/*.md` (commit 63d698c) com:
- Modelos SQLAlchemy + migração Alembic (RBAC/Inbox/Pipeline/Audit)
- Routers FastAPI v1 com enforcement RBAC (deny-by-default por teste)
- Auditoria obrigatória em ações sensíveis
- Testes (unit+integration) para RBAC, transições e audit trail

Restrições:
- Sem copiar código third-party
- Endpoints v1 (exceto health) devem declarar permissão explicitamente
- Auditoria obrigatória nos pontos definidos pela OS

## Passos

1) WP1 — Preparação (detectar stack e preparar scaffolding)
   - Mudancas:
     - Confirmar ausência/presença de `pyproject.toml`, `alembic.ini`, `pytest` e app FastAPI.
     - Se ausente, criar scaffolding mínimo compatível com os paths da OS.
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Estrutura e imports definidos de forma determinística

2) WP2 — Modelos + Migração (RBAC/Inbox/Pipeline/Audit)
   - Mudancas (arquivos obrigatórios):
     - `apps/crm-core/src/models/rbac.py`
     - `apps/crm-core/src/models/inbox.py`
     - `apps/crm-core/src/models/pipeline.py`
     - `apps/crm-core/src/models/audit.py`
     - `apps/crm-core/alembic/versions/*_rbac_inbox_pipeline_audit.py`
     - `apps/crm-core/alembic.ini` + `apps/crm-core/alembic/env.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Migração existe e cria tabelas/indices mínimos

3) WP3 — RBAC runtime + audit helper
   - Mudancas:
     - `apps/crm-core/src/security/policy.py` (mapa canônico de permissions)
     - `apps/crm-core/src/security/dependencies.py` (`get_current_subject`, `require_permission` deny-by-default)
     - `apps/crm-core/src/security/audit.py` (`write_audit_log` helper único)
     - Wiring de prova (endpoint protegido mínimo):
       - `apps/crm-core/src/api/v1/health.py`
       - `apps/crm-core/src/api/v1/rbac.py` (GET `/rbac/_probe` exige `PERM_RBAC_ADMIN`)
       - `apps/crm-core/src/main.py` (FastAPI app mínimo + include_router)
     - Teste de enforcement:
       - `apps/crm-core/tests/test_rbac_enforcement.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - `require_permission` nega por default (401/403) e permite bootstrap controlado
     - Helper de auditoria é único e reutilizável por routers
     - Prova A (importabilidade): PASS
     - Prova B (pytest): CI-ENFORCED (Trustware, runner-only) — ver `.github/workflows/ci-crm-core.yml`
       - deps: `apps/crm-core/requirements-test.txt`
       - comando no runner: `cd apps/crm-core && python -m pytest -q`
     - Prova C (gates): CI inclui gate “CI - crm-core (pytest)” como fonte de verdade para WP3
   - Policy:
     - Installs locais continuam proibidos; testes rodam apenas no runner (CI)

### WP3 — Evidence & Checks (Trustware-safe)

- scripts/wp2-wp3_evidences.ps1 (read-only evidence collection; writes to artifacts/wp3/evidence/)
- scripts/wp2-wp3_fix_and_collect.ps1 (read-only checks; writes to artifacts/wp3/checks/)
- apps/crm-core/tests/quarantine/* (legacy artifacts, non-discoverable)

4) WP4 — Routers v1 (RBAC/Inbox/Pipeline/Health)
   - Mudancas:
     - `apps/crm-core/src/api/v1/health.py`
     - `apps/crm-core/src/api/v1/rbac.py`
     - `apps/crm-core/src/api/v1/inbox.py`
     - `apps/crm-core/src/api/v1/pipeline.py`
     - `apps/crm-core/src/main.py` (FastAPI app + include_router)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Endpoints implementados e cada rota v1 (exceto health) declara permissão

5) WP5 — Testes (RBAC deny-by-default + flows + audit)
   - Mudancas:
     - `apps/crm-core/tests/test_rbac_enforcement.py`
     - `apps/crm-core/tests/test_inbox_conversations.py`
     - `apps/crm-core/tests/test_pipeline_state_machine.py`
     - `apps/crm-core/tests/test_audit_trail.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Tests implementados conforme OS; deny-by-default provado via inspeção de rotas

---

# PLAN — OS-CRMCORE-WP4-API-20260101-005 (Inbox + Pipeline endpoints mínimos)
Data: 2026-01-01
Autor: agent
Status: IN PROGRESS

## Objetivo
Expor endpoints REST mínimos de Inbox e Pipeline com RBAC + Audit, mantendo CI como fonte de verdade e sem ampliar escopo.

## Escopo
Inclui:
- Permissões RBAC WP4 em `policy.py` e bootstrap controlado em `dependencies.py`
- Endpoints Inbox e Pipeline v1 com auditoria obrigatória
- Testes pytest (CI runner) para inbox create/read e pipeline state transitions (válida e inválida)
- Nota Chronos OS-CRMCORE-WP4-API-20260101-005
Nao inclui:
- UI, integrações externas, WebSocket/streaming, autenticação externa, multi-tenant avançado

## Riscos
- R1: Bootstrap RBAC permissivo demais; mitigação: liberar apenas permissões listadas em `ALL_PERMISSIONS`.
- R2: Auditoria sem DB real; mitigação: usar sessão stub (duck-typed) apenas para registrar payloads em memória.

## Passos (executar 1 por vez)
1) Ajustar permissões RBAC WP4 + bootstrap controlado
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/security/policy.py`
     - `apps/crm-core/src/security/dependencies.py`
     - `apps/crm-core/requirements-test.txt`
   - Criterios de aceite:
     - Constantes `inbox:*` e `pipeline:*` compatíveis com WP4
     - Bootstrap permite apenas permissões em `ALL_PERMISSIONS`
     - `requirements-test.txt` inclui `SQLAlchemy` se necessário para importar `audit.py`
     - Gates passam

2) Implementar endpoints Inbox + testes
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/api/v1/inbox.py`
     - `apps/crm-core/src/main.py`
     - `apps/crm-core/tests/test_inbox_api.py`
   - Criterios de aceite:
     - RBAC `inbox:read`/`inbox:write` aplicado em todas as rotas
     - Auditoria registrada em cada rota
     - Testes cobrem create/read/list (CI runner)
     - Gates passam

3) Commit Inbox
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add apps/crm-core/src/api/v1/inbox.py apps/crm-core/src/main.py apps/crm-core/tests/test_inbox_api.py apps/crm-core/src/security/policy.py apps/crm-core/src/security/dependencies.py`
     - `git commit -m "feat(crm-core): add inbox endpoints (WP4)"`
     - `git log -1 --oneline`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Commit criado com as mudancas do Inbox
     - Gates passam

4) Implementar endpoints Pipeline + testes
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/api/v1/pipeline.py`
     - `apps/crm-core/src/main.py`
     - `apps/crm-core/tests/test_pipeline_api.py`
   - Criterios de aceite:
     - RBAC `pipeline:create`/`pipeline:advance`/`pipeline:read` aplicado em todas as rotas
     - Transicoes invalidas retornam 403 + audit
     - Testes cobrem transicao valida e invalida (CI runner)
     - Gates passam

5) Commit Pipeline
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add apps/crm-core/src/api/v1/pipeline.py apps/crm-core/src/main.py apps/crm-core/tests/test_pipeline_api.py`
     - `git commit -m "feat(crm-core): add pipeline endpoints (WP4)"`
     - `git log -1 --oneline`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Commit criado com as mudancas do Pipeline
     - Gates passam

6) Atualizar PLAN + Chronos
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `PLAN.md`
     - `docs/chronos/OS-CRMCORE-WP4-API-20260101-005.md`
   - Criterios de aceite:
     - Status do WP4 em `PLAN.md` marcado como PASS
     - Nota Chronos criada
     - Gates passam

## Gates
- `scripts\agents\run-gates.ps1`

## Rollback
- `git revert <sha>` para cada commit do WP4
- `scripts\agents\run-gates.ps1`
# PLAN — OS-CODEX-VAULT-ADEMICON-GENESIS-20260102-001
Data: 2026-01-02
Autor: agent

## Objetivo
Materializar o Vault Ademicon como SSOT em disco, criando a estrutura e os arquivos mestres exatamente como especificado na OS, sem criar features.

## Escopo
Inclui:
- Criar a estrutura `apps/ozzmosis/data/vault/ademicon/` com subpastas 00..04.
- Criar os arquivos `.md` e `.json` do Vault com o conteudo fornecido na OS.
- Garantir .gitkeep em `02_MOCKS`.
Nao inclui:
- Criacao de dados mock reais.
- Integracao com Chronos.
- Alteracoes fora do Vault Ademicon.

## Riscos
- R1: Comandos fora do allowlist (git checkout/pull/add/commit/push, run-gates) exigem execucao humana.
- R2: Conteudo divergente do texto fornecido na OS invalida o SSOT.
- R3: Gates nao executados apos passos invalidam o processo do repo.

## Passos (executar 1 por vez)
1) Sincronizar o repo na branch main
   - Comandos:
     - `git checkout main`
     - `git pull --rebase`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum.
   - Criterios de aceite:
     - Branch em `main` e sem conflitos.
     - Gates passam.

2) Criar estrutura do Vault Ademicon e arquivos mestres (conteudo exato da OS)
   - Comandos:
     - `apply_patch` (criar pastas/arquivos e inserir os conteudos exatamente como especificado)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/README.md`
     - `apps/ozzmosis/data/vault/ademicon/00_MANIFESTO/DOCTRINE_WEALTH.md`
     - `apps/ozzmosis/data/vault/ademicon/01_STATES/SSOT_STATES.md`
     - `apps/ozzmosis/data/vault/ademicon/02_MOCKS/SCHEMA_DEF.md`
     - `apps/ozzmosis/data/vault/ademicon/02_MOCKS/.gitkeep`
     - `apps/ozzmosis/data/vault/ademicon/03_POLICIES/risk_policy.md`
     - `apps/ozzmosis/data/vault/ademicon/04_DASHBOARD/wireframe_spec.md`
   - Criterios de aceite:
     - Todos os arquivos existem com conteudo idêntico ao especificado.
     - Gates passam.

3) Verificacao rapida (sanity)
   - Comandos:
     - `dir apps/ozzmosis/data/vault/ademicon`
     - `dir apps/ozzmosis/data/vault/ademicon/00_MANIFESTO/DOCTRINE_WEALTH.md`
     - `dir apps/ozzmosis/data/vault/ademicon/01_STATES/SSOT_STATES.md`
     - `dir apps/ozzmosis/data/vault/ademicon/02_MOCKS/SCHEMA_DEF.md`
     - `dir apps/ozzmosis/data/vault/ademicon/03_POLICIES/risk_policy.md`
     - `dir apps/ozzmosis/data/vault/ademicon/04_DASHBOARD/wireframe_spec.md`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente verificacao).
   - Criterios de aceite:
     - Todos os arquivos listados aparecem no `dir`.
     - Gates passam.

4) Commit unico do Vault Ademicon
   - Comandos:
     - `git add apps/ozzmosis/data/vault/ademicon`
     - `git status -sb`
     - `git commit -m "chore(vault): genesis Ademicon SSOT vault (wealth doctrine + states + policies)"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/**`
   - Criterios de aceite:
     - `git status -sb` sem pendencias apos commit.
     - Commit unico criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---
