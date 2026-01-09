# Contrato do Monorepo (Ozzmosis = Aurora/Elysian 2.0)

Este documento define o **contrato operacional** do repositório. A intenção é reduzir retrabalho e impedir regressões estruturais.

## Decisão

Ozzmosis é o **monorepo Node oficial e canônico** da Aurora/Elysian 2.0.

## Princípios

1. **Reprodutibilidade:** qualquer pessoa/clonagem limpa deve reproduzir builds e testes.
2. **Auditabilidade:** mudanças devem ser rastreáveis e validadas por CI.
3. **Qualidade como gate:** CI vermelho bloqueia merge.

## Regras

### 1) Instalação e lockfile

- `npm ci` roda na **raiz**.
- Existe **apenas um lockfile canônico**: `package-lock.json` na raiz.
- É proibido manter lockfiles concorrentes em `libs/*`, `apps/*` ou `packages/*`.
- `npm ci` só é possível com `package-lock.json` presente; nunca remova o lockfile canônico como “correção”.
- `install:clean` existe apenas para correção local (locks/ambiente corrompido) e nunca substitui CI (que roda `npm ci`).
- Arquivos proibidos no repo (tracked ou untracked): `npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml` e `.npmrc`.

**Rationale:** Lockfiles locais criam divergências de versão entre ambiente local e CI, causando "funciona na minha máquina". O contrato único garante reprodutibilidade.

### 2) Workspaces

- O repositório usa `npm workspaces`.
- Bibliotecas em `libs/*`, aplicações em `apps/*` e tooling em `packages/*`.

**Estrutura:**
```
libs/
  aurora-conductor/    # Governança e integridade
  aurora-chronos/      # Pilar (tempo operacional) em desenvolvimento

apps/
  alvaro-core/         # Identidade
  mycelium-front/      # Pedagogia

packages/
  tooling/             # Repo contract checks
  tsconfig/            # Base TS compartilhada
```

Contratos (refs):
- Butantan Shield: apps/butantan-shield/docs/CONTRACT.md

### 3) Scripts canônicos

Scripts oficiais devem existir na raiz:
- `build:conductor` — Compila TypeScript do aurora-conductor
- `typecheck:conductor` — Valida tipos sem emitir código
- `lint:conductor` — ESLint validation
- `smoke:conductor` — Teste funcional da API pública
- `survival:conductor` — Survival tests (invariantes hostis)
- `repo:check` — Verifica contrato do repo (canônicos + proibições)
- `repo:clean` — Exige working tree limpo (rodar após gates)
- `install:clean` — Reinstalação canônica (remove `node_modules` e executa `npm ci`)

**Chronos (menção):** podem existir scripts como `chronos:build` e `chronos:smoke`, mas a evolução do Chronos deve ocorrer em OS própria.

**Expansão futura:** À medida que outros pacotes forem formalizados, adicionar scripts correspondentes (`build:brain`, `smoke:alvaro`, etc.).

### 4) CI obrigatório

- PRs que alteram `libs/aurora-conductor/**` ou tooling raiz devem disparar CI.
- CI deve executar:
  - install (`npm ci`)
  - build / typecheck / lint / smoke do Conductor
  - repo contract check + repo cleanliness

**Gate de qualidade:** Merge bloqueado se CI falhar.

## Critério de aceite (DoD)

Para qualquer mudança no repositório:

- [ ] `npm ci` na raiz passa em ambiente limpo
- [ ] CI verde (todas as etapas)
- [ ] Smoke funcional do Conductor passa (se relevante)
- [ ] Repo contract check passa (`npm run repo:check`)
- [ ] PR tem descrição clara de motivação e validação
- [ ] Sem lockfiles concorrentes commitados

## Exceções e casos especiais

### Workspaces externos ou forks temporários

Se houver necessidade de workspace fora do padrão `libs/*` ou `apps/*`, deve:

1. Ser documentado em ADR (Architecture Decision Record)
2. Ter justificativa técnica clara
3. Ter data de expiração ou critério de remoção

## Governança do contrato

Este contrato é **vivo** e pode ser alterado via PR. Mudanças devem:

1. Ter motivação explícita
2. Atualizar este documento
3. Atualizar README.md se impactar desenvolvimento diário
4. Passar por revisão de pelo menos um maintainer

---

**Versão:** 1.0  
**Data:** 2025-12-27  
**Próxima revisão:** Quando houver formalização de novo pacote (brain, alvaro, etc.)
