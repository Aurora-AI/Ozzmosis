# WP4 — Trustware Interface / Verdade Bruta
## Cânone de Engenharia de Confiança Determinística (Board Breaker)

**Projeto:** Aurora / Genesis (Rodobens Wealth)  
**Status:** 🟢 VIGENTE  
**Versão:** 1.1 (Board Breaker Edition — Trustware-compliant)  
**Regra-mãe:** A Verdade é o Estímulo Orientador. A Omissão é Ruído.

---

## 1. Filosofia: Verdade Orientadora (não punitiva)
No Oceano Vermelho, a complexidade é usada para esconder custo e reduzir comparabilidade.
No ecossistema Aurora, a **Verdade Bruta com contexto** é prova de superioridade.

Nós não “facilitamos a venda”.  
Nós **governamos a decisão** para impedir erros caros e aumentar confiança.

**Princípio Mycelium:** Verdade sem contexto vira ruído e culpa.  
Logo, toda verdade exibida deve vir com contexto mínimo.

---

## 2. Módulos Obrigatórios de Interface (Trustware Layer)

> Esta OS define módulos canônicos. Implementação (UI/código) ocorre em WPs posteriores.

### 2.1 Suitability Alpha (Gate de Integridade)
- **Função:** atuar como segurança cognitivo no fluxo de escolha de produto.
- **Lógica:** stress test do perfil do cliente vs. requisitos do plano escolhido (ex.: Plano Pontual).
- **Vínculo Toolbelt:** `toolbelt/tools/finance.py` (capacidade de aporte, reserva, stress de liquidez).
- **Política (sem hardcode):**
  - O bloqueio/permitir deve ser governado por *policy* no Vault (threshold e critérios).
- **Regra de Aceite:**
  - O sistema **deve impedir avanço** quando a policy indicar “risco inaceitável”.
  - Deve oferecer **redirecionamento ético**: plano alternativo compatível com o perfil.

### 2.2 TCO Mirror (Espelho de Custo Total)
- **Função:** revelar custo total real e comparar com alternativas de mercado (CET).
- **Lógica:** calcular e exibir TCO (antes/durante/depois), incluindo pós-contemplação.
- **Vínculo Toolbelt:** `toolbelt/tools/calculator.py` (SAC/PRICE, CET, custo total vs taxa adm).
- **Regra de Aceite:**
  - Deve incluir obrigatoriamente: ITBI, Escritura, Registro (quando aplicável) e custos de posse.
  - Deve explicitar janela e premissas (pirâmide de contexto).

### 2.3 Index Projection (Projeção de Reajuste Real)
- **Função:** eliminar surpresa do reajuste anual.
- **Lógica:** gerar projeções sob 3 cenários determinísticos:
  - Otimista / Neutro / Crítico
  - parâmetros fixos (janela histórica declarada e média/percentis definidos)
- **Vínculo Toolbelt:** `toolbelt/tools/finance.py` (índices) + parâmetros determinísticos (sem aleatoriedade não auditável).
- **Regra de Aceite (anti-promessa):**
  - Exibir explicitamente: “Projeção por cenários — não é garantia.”
  - Alinhar com a policy existente **DATE_GUARANTEE_PROHIBITED** (proibição de promessa de data/entrega).

### 2.4 Contract Truth Panel (Tradução Determinística)
- **Função:** eliminar caixa preta jurídica dos contratos padrão.
- **Lógica:** overlay de linguagem convencional sobre documento original, com prova de origem.
- **Vínculo Toolbelt:** `toolbelt/pdf2md/` + dicionário canônico `reference.py` (cláusula → tradução).
- **Regra de Aceite:**
  - Cada cláusula traduzida deve apontar: Oportunidade, Vantagem, Dever, Ônus.
  - Se não houver tradução validada: marcar como **“Análise Manual Pendente”** (sem inventar).

---

## 3. Critérios de Aceite Não Negociáveis (Gates de PR futuros)

1. **Zero Hardcoding Financeiro**
   - Nenhuma taxa/juros/custo deve estar fixo no frontend.
   - Tudo deve vir de Toolbelt + policy + evidência.

2. **Visibilidade do “Day After”**
   - Nenhuma simulação de casa/carro é válida sem custos pós-contemplação (quando aplicável).

3. **Contraste de Decisão (Tokens-only)**
   - Pontos de ônus crítico devem ser destacados com token semântico de risco (ex.: `danger`).
   - Proibido hardcode `#FF0000`. Usar tokens e respeitar a regra de baixa presença (~3%).

4. **Pirâmide de Contexto**
   - Todo número precisa carregar: janela temporal, critério de cálculo, finalidade pedagógica.

---

## 4. Conexão com o Ecossistema
Este documento substitui versões simplistas do WP4.
A Aurora Real deixa de ser vitrine e torna-se um **Terminal de Auditoria Patrimonial**.

> “Não entramos para jogar. Entramos para redefinir as regras através da verdade lógica e auditável.”
