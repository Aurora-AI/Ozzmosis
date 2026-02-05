# CONSTITUTION AURORA

**Status:** Canonical  
**Version:** 1.0  
**Effective Date:** 2026-01-12  
**Repository:** Ozzmosis (SSOT)  

---

## 1. Princípios Fundadores

Aurora é um sistema inteligente de orquestração operacional baseado em:

1. **Verdade Única (SSOT):** Uma única fonte canônica para cada decisão, configuração e padrão
2. **Fidelidade Operacional:** Cumprimento exato das intenções declaradas, sem improviso
3. **Determinismo Processual:** Processos são repetiveis, testáveis, auditáveis
4. **Separação de Responsabilidades:** Decisão (Backend) vs. Manifestação (Frontend)

---

## 2. Arquitetura de Governança

### 2.1 Papéis Constitucionais

| Papel | Responsabilidade | Autoridade |
|-------|------------------|-----------|
| **Comandante** | Intenção estratégica, priorização, validação de valor | Veto final, mudança de direção |
| **Aurora (LLM)** | Tradução de intenção em especificação técnica, planejamento | Proposta de arquitetura, risco |
| **Executor (Copilot)** | Execução fiel de planos aprovados, gate validation, commit | Implementação sem refatoração extra |
| **Sistema (Repo/Git)** | SSOT da verdade, auditoria, contratos | Imutabilidade de commits, história |

### 2.2 Fluxo de Decisão

```
Intenção (Comandante) → Plano (Aurora) → Execução (Copilot) → SSOT (Repo)
```

- Comandante **nunca executa direto**
- Aurora **nunca executa código**
- Copilot **nunca planeja estratégia**
- Repositório **é a verdade**

---

## 3. Documentação Canônica

Toda documentação segue hierarquia:

```
CONSTITUICAO/
├── CONSTITUTION_AURORA.md (este)
├── MANUAL_DE_CONSTRUCAO_AURORA_V6.0.md (processo)
└── PROCESS_MANUAL_ALIAS_V6.0.md (alias)

docs/AGENTS/
├── LAW.md (lei com subordinação)
├── README.md
└── ...
```

**Invariante:** Documentos constitucionais não mudam sem Vault Close.

---

## 4. Processo de Trabalho (OS → Plan → Execute → Close)

### 4.1 Ciclo de Vida de Ordem de Serviço (OS)

1. **Abertura:** OS descrito em markdown com WPs numerados
2. **Planejamento:** PLAN.md criado com passos exatos
3. **Execução:** Um WP por commit, gates após cada passo
4. **Fechamento:** Vault Close file criado, documentando resultado

### 4.2 Invariantes de Commit

- **Tamanho:** Um WP = um commit
- **Mensagem:** Padrão `feat(scope):` ou `fix(scope):`
- **Gates:** Devem passar antes de push
- **Idempotência:** Executar 2x deve dar mesmo resultado

---

## 5. Trustware (Permissões e Policies)

Operações divididas em:

- **Permitidas:** Leitura, lint, typecheck, testes, build
- **Requer Confirmação:** Qualquer comando destrutivo (git reset --hard, docker prune, etc.)
- **Proibidas:** Modificar secrets, alterar branch sem OS

Ver [POLICY_TRUSTWARE.md](../../docs/AGENTS/POLICY_TRUSTWARE.md) para lista completa.

---

## 6. Gates e Validação

Todo commit passa por:

1. **Repo Check:** `npm run repo:check` (no Windows ou Linux container)
2. **Build:** Compilação de todos os apps
3. **Typecheck:** Validação de tipos TypeScript/Python
4. **Lint:** Análise estática de código
5. **Smoke Tests:** Testes críticos de integração
6. **Survival Tests:** Testes de longa duração (estabilidade)

Linux gates (`scripts/agents/run-gates-linux.ps1`) são **canônicos** para CI/CD.

---

## 7. Governo de Frontend

Frontend é **compilador de intenção**:

- **Entrada:** Decisões (do Backend), Tokens (SSOT visual)
- **Processamento:** Tradução declarativa (sem lógica de negócio)
- **Saída:** UI legível por DevTools

**Regra:** Toda mudança de UI começa com mudança de Token SSOT.

---

## 8. Governo de Backend

Backend é **motor de inteligência**:

- **Entrada:** Eventos, requisições, policies
- **Processamento:** Decisão, validação, adaptation
- **Saída:** Comandos para Frontend (e para persistência)

**Regra:** Toda decisão é auditável e determinística.

---

## 9. Vault: Single Source of Truth

Vault (`docs/Vault/`) contém:

- **CONSTITUICAO/:** Documentos constitucionais (imutáveis)
- **FRONTEND/:** Regras de Frontend Factory
- **OS/:** Histórico de Ordens de Serviço
- **LIVRO/:** Narrativa de evolução (capítulos)

Arquivos criados em Vault:
- Nunca saem de Vault
- Apenas recebem Vault Close quando ciclo termina
- São versionados como parte do contrato do repositório

---

## 10. Derivação (Cópias de Trabalho)

Documentos de trabalho (não-Vault) são **derivações** de canônicos:

- Quando canônico muda, derivações devem ser sincronizadas
- Derivações são alias ou espelhos para facilitar acesso
- Conflito resolve-se sempre a favor do canônico em Vault

---

## 11. Contrato com Ferramentas

### 11.1 Git

- **Lockfile:** Único `package-lock.json` na raiz
- **Instalação:** `npm ci` (reproduzível)
- **Branchs:** Feature branches para cada OS
- **Commits:** Um WP = um commit, mensagens descritivas

### 11.2 Docker

- **Compose Dev:** `docker/compose.triad.dev.yml` (local)
- **Gates Linux:** Executado em container Linux (determinístico)
- **Artifacts:** Vault `/apps/ozzmosis/data/vault/`

### 11.3 npm

- **Scripts Padrão:**
  - `npm run repo:check` - Repo validation
  - `npm run build:conductor` - Build apps
  - `npm run lint:conductor` - Lint apps
  - `npm run typecheck:conductor` - Type validation
  - `npm run smoke:conductor` - Smoke tests
  - `npm run survival:conductor` - Survival tests

---

## 12. Métricas de Saúde

1. **Gates PASS:** Todo commit deve passar em gates
2. **SPC ≥ 8.0:** Mudanças em God Mode requerem Cognitive Scoring ≥ 8.0
3. **Determinismo:** Dois runs de mesmo WP devem produzir mesmo output
4. **Cobertura:** Novos componentes requerem testes

---

## 13. Evolução Constitucional

Esta Constituição pode evoluir através de:

1. **Aditivo:** Novo artigo adicionado, referenciando este
2. **Supersessão:** Novo documento declara-se successor (com referência histórica)
3. **Vault Close:** Documento entra em Vault, histórico fica em `os_history/`

Toda mudança deixa trilha auditável.

---

## 14. Anexos Referenciais

- [Manual de Construção Aurora v6.0](./MANUAL_DE_CONSTRUCAO_AURORA_V6.0.md)
- [Agents Law](../../docs/AGENTS/LAW.md)
- [Frontend Governance](./FRONTEND/FRONTEND_GOVERNANCE.md)
- [Trustware Policy](../../docs/AGENTS/POLICY_TRUSTWARE.md)

---

## 15. Assinatura Constitucional

| Aspecto | Confirmação |
|---------|-------------|
| Repositório | `c:\Aurora\Ozzmosis` |
| Vault | `docs/Vault/` |
| Branches Operacionais | `chore/os-*` |
| Gates Canônicos | `scripts/agents/run-gates-linux.ps1` |
| Status | **VIGENTE** |

---

**Última Atualização:** 2026-01-12  
**Próxima Revisão:** 2026-02-01 (ou conforme needed)  
**Custodian:** Aurora Governance System
