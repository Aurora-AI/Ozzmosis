# Formalização do Ozzmosis como Monorepo Node Canônico (Aurora/Elysian 2.0) + Hardening do Aurora Conductor

## Contexto e Decisão

Este PR **formaliza** o repositório **Ozzmosis** como o **monorepo Node canônico** para a Aurora/Elysian 2.0.

Objetivo: eliminar ambiguidade operacional (instalações por subpasta, múltiplos lockfiles, "funciona na minha máquina"), garantindo um ambiente **limpo, reproduzível e governado por CI**.

Este repositório **não aceita experimentos**: tudo precisa ser determinístico, auditável e consistente com pipelines de qualidade.

---

## O que este PR entrega

### 1) Contrato formal do repositório (governança)

- **README.md** atualizado com o fluxo canônico (instalação na raiz, workspaces, quality gates).
- **docs/CONTRACT.md** criado com regras não-negociáveis:
  - **instalação canônica via `npm ci` na raiz**
  - **lockfile único na raiz**
  - **workspaces como estrutura oficial**
  - **CI como gate obrigatório**

### 2) Monorepo Node formal (infraestrutura)

- `package.json` na raiz com **npm workspaces** e scripts canônicos.
- Consolidação do fluxo de instalação e execução para operar na raiz (reprodutibilidade).

### 3) Aurora Conductor "consumível" e com gates

- Entrypoint público do Conductor garantido (build gera `dist/index.js`).
- Smoke tests e scripts padronizados para validar que o Conductor não é "pacote vazio".
- Workflow de CI alinhado ao contrato para impedir regressões.

---

## Mudanças que podem impactar o time (impactos reais)

### Instalação e execução (mudança de contrato)

**Antes:** instalações/execuções podiam acontecer dentro de `libs/aurora-conductor/` (fluxo variável).  
**Agora:** o fluxo canônico é **na raiz**.

- Instalação: `npm ci` (na raiz)
- Qualidade do Conductor (na raiz):
  - `npm run build:conductor`
  - `npm run typecheck:conductor`
  - `npm run lint:conductor`
  - `npm run smoke:conductor`

### Lockfile único

Este PR reforça que há **um único lockfile canônico na raiz**.
Isso é necessário para:
- Cache consistente no CI
- Reprodutibilidade real (mesma árvore de deps)
- Redução de drift entre devs

### CI passa a rodar na raiz

O workflow GitHub Actions agora:
- Faz `npm ci` na raiz (não em subpastas)
- Roda scripts raiz para validar Conductor
- Dispara em mudanças de infraestrutura/contrato

---

## Como validar (passo a passo)

### Local (ambiente limpo recomendado)

```bash
npm ci
npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
npm run smoke:conductor
```

**Saída esperada:**
- Todos os comandos retornam exit code 0
- Smoke test imprime `=== ✅ SMOKE PASSED ===`

### CI (GitHub Actions)

O workflow roda automaticamente em PRs/pushes que afetem Conductor/infra raiz e executa os mesmos gates acima.

---

## Escopo e Não-Escopo

### Incluído

* Formalização do monorepo e seu contrato operacional
* Hardening do Conductor para ser consumível e validável
* CI alinhado ao contrato
* Eliminação de lockfiles duplicados
* Documentação clara de regras não-negociáveis

### Não incluído

* Estratégia Open Source/Premium (decisão posterior: primeiro integrar e estabilizar internamente)
* Migração de apps legados (mycelium-front, alvaro-core) — tratados como "em transição"

---

## Por que isso é necessário

Sem um contrato explícito, o repositório entra em modo "experimento": múltiplas formas de instalar e rodar, drift de dependências, e regressões que escapam do CI.

Este PR fecha essa porta e estabelece a base do **Elysian 2.0**:
**limpo, perfeito, sem retrabalho estrutural.**

---

## Checklist de Merge

- [ ] CI verde no PR (GitHub Actions)
- [ ] README.md documentado com `npm ci` na raiz
- [ ] docs/CONTRACT.md deixa explícito lockfile único
- [ ] Não há lockfile duplicado em `libs/*` ou `apps/*`
- [ ] Smoke test roda no CI e local
- [ ] Descrição de PR clara com mudanças estruturais

---

## Commits Incluídos (7 total)

1. `d5ed77d` — fix(conductor): add src/index.ts entrypoint with explicit exports
2. `082ecf8` — chore(workspace): add root package.json and smoke test infrastructure
3. `e59c710` — docs(conductor): add smoke test execution report
4. `f852e82` — ci(conductor): add GitHub Actions workflow for automated quality gates
5. `2ae3fa7` — docs: formalize Ozzmosis as canonical Node monorepo
6. `37415ab` — chore: enforce single lockfile contract
7. `127bcc5` — ci: align workflow with monorepo contract

---

**Versão:** 1.0  
**Data:** 2025-12-27  
**Status:** Pronto para merge
