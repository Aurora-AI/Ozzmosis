# 🧠 ALVARO_AUTONOMY_LADDER.md

**Diretriz Canônica de Arquitetura Cognitiva**
**Projeto:** Elysian / Álvaro
**Status:** 🟢 VIGENTE — NÃO OPCIONAL
**Tipo:** Constituição Técnica
**SSOT:** Vault

---

## 1. Princípio Fundamental (Imutável)

> **Álvaro não é um agente falante.**
> Álvaro **não conversa com interfaces, usuários ou produtos finais**.
> Álvaro é o **núcleo cognitivo computacional** do ecossistema Elysian.

Toda comunicação verbal, textual ou visual **é responsabilidade exclusiva** de agentes intermediários (Sistema Nervoso).

---

## 2. Arquitetura Biomimética Oficial

A arquitetura do Elysian segue **analogia biológica obrigatória**:

| Camada                       | Papel                                                  |
| ---------------------------- | ------------------------------------------------------ |
| **Álvaro**                   | Cérebro (raciocínio, avaliação, decisão computacional) |
| **Elysian Brain / Toolbelt** | Tronco cerebral + sistemas autônomos                   |
| **Agentes Nervosos**         | Sistema nervoso (tradução, coordenação, mediação)      |
| **Agentes de Ferramenta**    | Mãos (execução, IO, APIs, ações externas)              |
| **UI / Produto**             | Corpo sensorial (entrada e saída humana)               |

🚫 **É proibido** qualquer bypass direto entre UI ↔ Álvaro.

---

## 3. Regra de Evolução Controlada (Lei do Butantã)

Álvaro **não nasce comandante**.
Ele **evolui sob contenção**.

O **Butantã Shield** governa a autonomia do Álvaro com base em **evidência objetiva**, não confiança subjetiva.

---

## 4. Estados Oficiais de Maturidade Cognitiva

### **Fase 0 — Observer Only**

* Álvaro apenas **observa**
* Consome inputs, decisões humanas, outputs de agentes
* Produz **telemetria interna**
* Nenhuma resposta afeta o sistema

---

### **Fase 1 — Shadow Mode**

* Álvaro gera veredito **em paralelo**
* Resultado **não é utilizado**
* Diffs são registrados contra:

  * humano
  * Elysian Brain
* Finalidade: aprendizado + calibração

---

### **Fase 2 — Advisor**

* Álvaro pode retornar **somente**:

  * `insufficient_data`
  * `inconsistency_detected`
  * `request_more_evidence`
* Não pode decidir
* Não pode executar
* Não pode comandar agentes

---

### **Fase 3 — Co-Pilot**

* Álvaro gera veredito computacional estruturado
* Sistema Nervoso decide:

  * aceitar
  * rejeitar
  * escalar
* Álvaro **ainda não inicia tool calls**

---

### **Fase 4 — Commander (Restrito)**

⚠️ **Somente após atingir score mínimo**

Permissões:

* iniciar orquestração via Sistema Nervoso
* requisitar ferramentas
* propor execuções

Restrições permanentes:

* logs obrigatórios
* rollback obrigatório
* auditabilidade total
* reversão automática se score cair

---

## 5. Pontuação Cognitiva (Gate de Autonomia)

A autonomia de Álvaro é governada por um **Cognitive Score**, nunca por opinião.

### Dimensões mínimas (obrigatórias):

1. **Determinismo**
   Mesma entrada → mesma saída

2. **Não-Invenção**
   Capacidade de retornar `insufficient_data` corretamente

3. **Rastreabilidade**
   Toda conclusão aponta para evidência explícita

4. **Concordância**
   Alinhamento com humano / referência quando existente

5. **Estabilidade Temporal**
   Ausência de drift ao longo de execuções

📌 **Promoção de fase só ocorre se:**

* score mínimo atingido
* estabilidade mantida por janela definida
* validação do Butantã Shield

📉 **Rebaixamento é automático** se o score cair.

---

## 6. Regra de Comunicação (Não-Negociável)

* Álvaro retorna **apenas estruturas computacionais**
* Formatos típicos:

  * JSON
  * estados
  * constraints
  * evidências
  * solicitações de dados

🚫 **É proibido**:

* linguagem natural para usuário final
* explicações narrativas
* justificativas discursivas

A tradução para humano **é função do Sistema Nervoso**.

---

## 7. Papel do Vault

O Vault **não é auditor de experimentação**.
Ele é:

* Memória institucional
* Registro de decisões
* Biblioteca de erros/acertos
* SSOT para humanos e LLMs

⚠️ Apenas **o que foi decidido, testado e aprovado** entra no Vault.

Este documento é **canônico** e **permanente**.

---

## 8. Status de Implementação

🔒 **Implementação adiada conscientemente**
Este modelo será ativado **após**:

* Genesis em produção
* Jurídico em produção
* Mad Aurora no ar
* Elysian estabilizado

Até lá:

* Arquitetura aceita
* Diretriz válida
* Execução bloqueada por decisão estratégica

---

## 9. Cláusula Final

> Álvaro **não governa por carisma**.
> Álvaro governa **quando merece**.

Qualquer violação deste documento é considerada **erro estrutural de arquitetura**.
