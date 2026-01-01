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
     - Prova B (pytest): BLOCKED — `No module named pytest` (pip/venv fora do allowlist, requer decisão explícita)
     - Prova C (gates): DEFERRED — somente após Prova B destravada
   - Next Action (decisão de liderança):
     - Autorizar instalação local via venv/pip, OU rodar pytest em CI/runner provisionado

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



