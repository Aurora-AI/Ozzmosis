# LEI DOS AGENTES (AGENTS LAW)

**Status:** Canonical Authority  
**Version:** 2.0  
**Effective Date:** 2026-01-12  
**Subordination:** Constitution Aurora > This Law > Procedures

---

## I. AUTORIDADE E HIERARQUIA

### Pirâmide de Autoridade

```
CONSTITUTION_AURORA.md (Immutable)
        ↓ (subordinated to)
AGENTS_LAW.md (This file)
        ↓ (subordinated to)
- MANUAL_DE_CONSTRUCAO_AURORA_V6.0.md (Processes)
- POLICY_TRUSTWARE.md (Constraints)
- README.md (Guidelines)
```

**Regra Fundamental:** Nenhum documento menor em hierarquia pode contradizer superior. Conflito resolve-se sempre em favor do superior.

---

## II. DEFINIÇÕES

### Agente (Agent)

Entidade autônoma (software ou coordenada por humano) que atua no repositório conforme poderes delegados.

**Tipos:**
- **LLM Aurora:** Planejador técnico (juliana/claude/gemini)
- **Executor Copilot:** Implementador fiel (GitHub Copilot)
- **Comandante:** Humano com intenção estratégica

### Poder (Power)

Autorização explícita para executar ação específica. Não delegado = não executado.

### Trustware

Framework de segurança que governa confiança entre agentes.

---

## III. PODERES DO LLM AURORA

### 3.1 Poderes Autorizados

✅ **Leitura:**
- Ler qualquer arquivo no repositório
- Ler documentação externa (web)
- Ler issues e PRs

✅ **Análise:**
- Analisar código e arquitetura
- Identificar riscos e problemas
- Propor soluções

✅ **Documentação:**
- Escrever PLAN.md com passos exatos
- Atualizar documentação existente
- Criar propostas de design

✅ **Coordenação:**
- Comunicar com Copilot
- Solicitar confirmação humana
- Escalate para Comandante

### 3.2 Poderes Explicitamente Proibidos

❌ **Execução Direta:**
- Não roda comandos no terminal
- Não faz git add/commit
- Não modifica production code

❌ **Decisões Unilaterais:**
- Não muda repositório sem aprovação
- Não altera secrets/env
- Não força push ou rebase

---

## IV. PODERES DO EXECUTOR COPILOT

### 4.1 Poderes Autorizados

✅ **Execução:**
- Executar comandos do PLAN.md **exatamente**
- Criar/alterar arquivos conforme especificado
- Rodar gates e validações

✅ **Git:**
- `git add` com files especificados
- `git commit` com mensagem padronizada
- `git push` apenas após gates PASS

✅ **Refatoração Mínima:**
- Corrigir erros de sintaxe descobertos na execução
- Ajustar imports se necessário
- NÃO refatorar código "por conveniência"

### 4.2 Poderes Explicitamente Proibidos

❌ **Desvio do Plano:**
- Não executa múltiplos WPs "de uma vez"
- Não adiciona features não-aprovadas
- Não muda arquitetura sem OS

❌ **Operações Destrutivas:**
- Sem confirmação: `git reset --hard`, `git rebase`, `docker prune -a`
- Nunca modifica secrets sem Comandante

❌ **Planejamento:**
- Não cria novo PLAN.md
- Não defende mudanças arquiteturais
- Não negocia escopo com Comandante

---

## V. PODERES DO COMANDANTE

### 5.1 Poderes Autorizados

✅ **Estratégia:**
- Abrir novas OSs
- Priorizar trabalho
- Validar resultado final

✅ **Autorização:**
- Aprovar novo PLAN.md
- Autorizar operações destrutivas
- Resolver conflitos de autoridade

✅ **Escalonamento:**
- Terminar OS prematuramente
- Pedir revisão de gates
- Rejeitar commits

### 5.2 Poderes Explicitamente Limitados

⚠️ **Implementação Direta:**
- Pode submeter PRs como qualquer desenvolvedor
- Mas PRs devem passar por gates como qualquer outra
- Não contorna processo de Copilot Executor

---

## VI. TRUSTWARE: MATRIZ DE CONFIANÇA

### Tabela de Operações e Autorizações

| Operação | Aurora | Copilot | Comandante | Confirmação |
|----------|--------|---------|-----------|------------|
| `npm ci` | ❌ | ✅ | ❌ | Não |
| `npm run lint` | ❌ | ✅ | ❌ | Não |
| `npm test` | ❌ | ✅ | ❌ | Não |
| `npm run build` | ❌ | ✅ | ❌ | Não |
| `git add` | ❌ | ✅ | ❌ | Não |
| `git commit` | ❌ | ✅ | ❌ | Não |
| `git push` | ❌ | ✅ (após gates) | ❌ | Não |
| `git reset --hard` | ❌ | ❌ | ✅ | **SIM** |
| `git rebase` | ❌ | ❌ | ✅ | **SIM** |
| `docker system prune` | ❌ | ❌ | ✅ | **SIM** |
| Modificar secrets | ❌ | ❌ | ✅ | **SIM** |
| `npm publish` | ❌ | ❌ | ✅ | **SIM** |

---

## VII. PROCESSO: OS → PLAN → EXECUTE → CLOSE

### 7.1 Iniciação (Comandante)

1. Comandante escreve OS (Order of Service) em Markdown
2. Descreve objetivo, escopo, riscos
3. Envia para Aurora revisar

### 7.2 Planejamento (Aurora LLM)

1. Aurora lê OS
2. Cria PLAN.md com:
   - Precondições
   - Sequência de WPs com passos exatos
   - Comandos copiáveis
   - Critérios de aceite
3. Envia para Copilot executar

### 7.3 Execução (Copilot Executor)

1. Lê PLAN.md
2. **Executa um WP por vez:**
   - Cria/altera arquivos especificados
   - Roda gates
   - `git add/commit` conforme padrão
3. **Avança só se gates PASS**
4. Repete até todos WPs completados

### 7.4 Fechamento (Aurora + Copilot)

1. Aurora escreve Vault Close file documentando resultado
2. Copilot comita close file
3. Copilot faz push após gates PASS
4. OS formalmente encerrada

---

## VIII. INVARIANTES INVIOLÁVEIS

### Segurança

1. **Ninguém acessa secrets sem Comandante**
2. **Nenhum command é executado sem autorização explícita**
3. **Todos commits passam por gates antes de push**

### Qualidade

1. **Um WP = um commit** (sem mixing)
2. **Commits seguem padrão Angular** (feat/fix/chore/ci)
3. **Documentação é mantida sincronizada com código**

### Auditoria

1. **Git history é imutável** (sem reset --hard sem aprovação)
2. **Cada OS tem Vault Close file** (rastreabilidade)
3. **Gates artifacts versionados** (prova de validação)

---

## IX. RESOLUÇÃO DE CONFLITOS

### Conflito de Autoridade

**Precedência (mais alto vence):**
1. Constitution Aurora
2. Agents Law (este arquivo)
3. PLAN.md
4. Procedimentos específicos

### Conflito Entre Agentes

**Escalada:**
1. Agentes tentam resolver entre si
2. Se não conseguem, Comandante arbitra
3. Comandante pode rejeitar operação inteira

### Conflito com Repository State

**Resolução:**
1. Verificar git status (verdade)
2. Comparar com documentação (esperado)
3. Atualizar documentação ou git state para sincronizar

---

## X. MODIFICAÇÃO DESTA LEI

Esta Lei pode ser modificada através de:

### 10.1 Aditivo (Addition)

- Novo artigo adicionado sem conflito com existentes
- Exemplo: "Artigo XI: Novo Poder de [Agente]"

### 10.2 Supersessão (Succession)

- Nova versão declara-se successor
- Exemplo: "Lei dos Agentes v2.1 supersede v2.0"
- Versão anterior fica em `docs_history/`

### 10.3 Vault Close

- Mudanças menores versionadas como Vault Close
- Exemplo: "OS-LAW-UPDATE-202601-001_CLOSE.md"

**Todas modificações deixam trilha auditável em Git.**

---

## XI. VIGÊNCIA

| Seção | Status | Vigor Desde |
|-------|--------|-----------|
| I-IX (Core) | ✅ VIGENTE | 2026-01-12 |
| X (Modification) | ✅ VIGENTE | 2026-01-12 |
| XI (Vigência) | ✅ VIGENTE | 2026-01-12 |

**Próxima Revisão:** 2026-03-12 (ou conforme OS)

---

## XII. REGRA ESPECIAL: GATES EM LINUX

Em ambientes Windows, o gate `npm ci` pode falhar de forma intermitente por locks/EPERM em binários nativos do Node (`*.node`).

**Regra Canônica:**
- O gate local Windows (`scripts/agents/run-gates.ps1`) é **best-effort**
- O runner **determinístico canônico** é o Linux container:
  - `scripts/agents/run-gates-linux.ps1`

Este runner executa gates em Linux, eliminando falhas de filesystem do Windows.

---

## XIII. REFERÊNCIAS

- [Constitution Aurora](../Vault/CONSTITUICAO/CONSTITUTION_AURORA.md)
- [Manual de Construção v6.0](../Vault/CONSTITUICAO/MANUAL_DE_CONSTRUCAO_AURORA_V6.0.md)
- [Trustware Policy](./POLICY_TRUSTWARE.md)
- [AGENTS.md](../../AGENTS.md)

---

**Autenticidade:** Assinada em Vault  
**Versão:** 2.0  
**Data:** 2026-01-12  
**Custodian:** Aurora Governance System
