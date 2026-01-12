# FRONTEND_FACTORY_CANON_RULES.md

## Regras Canônicas Derivadas — Frontend Factory

**Projeto:** Aurora / Ozzmosis / Genesis
**Status:** 🟢 VIGENTE
**Natureza:** Constitucional (Workflow & Plataforma)

---

## 1. Regra 1 — Output Legível é Qualidade

Todo frontend gerado pelo sistema deve produzir:

- DOM legível
- hierarquia clara
- nomes semânticos
- ausência de abstrações opacas

**Se o output não é compreensível no DevTools, o motor falhou.**

---

## 2. Regra 2 — Seção é Unidade Fundamental

- Páginas são composição
- Seções são unidades narrativas
- Componentes são internos às seções

É proibido:

- construir páginas “soltas”
- montar layout direto com componentes atômicos
- ignorar seções semânticas

---

## 3. Regra 3 — Estrutura Independe de Motion

Toda interface deve:

- funcionar cognitivamente sem animação
- comunicar hierarquia sem motion

Motion:

- entra como camada
- segue primitives canônicos
- nunca define estrutura

---

## 4. Regra 4 — Motion é Sistema

Motion deve ser:

- padronizado
- previsível
- limitado
- governado por tokens

É proibido:

- animação única por elemento
- curva/duração “criativa”
- motion inline sem primitiva

---

## 5. Regra 5 — Mídia é Camada

Vídeos e imagens:

- nunca definem layout
- nunca empurram conteúdo
- sempre têm fallback
- são tratadas como background narrativo

---

## 6. Regra 6 — Tipografia é Gramática

- poucas famílias
- escalas definidas
- ritmo consistente
- variação governada

É proibido:

- inventar tipografia por seção
- quebrar ritmo por “expressividade”

---

## 7. Regra 7 — Webpages Institucionais são Editorais

Sites institucionais Aurora/Elysian:

- não são SaaS pages
- não são catálogos
- são narrativas guiadas por cenas

Header mínimo.
Conteúdo central.
CTA único e claro.

---

## 8. Regra 8 — God Mode Continua Obrigatório

Qualquer variação significativa:

- entra via God Mode
- tem hipótese
- tem SPC
- só promove com nota ≥ 8.0

---

## 9. Autoridade

Estas regras passam a integrar o **Canon do Frontend Factory**.
Qualquer violação é inválida até ser formalizada via OS e registrada no Vault.

---
