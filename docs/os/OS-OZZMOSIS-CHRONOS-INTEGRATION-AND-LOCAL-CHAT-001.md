# OS-OZZMOSIS-CHRONOS-INTEGRATION-AND-LOCAL-CHAT-001

**Status:** AUTORIZADA — PRONTA PARA EXECUÇÃO  
**Executor:** GitHub Copilot/Codex (execução direta no GitHub)  
**Repo alvo (destino):** `Aurora-AI/Ozzmosis`  
**Repo fonte (somente leitura):** `Aurora-AI/Elysian-Lex-Front`  

## 0) Regras não negociáveis (contrato de fábrica)
1. Instalação canônica: `npm ci` na raiz (com `package-lock.json` único na raiz).
2. Lockfiles proibidos fora da raiz (inclusive *untracked*): `**/package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `npm-shrinkwrap.json`, `.npmrc`.
3. Contrato é lei: se falhar no gate/CI, não entra em `main`.
4. Side-effects por padrão = zero: gates não podem “sujar” o repo (ver `npm run repo:clean`).
5. Provider cloud por padrão é proibido: chat interno deve usar SLM local (Ollama) sem API key externa.
6. Repo fonte permanece intocado.

## 1) Objetivo
Importar (somente) o recorte autorizado do repo fonte e integrar ao contrato do Ozzmosis:
- `apps/chronos-backoffice/` (Chronos Backoffice)
- `libs/trustware/` (Trustware)

E implementar no Chronos um chat interno com SLM local (Ollama), com streaming e sem persistência automática.

## 2) Escopo
### Inclui
- Importação do recorte autorizado (apps + libs).
- Normalização para npm workspaces + lockfile único.
- Scripts canônicos a partir da raiz para Chronos.
- CI dedicado para Chronos (sem regredir Conductor).
- Chat interno com Ollama (provider plugável por env; sem fallback cloud).
- Documentação e relatórios canônicos em `docs/chronos/`.

### Exclui (proibido nesta OS)
- Produtos (CRM/Jurídico/consultoria/apps fora do recorte).
- Automação de upload para Drive/Vault (apenas procedimento humano).
- Mudanças “arquiteturais” no recorte antes de compilar (primeiro compilar, depois refinar em OS própria).

## WP0 — Discovery determinístico (gate antes de importar)
**Objetivo:** provar que o recorte existe e revelar acoplamentos/riscos antes de mover bytes.

### Passos
1. Criar branch a partir de `main`:
   - `feat/chronos-import-001`
2. Clonar o repo fonte em pasta temporária (NÃO commitar):
   - `git clone --depth=1 https://github.com/Aurora-AI/Elysian-Lex-Front.git .__source__/elysian-lex-front`
3. Verificar existência:
   - `.__source__/elysian-lex-front/apps/chronos-backoffice`
   - `.__source__/elysian-lex-front/libs/trustware`
4. Gerar `docs/chronos/CHRONOS_DISCOVERY_REPORT.md` contendo:
   - árvore (até 2 níveis) de `apps/chronos-backoffice` e `libs/trustware`
   - `package.json` de ambos (colar no relatório)
   - varredura de riscos (listar ocorrências e exemplos):
     - imports para fora do recorte (paths/aliases para outras libs)
     - uso de `process.env` sem validação
     - side-effects server (fs write, downloads, postinstall gerador, etc.)
     - dependência hardcoded de provider cloud (OpenAI/Anthropic/etc.)
5. Gate WP0:
   - se as pastas não existirem nos paths esperados, parar e registrar no relatório
   - se houver provider cloud hardcoded, parar e registrar no relatório

### Checklist WP0 (contrato)
- Rodar `npm run repo:check` (deve passar).
- Garantir que `.__source__/` não entra no git (remover ao final da OS).

## WP1 — Importação bruta (somente recorte autorizado)
### Passos
1. Copiar exatamente (sem refactor ainda):
   - `.__source__/elysian-lex-front/apps/chronos-backoffice` → `apps/chronos-backoffice`
   - `.__source__/elysian-lex-front/libs/trustware` → `libs/trustware`
2. Remover quaisquer lockfiles/configs proibidos que vierem junto (inclusive *untracked*):
   - `apps/chronos-backoffice/**/package-lock.json`
   - `libs/trustware/**/package-lock.json`
   - `yarn.lock`, `pnpm-lock.yaml`, `npm-shrinkwrap.json`, `.npmrc`

### Gate WP1
- `npm run repo:check` deve falhar se houver lockfile/config proibido fora da raiz — corrigir antes de prosseguir.

## WP2 — Normalização para o contrato do Ozzmosis (workspaces + scripts canônicos)
### Passos
1. No `package.json` raiz:
   - manter `workspaces` canônicos (`apps/*`, `libs/*`, `packages/*`)
   - adicionar scripts canônicos (sem quebrar os do Conductor), por exemplo:
     - `lint:chronos`
     - `typecheck:chronos`
     - `build:chronos`
     - `test:chronos` (se aplicável)
2. Ajustar dependências para workspace-native:
   - `apps/chronos-backoffice` deve consumir `libs/trustware` via dependency `"workspace:*"` (sem path hack).
3. TS/ESLint:
   - alinhar para não criar “config concorrente” (preferir `extends` do padrão canônico quando existir).

### Gates WP2
- `npm ci` na raiz deve concluir.
- `npm run build:chronos` deve rodar a partir da raiz.

## WP3 — CI gate do Chronos (sem regredir o Kernel)
### Passos
1. Criar workflow dedicado: `.github/workflows/ci-chronos.yml` com gatilho por paths:
   - `apps/chronos-backoffice/**`
   - `libs/trustware/**`
   - `package.json`, `package-lock.json`
2. Job deve executar (em ordem):
   - `npm ci`
   - `npm run repo:check`
   - `npm run lint:chronos`
   - `npm run typecheck:chronos`
   - `npm run build:chronos`
   - `npm run test:chronos` (se aplicável)
   - `npm run repo:clean`

### Gate WP3
- CI do Chronos verde.
- CI do Conductor continua verde (Kernel inviolável).

## WP4 — Chat interno com SLM local (Ollama), arquitetura plugável
### Requisitos obrigatórios
- Sem API key externa.
- Provider selecionável por env (default: `ollama`).
- Streaming.
- Sem persistência automática (side-effects = zero).
- Sem fallback para provider cloud.

### Implementação (mínimo)
1. Dependências no workspace do Chronos (conforme stack detectada no WP0):
   - Vercel AI SDK (`ai`)
   - Provider de Ollama (community provider)
2. Env vars:
   - `CHRONOS_LLM_PROVIDER=ollama` (default)
   - `OLLAMA_BASE_URL=http://127.0.0.1:11434`
   - `CHRONOS_LLM_MODEL=<modelo-local>`
3. Rotas (se Chronos for Next.js App Router):
   - UI: `apps/chronos-backoffice/app/ops/chat/page.tsx`
   - API (streaming): `apps/chronos-backoffice/app/api/ops/chat/route.ts`
4. Segurança/doutrina:
   - negar provider não reconhecido (falha explícita)
   - logs sem conteúdo sensível
   - nenhum fallback para OpenAI/Anthropic/etc.

### Gate WP4
Criar `docs/chronos/LOCAL_LLM.md` com:
- como instalar/rodar Ollama
- como setar env vars
- smoke manual do chat (passo a passo)

## WP5 — Limpeza, documentação e PR
1. Remover `.__source__/` integralmente.
2. Gerar/atualizar docs canônicas:
   - `docs/chronos/CHRONOS_DISCOVERY_REPORT.md`
   - `docs/chronos/LOCAL_LLM.md`
3. Atualizar `README.md` do Ozzmosis apenas para incluir Chronos no mapa da arquitetura (sem produto).
4. Garantir gates de contrato e Kernel:
   - `npm run repo:check`
   - gates do Conductor
   - `npm run repo:clean`
5. PR:
   - Título: `feat(chronos): import chronos-backoffice + trustware with local SLM chat`
   - Linkar os docs em `docs/chronos/`

## Validação final (sequência oficial)
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

## Definition of Done
- `npm ci` passa em clone limpo.
- `repo:check` passa e detecta lockfiles/config proibidos fora da raiz (inclusive untracked).
- Gates do Conductor passam.
- `repo:clean` passa (em CI deve ser estrito).
- `docs/chronos/` contém discovery report + manual do LLM local.
- PR não introduz provider cloud por padrão.

