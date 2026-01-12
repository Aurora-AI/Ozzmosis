# MANUAL DE CONSTRUÇÃO AURORA V6.0

**Status:** Canonical Reference  
**Version:** 6.0  
**Effective Date:** 2026-01-12  
**Repository:** Ozzmosis (SSOT)  

---

## 1. Visão Geral

Este manual padroniza como projeto Aurora é construído, governado e mantido. Serve como referência operacional canônica para Comandantes, Aurora (LLM), e Copilot (Executor).

---

## 2. Arquitetura do Repositório

### 2.1 Estrutura Base

```
C:\Aurora\Ozzmosis (Raiz)
├── AGENTS.md                    # Contrato operacional dos agentes
├── PLAN.md                      # Plano macro do projeto
├── README.md                    # Introdução ao repositório
├── package.json                 # Dependências Node.js
├── package-lock.json            # Lock file (único, reproduzível)
├── pyrightconfig.json           # Config Pyright (Python type check)
├── eslint.config.mjs            # Config ESLint
│
├── apps/                        # Aplicações (serviços + frontends)
│   ├── alvaro-core/             # Backend Python (Genesis engine)
│   ├── aurora-conductor-service/ # Serviço orquestrador
│   ├── butantan-shield/         # Serviço de segurança
│   ├── chronos-backoffice/      # Frontend Next.js (backoffice)
│   ├── crm-core/                # Backend Python (CRM)
│   ├── genesis-front/           # Frontend React (primário)
│   ├── mycelium-front/          # Frontend Next.js (secundário)
│   └── ozzmosis/                # Repositório de dados/vault
│
├── libs/                        # Bibliotecas compartilhadas
│   ├── aurora-chronos/          # Orquestrador temporal
│   ├── aurora-conductor/        # Condução de operações
│   ├── elysian-brain/           # Ferramentas de IA/NLP
│   └── trustware/               # Engine de validação de policies
│
├── docs/                        # Documentação canônica
│   ├── AGENTS/                  # Lei e regras de agentes
│   │   ├── LAW.md               # Lei dos Agentes (hierarquia)
│   │   ├── POLICY_TRUSTWARE.md  # Políticas de confiança
│   │   ├── README.md
│   │   └── ...
│   ├── Vault/                   # SSOT imutável
│   │   ├── CONSTITUICAO/
│   │   │   └── CONSTITUTION_AURORA.md (este manual refere)
│   │   ├── FRONTEND/
│   │   ├── OS/
│   │   └── ...
│   ├── manual/                  # Manuais (versão de trabalho)
│   ├── specs/                   # Especificações técnicas
│   └── ...
│
├── scripts/                     # Scripts utilitários
│   ├── agents/
│   │   ├── run-gates.ps1        # Gates (Windows)
│   │   ├── run-gates-linux.ps1  # Gates (Linux/Container - CANÔNICO)
│   │   ├── new-plan.ps1         # Gerar novo PLAN
│   │   └── ...
│   ├── audit/
│   ├── rodobens/
│   └── ...
│
├── .github/workflows/           # CI/CD (GitHub Actions)
│   ├── ci-*.yml                 # Workflows por app
│   └── ...
│
├── docker/                      # Configuração containers
│   ├── compose.triad.dev.yml    # Dev: Alvaro, Conductor, CRM
│   └── .env.triad.example
│
└── artifacts/                   # Saída de gates (versionado)
    ├── entrypoints_check.json
    └── survival_check.json
```

### 2.2 Convenções de Nomenclatura

- **Apps:** minúsculas-com-hífen (e.g., `alvaro-core`)
- **Libs:** minúsculas-com-hífen (e.g., `aurora-chronos`)
- **Branches:** `feat/`, `fix/`, `chore/`, `ci/` prefixes (AGENTS.md)
- **Commits:** `feat(scope):`, `fix(scope):`, `ci(scope):` (Angular style)

---

## 3. Fluxo de Trabalho (OS → Plan → Execute → Close)

### 3.1 Fase 1: Abertura de OS (Order of Service)

**Documento:** `OS-[CODENAME]-[DATE]-[SEQUENCE].md`

Exemplo: `OS-GOV-AGENTS-CONTEXT-FOUNDATION-20260112-001.md`

**Conteúdo Obrigatório:**

```markdown
# OS-[NAME]

**Abertura:** YYYY-MM-DD
**Comandante:** [Nome do requisitante]
**Executor:** GitHub Copilot (Executor Role)
**Status:** ABERTA

## Objetivo
[Descrição da intenção]

## Escopo (WPs)

### WP1: [Descrição]
- Entrada: 
- Saída:
- Critério de Aceite:

### WP2: ...

## Dependências
[Se houver]

## Riscos
[Identificação de riscos conhecidos]
```

### 3.2 Fase 2: Planejamento (Aurora Role)

Aurora cria `PLAN.md` no repositório raiz, com:

1. **Precondições:** Verificações necessárias antes de executar
2. **WPs Detalhados:** Um para cada foco
   - Passos numerados (1.1, 1.2, etc.)
   - Comandos exatos (copiáveis)
   - Critérios de aceite específicos
3. **Sequência:** Ordem de execução (linear ou paralelo)
4. **Gates:** Validações após cada WP

**Formato:**

```markdown
# PLAN.md - [OS Name]

## Precondições
1. Branch setup
2. Dependencies installed
3. All gates passing

## WP1: [Name]
### 1.1 [Passo]
```

### 3.3 Fase 3: Execução (Copilot Role)

Copilot executa **exatamente um WP por vez**:

1. Realiza mudanças necessárias (criar/alterar arquivos)
2. Roda gates (Windows + Linux)
3. Commits com mensagem padrão
4. Move para próximo WP **somente se gates PASS**

**Invariantes:**
- ✅ Um WP = um commit
- ✅ Sem refatoração "por conveniência"
- ✅ Sem dependências não-aprovadas
- ✅ Sem mensagens aleatórias

### 3.4 Fase 4: Fechamento (Vault Close)

Quando todos WPs completados com gates PASS:

1. Cria arquivo Vault Close em `docs/Vault/OS/`:
   - Nome: `OS-[CODENAME]-[DATE]-[SEQUENCE]_CLOSE.md`
   - Documenta resultado final
   - Lista todos commits gerados

2. Commit final: `chore(os): close OS-[CODENAME]`

3. Push para origin

**Exemplo Close File:**

```markdown
# OS-GOV-AGENTS-CONTEXT-FOUNDATION-20260112-001_CLOSE

**Resultado:** ✅ SUCESSO
**Data Fechamento:** 2026-01-12
**Total de WPs:** 7
**Commits Gerados:** [lista exata de SHAs]
**Gates Status:** PASS (Windows + Linux)

[Detalhes de cada WP]
```

---

## 4. Instalação e Setup

### 4.1 Instalação Inicial

```powershell
# Clone repositório
git clone https://github.com/Aurora/Ozzmosis.git
cd Ozzmosis

# Instale dependências (único lockfile)
npm ci

# Valide setup com gates
& ./scripts/agents/run-gates.ps1

# Ou em Linux/Container
./scripts/agents/run-gates-linux.ps1
```

### 4.2 Configuração VS Code

VSCode usa configuração em `.vscode/`:

- **settings.json:** Preferências do workspace
- **tasks.json:** Tasks automáticas (build, test, lint)

Scripts úteis predefinidos:
- `npm run repo:check` - Validate repo state
- `npm run build:conductor` - Build apps
- `npm run lint:conductor` - Lint code
- `npm run typecheck:conductor` - Type validation

---

## 5. Gates: Validação Contínua

Gates são **porta de entrada** para qualquer mudança.

### 5.1 Windows Gates (Best Effort)

```powershell
& ./scripts/agents/run-gates.ps1
```

Executa:
1. `npm ci` - Instala dependências
2. `npm run repo:check` - Valida estado
3. Build, lint, typecheck
4. Smoke tests (rápido)

### 5.2 Linux Gates (Canônico)

```powershell
& ./scripts/agents/run-gates-linux.ps1
```

Executa **dentro de container Linux** (determinístico):
- Same gates como Windows
- Resultados garantidamente reproduzíveis
- **Necessário para CI/CD**

### 5.3 Saída de Gates

Gera artefatos em `artifacts/`:

```json
{
  "status": "PASS",
  "timestamp": "2026-01-12T10:00:00Z",
  "checks": {
    "repo_check": "PASS",
    "build": "PASS",
    "typecheck": "PASS",
    "lint": "PASS",
    "smoke": "PASS"
  }
}
```

**Invariante:** Nenhum commit é pushed sem gates PASS.

---

## 6. Aplicações Principais

### 6.1 Alvaro Core (Backend Python)

**Propósito:** Motor de inteligência, decisão, persistência

```
apps/alvaro-core/
├── src/alvaro/             # Código principal
│   ├── genesis/            # Engine de decisões
│   ├── services/           # Serviços de negócio
│   └── models/             # Modelos de dados
├── tests/                  # Testes pytest
├── pyproject.toml          # Config Python
└── pytest.ini              # Config pytest
```

**Comandos:**
```bash
cd apps/alvaro-core
python -m pytest               # Run tests
python src/alvaro/app.py      # Run server
```

### 6.2 Genesis Front (Frontend React)

**Propósito:** Compilador de intenção (decisões → UI)

```
apps/genesis-front/
├── app/                    # App Router (Next.js)
├── components/             # Componentes React
├── lib/                    # Utilities
├── styles/                 # CSS/Tokens
└── package.json            # Dependências
```

**Comandos:**
```bash
cd apps/genesis-front
npm run dev                # Dev server (localhost:3000)
npm run build && npm start # Production
npm run lint               # Lint code
```

### 6.3 CRM Core (Backend Python)

**Propósito:** Orquestração de CRM, deals, proposals

```
apps/crm-core/
├── src/                    # Código principal
├── alembic/                # Migrações de BD
├── tests/                  # Testes
└── pyproject.toml
```

### 6.4 Aurora Conductor Service (TypeScript)

**Propósito:** Serviço de orquestração central

```
apps/aurora-conductor-service/
├── src/                    # Código TS
├── tests/                  # Testes
└── package.json
```

---

## 7. Governo de Dados (Vault)

Vault (`docs/Vault/`) contém:

1. **Documentação Canônica:**
   - Constituição
   - Manuais de construção
   - Regras e políticas

2. **Histórico de Operações:**
   - OSs completadas (com Close files)
   - Decisões arquiteturais
   - Evidências de gates

3. **Produto:**
   - Especificações visuais
   - Tokens de design
   - Workflows

**Invariante:** Arquivo entra em Vault apenas com Vault Close. Nunca sai de lá.

---

## 8. Trustware: Políticas de Confiança

Operações clasificadas por nível de confiança:

### Permitidas (sem confirmação)

```bash
npm ci                     # Install deps
npm run lint              # Lint code
npm run typecheck         # Type check
npm run build             # Build apps
npm test                  # Run tests
git status                # View status
```

### Requer confirmação humana explícita

```bash
git reset --hard          # Revert commits
git rebase                # Rebase branch
docker system prune       # Clean docker
npm publish               # Publish package
```

### Proibidas (bloqueia execução)

```bash
rm -rf                    # Delete directories
git push --force          # Force push
docker system prune -a    # Prune all images
# Modificar secrets.env
```

Ver [POLICY_TRUSTWARE.md](../../docs/AGENTS/POLICY_TRUSTWARE.md) para lista completa.

---

## 9. Contrato com Ferramentas

### 9.1 Git

- **Lockfile:** Único `package-lock.json` na raiz
- **Instalação:** `npm ci` (exato, reproduzível)
- **Branches:** Feature branches para cada OS
- **Commits:** Um WP = um commit, padrão Angular

### 9.2 Docker

- **Compose dev:** `docker/compose.triad.dev.yml`
- **Images:** Node.js LTS + Python 3.11+ base
- **Gates Linux:** Executado em container Alpine/Linux

### 9.3 CI/CD

- **GitHub Actions:** `.github/workflows/`
- **Triggers:** Cada PR testa todas as mudanças
- **Gating:** Falha sem gates PASS

---

## 10. Processo de Code Review

Antes de aceitar PR:

1. ✅ Todos tests passam (ci-*.yml)
2. ✅ Gates PASS (Windows + Linux)
3. ✅ Commits seguem convenção (angular style)
4. ✅ Um WP = um commit (sem mixing)
5. ✅ Sem mudanças fora escopo da OS
6. ✅ Documentação atualizada (se aplicável)

---

## 11. Troubleshooting

### Gates falhando?

```powershell
# Clear node_modules e reinstale
rm -r node_modules
npm ci
& ./scripts/agents/run-gates.ps1
```

### Build falhando?

```bash
npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
```

### Tests falhando?

```bash
# Run specific test
npm test -- --testPathPattern="auth"

# Verbose output
npm test -- --verbose
```

### Docker issues?

```bash
# Check compose config
docker compose -f docker/compose.triad.dev.yml config

# View logs
docker compose -f docker/compose.triad.dev.yml logs -f

# Restart services
docker compose -f docker/compose.triad.dev.yml restart
```

---

## 12. Evolução do Manual

Versões:
- **v5.0:** Descrição inicial
- **v6.0:** Adição de WP-based workflows + Linux gates (este)

Mudanças futuras serão documentadas em Vault Close files.

---

## 13. Referências

- [Constitution Aurora](./CONSTITUTION_AURORA.md)
- [Agents Law](../../docs/AGENTS/LAW.md)
- [Trustware Policy](../../docs/AGENTS/POLICY_TRUSTWARE.md)
- [Frontend Governance](./FRONTEND/FRONTEND_GOVERNANCE.md)

---

**Versão:** 6.0  
**Data:** 2026-01-12  
**Vigência:** Até nova revisão  
**Custodian:** Aurora Governance System
