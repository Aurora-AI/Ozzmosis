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
- É proibido manter lockfiles concorrentes em `libs/*` ou `apps/*` como contrato principal.

**Rationale:** Lockfiles locais criam divergências de versão entre ambiente local e CI, causando "funciona na minha máquina". O contrato único garante reprodutibilidade.

### 2) Workspaces

- O repositório usa `npm workspaces`.
- Bibliotecas em `libs/*` e aplicações em `apps/*`.

**Estrutura:**
```
libs/
  aurora-conductor/    # Governança e integridade
  elysian-brain/       # Inteligência
  trustware/           # Segurança e policy enforcement

apps/
  alvaro-core/         # Identidade
  mycelium-front/      # Pedagogia
  butantan-shield/     # Imunidade
  aurora-vision/       # Observabilidade
```

### 3) Scripts canônicos

Scripts oficiais devem existir na raiz:
- `build:conductor` — Compila TypeScript do aurora-conductor
- `typecheck:conductor` — Valida tipos sem emitir código
- `lint:conductor` — ESLint validation
- `smoke:conductor` — Teste funcional da API pública

**Expansão futura:** À medida que outros pacotes forem formalizados, adicionar scripts correspondentes (`build:brain`, `smoke:alvaro`, etc.).

### 4) CI obrigatório

- PRs que alteram `libs/aurora-conductor/**` ou tooling raiz devem disparar CI.
- CI deve executar:
  - install (`npm ci`)
  - build / typecheck / lint / smoke do Conductor

**Gate de qualidade:** Merge bloqueado se CI falhar.

## Critério de aceite (DoD)

Para qualquer mudança no repositório:

- [ ] `npm ci` na raiz passa em ambiente limpo
- [ ] CI verde (todas as etapas)
- [ ] Smoke funcional do Conductor passa (se relevante)
- [ ] PR tem descrição clara de motivação e validação
- [ ] Sem lockfiles concorrentes commitados

## Exceções e casos especiais

### Apps legados (pré-formalização)

Apps como `mycelium-front` ainda podem ter configurações locais (lockfile, config específico) durante período de transição. O contrato exige que:

1. Seja documentado explicitamente como "legacy/em transição"
2. Tenha plano de migração para o contrato canônico
3. Não interfira com CI de componentes formalizados (ex: conductor)

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
