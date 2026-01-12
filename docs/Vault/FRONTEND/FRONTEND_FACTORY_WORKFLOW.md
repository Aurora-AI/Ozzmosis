# FRONTEND_FACTORY_WORKFLOW.md

## Workflow Canônico de Criação de Frontend (Produto-Ready)

**Projeto:** Aurora / Ozzmosis / Genesis
**Status:** 🟢 VIGENTE
**Natureza:** Operacional + Produto
**Escopo:** Frontend-only (Backend inalterado)

---

## 0. Intenção do Workflow

Este workflow não é “processo interno”.
Ele é a base de um produto futuro (WIX-like), onde terceiros criarão sites/apps e usarão o motor inteligente Aurora no backend.

Portanto, o workflow deve ser:

- formalizável (schemas)
- replicável (templates)
- auditável (artifacts)
- governável (Canon/Skin/God Mode)
- cognitivo-first (biomimética)

---

## 1. Fase 0 — Intake Canônico (Contrato de Tela)

**Entregável:** Brief declarativo (não “gosto”)

Campos mínimos:

- objetivo (1 frase)
- público-alvo
- domínio cognitivo: `juridico | seguros | wealth | ...`
- emoção-alvo: `autoridade | confiança | calma | urgência | ...`
- ação principal (CTA)
- estados mínimos: happy / empty / error
- restrições: acessibilidade, performance, tokens-only

**Regra:** sem Intake canônico, não há execução.

---

## 2. Fase 1 — Referência (Board como decisão, não inspiração)

**Entregável:** referência controlada (6–12 itens)

- o que copiar (padrão)
- o que evitar
- evidência de hierarquia, densidade, ritmo

**Regra:** referência vira regra ou é descartada.

---

## 3. Fase 2 — Gramática Visual (SSOT)

A gramática visual é o conjunto de:

- tokens
- tipografia (presets)
- motion primitives
- componentes canônicos
- seções semânticas

**Regra:** gramática é fonte de verdade; páginas são composição.

---

## 4. Fase 3 — Component Registry (componentes > páginas)

Componentes canônicos devem existir com:

- variantes limitadas
- estados (loading/empty/error)
- acessibilidade
- alinhamento com tokens

**Regra:** não criar componentes ad-hoc por página.

---

## 5. Fase 4 — Seções Semânticas (blocos de intenção)

Criar/usar seções nomeadas por propósito (não por layout):

- ValuePropositionSection
- SocialProofSection
- CallToActionSection
- FAQSection
- etc.

**Regra:** o sistema monta páginas por composição de seções.

---

## 6. Fase 5 — Templates (Landing / App Shell / Dashboard)

Templates são programas de layout, compostos apenas por:

- seções semânticas
- componentes canônicos
- tokens

**Proibição:** template com hardcode visual.

---

## 7. Fase 6 — Domain Skins (fisiologia por domínio)

Se o domínio exigir variação:

- criar/usar `Domain Skin` (jurídico vs seguros)
- variações apenas dentro de limites do Canon

---

## 8. Fase 7 — God Mode (experimento governado)

Quando necessário experimentar:

- criar experimento com ID, hipótese, expiração
- aplicar SPC (pontuação 0–10 em 5 dimensões)
- registrar artifacts
- **nota mínima 8.0** para elegibilidade

Sem pontuação >= 8.0: não promove.

---

## 9. Fase 8 — Gates e Evidências

Antes de considerar “pronto”:

- confirmar tokens-only
- confirmar acessibilidade mínima
- gerar artifacts
- registrar mudanças via OS/WP/commit
- fechar no Vault

---

## 10. Fase 9 — Vault Close (sempre)

Nenhum trabalho é “real” sem:

- registro no Vault
- evidência
- rastreabilidade por commit

> **Se não está no Vault, não existe.**

---
