# Ozzmosis — Canonical Node Monorepo (Aurora / Elysian 2.0)

> "A verdade não é um dado estático, mas um artefato sociotécnico construído."

Este repositório é o **monorepo Node canônico** para a próxima geração da Aurora/Elysian (Elysian 2.0).
Aqui **não há experimentos**: tudo que entra deve ser **reprodutível, auditável e compatível com CI**.

---

## Contrato do Repositório (não negociável)

### 1) Instalação canônica
A instalação é feita **na raiz** e deve ser determinística.

```bash
npm ci
```

* Não execute `npm install` dentro de `libs/*` ou `apps/*` como fluxo principal.
* O repositório deve manter **um único lockfile canônico**: `package-lock.json` na raiz.

### 2) Workspaces (estrutura oficial)

Este monorepo usa **npm workspaces**.

* `libs/*` — bibliotecas internas (ex.: `aurora-conductor`)
* `apps/*` — aplicações e CLIs

**Arquitetura atual:**
* **Pedagogia:** apps/mycelium-front
* **Identidade:** apps/alvaro-core
* **Imunidade:** apps/butantan-shield
* **Inteligência:** libs/elysian-brain
* **Governança:** libs/aurora-conductor

### 3) Quality Gates (CI e local)

Qualquer alteração relevante deve passar pelos gates abaixo (local e no GitHub Actions):

```bash
npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
npm run smoke:conductor
npm run survival:conductor
```

**Regra:** Se o CI estiver vermelho, não entra.

### ⛔ Não Faça Isso (regressão estrutural)

Para manter o contrato, existem operações **proibidas**:

* ❌ Não execute `npm install` dentro de `libs/*` ou `apps/*` como fluxo principal
* ❌ Não commite lockfiles em `libs/*` ou `apps/*` (apenas root `package-lock.json`)
* ❌ Não rodadores de build/test em subpastas sem sincronizar com scripts raiz
* ❌ Não mude o `package.json` raiz sem revisão (estrutura de workspace é crítica)

**Rationale:** Múltiplos lockfiles ou instalações descentralizadas criam divergências que escapam do CI e causam "funciona na minha máquina". O contrato unifica tudo.

---

## Aurora Conductor (libs/aurora-conductor)

O `aurora-conductor` é um componente central de governança e integridade.
Ele deve ser:

* **Consumível** (possuir entrypoint público: `src/index.ts` → `dist/index.js`)
* **Tipado** (typecheck limpo)
* **Lintado** (ESLint consistente para TypeScript)
* **Executável** (smoke runtime + funcional)

### Rodar apenas os checks do Conductor

```bash
npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
npm run smoke:conductor
```

---

## Desenvolvimento

### Pré-requisitos

* Node.js LTS (recomendado 20+)
* npm 10+

### Setup

```bash
npm ci
```

### Padrões de PR

Todo PR deve conter:

1. **Motivação explícita** (por que isso existe)
2. **Impactos/Breaking changes**, se houver
3. **Como validar** (comandos exatos)
4. CI verde

---

## CI

O workflow principal para o Conductor está em:

* `.github/workflows/ci-conductor.yml`

Ele roda em PRs e pushes para `main` quando arquivos relevantes mudam, e executa os gates do Conductor via scripts **da raiz**.

---

## Documentação Adicional

* [Contrato do Monorepo](docs/CONTRACT.md) — Princípios e regras operacionais
* [Smoke Test Report](SMOKE_TEST_RESULT.md) — Resultado da validação inicial
