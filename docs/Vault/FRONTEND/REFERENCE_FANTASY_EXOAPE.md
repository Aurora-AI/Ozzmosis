# REFERENCE_FANTASY_EXOAPE.md

## Referência Técnica — Fantasy / Exo Ape (DevTools-Based)

**Projeto:** Aurora / Ozzmosis / Genesis
**Status:** 🟢 VIGENTE
**Natureza:** Referência Técnica (SSOT)
**Uso:** Webpage institucional Aurora / Elysian e produtos editoriais

---

## 1. Origem da Referência

Esta referência foi construída a partir de:

- inspeção direta via DevTools (DOM, CSS, runtime)
- análise de comportamento de layout, motion e tipografia
- observação de disciplina estrutural (não estética)

Ela **não representa adoção de stack**, framework ou ferramenta externa.
Ela representa **extração de princípios replicáveis**.

---

## 2. Achados Técnicos Objetivos

### 2.1 Estrutura Geral

- SPA/SSR moderno com comportamento cinematográfico
- DOM legível, hierárquico e previsível
- Containers claros e recorrentes
- Ausência de “framework noise” visível

**Conclusão:** impacto vem de disciplina estrutural, não de complexidade técnica.

---

### 2.2 Seções como Unidades Narrativas

- Página organizada como sequência de “cenas”
- Cada seção funciona como unidade semântica completa
- Pouca tipografia, hierarquia clara, foco em narrativa visual

**Conclusão:** seção é a unidade fundamental, não página nem componente atômico.

---

### 2.3 Motion como Camada

- Estrutura HTML/CSS é válida sem motion
- Motion aplicado como camada adicional
- Uso recorrente de padrões (fade, translate, scale)
- Timing e inércia são mais importantes que efeitos

**Conclusão:** motion é sistema, não adorno.

---

### 2.4 Tipografia

- Poucas famílias
- Ritmo consistente
- Variação via escala, peso e espaçamento
- Nenhuma tipografia “experimental” por seção

**Conclusão:** tipografia é gramática, não decoração.

---

### 2.5 Mídia

- Vídeo/imagem como camada de fundo
- Conteúdo textual e CTA desacoplados da mídia
- Mídia nunca “empurra” layout
- Hero tratado como “cena”, não header

**Conclusão:** mídia é infraestrutura narrativa, não efeito.

---

## 3. Tradução Direta para Aurora / Elysian

### 3.1 Webpage como Sequência de Cenas

A webpage institucional Aurora/Elysian deve ser composta por:

- SceneHero
- SceneProof
- SceneProduct
- SceneMechanics
- SceneCTA

Cada Scene é:

- uma seção semântica
- uma unidade narrativa
- uma composição governada por tokens e motion primitives

---

### 3.2 Header e Navegação

- Header mínimo (logo + menu)
- Menu como affordance, não como barra de navegação carregada
- Nenhuma distração persistente

---

### 3.3 Output Legível

O HTML/CSS gerado deve ser:

- inspecionável
- compreensível por terceiros
- auditável em DevTools

**Legibilidade do output é critério de qualidade.**

---

## 4. Compatibilidade com Canon / Skin / God Mode

- Canon permanece intacto (Absolute White, Black Piano, regra 3%)
- Para webpages institucionais, usar `skin_aurora_web`
- Qualquer variação fora do Canon deve ocorrer via God Mode
- Experimentos seguem SPC ≥ 8.0

---

## 5. Regra Final

Esta referência **não autoriza exceções estruturais**.
Ela existe para **confirmar decisões já corretas** e orientar implementação disciplinada.

---
