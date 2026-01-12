# FRONTEND_GOVERNANCE.md

## Governança Canônica do Frontend (SSOT)

**Projeto:** Aurora / Ozzmosis / Genesis
**Status:** 🟢 VIGENTE
**Natureza:** Constitucional (Produto & Plataforma)
**Escopo:** Frontend-only (Backend permanece como está)

---

## 0. Regra-Mãe (SSOT)

> **Se não está no Vault, não existe.**

Implicações:

- Decisão sem registro no Vault é **não-decisión**.
- Padrão sem documento canônico é **não-padrão**.
- “Acordo de time” sem SSOT é **ruído**.
- Qualquer agente (humano ou IA) deve operar assumindo que **apenas o Vault é verdadeiro**.

---

## 1. Objetivo da Governança

Garantir que qualquer frontend (site, landing page, app ou plataforma) seja:

- **replicável**
- **auditável**
- **governável**
- **biomimético (cognição-first)**
- **produto-ready** (capaz de evoluir para uma ferramenta WIX-like, com motor inteligente no backend)

---

## 2. Princípios Não Negociáveis

1. **Product-First**: cada artefato nasce com potencial de produto e reutilização.
2. **Production-First**: nada “temporário”; tudo deve suportar produção amanhã.
3. **Zero Sicofagia**: estética não substitui verdade, clareza e governança.
4. **Tokens como SSOT visual**: nenhum hardcode visual fora dos tokens.
5. **Componentes > Páginas**: páginas são composição, não origem do design.
6. **Auditabilidade**: mudanças devem ser rastreáveis por OS/WP/commit.
7. **Canon é DNA**: Canon não muda por “preferência”; muda por protocolo.
8. **Experimentação é governada**: God Mode existe, mas não é default.

---

## 3. Arquitetura de Produto (Frontend como Plataforma)

O frontend é concebido como **compilador de intenção**:

- Entrada: intenção declarativa (brief, domínio cognitivo, objetivo)
- Gramática: tokens + componentes + seções semânticas
- Saída: UI renderizada (Next/React) desacoplada da lógica decisória

O backend (motor inteligente) é responsável por:

- inferência e decisão
- orquestração e validação
- políticas e governança
- adaptação para sites de terceiros (via adaptadores)

O frontend é responsável por:

- renderização e composição
- experiência cognitiva e interação
- evidência e rastreabilidade de output
- execução de “gramática visual” sob tokens

---

## 4. Camadas Estruturais (Obrigatórias)

### 4.1 Canon (DNA)

Imutável por padrão.
Contém:

- tokens base
- tipografia base
- motion primitives base
- regras de contraste e acessibilidade
- decisões visuais estruturais (Genesis)

### 4.2 Domain Skins (Fisiologia por domínio)

Variações permitidas por domínio cognitivo (ex.: jurídico, seguros, wealth) sem violar Canon:

- tokens semânticos (acentos, superfícies, densidade)
- presets de ritmo tipográfico
- intensidade de motion dentro de limites

### 4.3 God Mode (Laboratório)

Experimentação controlada, auditável e reversível.

- nunca é default
- nunca altera Canon diretamente
- sempre gera artifacts e pontuação
- só promove mudanças via OS

---

## 5. Regras de Mudança (Change Control)

### 5.1 Tudo muda via OS

Qualquer alteração estrutural no frontend deve ser registrada via OS, contendo:

- objetivo
- escopo e exclusões
- WPs (um WP = um commit)
- arquivos completos
- evidências (artifacts)
- fechamento no Vault

### 5.2 Um WP = um commit

- Nenhuma mistura de WPs em um commit.
- Cada commit deve poder ser revertido sem quebrar o sistema.

### 5.3 “Hardcode visual” é proibido

Proibido:

- `#hex` solto
- `rgb()` solto
- `font-size` arbitrário
- `spacing` arbitrário
- motion sem tokens

Permitido:

- valores referenciando tokens canônicos.

---

## 6. Gates e Evidências

A governança exige evidências mínimas por mudança:

- lista de arquivos alterados (`git diff --cached --name-only`)
- artifacts quando aplicável (prints controlados, logs, checklists)
- registro no Vault (SSOT)

Sem evidência: mudança inválida.

---

## 7. Anti-Frankenstein Rules

Proibições globais:

- “Copiar e colar” UI sem integrar na gramática (tokens/componentes)
- criar variantes ad-hoc por página
- permitir que domínio altere Canon sem protocolo
- deixar experimentos sem expiração
- publicar UI sem avaliação cognitiva mínima (quando originada de God Mode)

---

## 8. Autoridade do Documento

Este arquivo define a **governança canônica do frontend**.
Qualquer divergência fora do Vault é inválida.

---

**Mantra:**

> **Experimentar é obrigatório. Aprovar é difícil. Produção é privilégio.**
