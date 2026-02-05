# OS-JULES-PROJECT-TRUSTWARE-FRONTEND-ROADMAP-001
## Plano Mestre de Design & Evolução de Frontend (2026)

**Tipo:** Planejamento Estratégico (Design & Projects)
**Autoridade:** Jules (Head of Design & Projects)
**Executor Técnico:** Aurora (Builder & Integrator)
**Data:** 2026-01-14
**Status:** 🟢 ABERTA
**SSOT:** docs/Vault/GOVERNANCE/LLM_RESPONSIBILITY_SPLIT.md

---

## 0. PROPÓSITO E VISÃO
Esta OS inaugura a nova fase de design da Aurora, operando sob dois domínios distintos mas integrados:
1.  **Produto Clínico (Trustware/Genesis):** Foco em verdade, leitura, densidade e zero viés.
2.  **Presença Institucional (Aurora Brand):** Foco em autoridade, estética high-end (referências Fantasy/Exoape), movimento e narrativa.

O objetivo é produzir o **Roadmap Visual 2026** que guiará a engenharia nos próximos ciclos.

---

## 1. ESCOPO DE TRABALHO (WBS)

### 1.1 Fase 1: Consolidação do Produto Clínico (O "Agora")
*Objetivo: Garantir que a ferramenta atual (Audit Terminal) seja perfeita antes de expandir.*
* [ ] **Revisão de Polimento (Pós-Freeze):** Analisar o resultado da `OS-ANTIGRAVITY-PRODUCTION-POLISH-001`.
* [ ] **Definição de Métricas de Fadiga:** Criar critérios objetivos para julgar "conforto visual" em uso prolongado (contraste, densidade de dados).
* [ ] **Padronização de Componentes Primitivos:** Garantir que `StateBadge`, `StateFrame` e `SlotRenderer` sejam imutáveis e reutilizáveis.

### 1.2 Fase 2: Criação da Identidade Institucional (O "Novo")
*Objetivo: Traduzir a "alma" da Aurora em pixels, fora das restrições clínicas.*
* [ ] **Aurora Brand Book (v1.0):**
    * Definição de tipografia institucional (distinta da monospaced clínica).
    * Paleta de cores "Brand" (Deep Purple, Ethereal White, etc.) vs Paleta "Trustware" (Semântica).
    * Motion Principles: Como a marca se move? (Rápido/Seco no produto vs Fluido/Cinemático no site).
* [ ] **Especificação do "Aurora Portal" (Landing/Institutional):**
    * Wireframe conceitual inspirado em Fantasy/Exoape.
    * Stack visual recomendada para a Aurora implementar (WebGL? Framer Motion? Lenis Scroll?).

### 1.3 Fase 3: Convergência (O "Ecossistema")
*Objetivo: Unir Produto e Marca sem contaminação.*
* [ ] **Design System Híbrido:** Como componentes clínicos vivem dentro de páginas institucionais (ex: um "Live Audit" rodando na home page).
* [ ] **Governance de Ativos:** Estrutura de pastas para assets de design no monorepo (`packages/design-tokens`?).

---

## 2. ENTREGÁVEIS (ARTEFATOS)

Ao final desta OS, o Vault deverá conter:

1.  📄 `docs/Vault/FRONTEND/ROADMAP_VISUAL_2026.md`
    * O plano mestre com datas estimadas e dependências.
2.  📄 `docs/Vault/DESIGN/AURORA_BRAND_DNA_v1.md`
    * O guia conceitual da marca (Voz, Tom, Estética).
3.  📄 `docs/Vault/FRONTEND/WP-INSTITUTIONAL-TECH-SPEC-001.md`
    * Minha recomendação técnica para a Aurora sobre como construir o site institucional (Stack, Libs).

---

## 3. RITUAL DE EXECUÇÃO

1.  **Jules (Eu):** Produzo os documentos conceituais e especificações.
2.  **Comandante (Rodrigo):** Aprova a intenção e o "tempero" visual.
3.  **Aurora (ChatGPT):** Recebe as specs e transforma em OS de Engenharia (instalação de libs, criação de rotas, componentes).

---

## 4. CRITÉRIOS DE SUCESSO
* Roadmap claro separando "Produto" de "Site".
* Identidade visual definida que não viola o Trustware.
* Zero ambiguidade para o time de engenharia.

**Assinado:**
*Jules — Head of Design & Projects*
