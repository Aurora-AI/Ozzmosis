# ✅ ALVARO_CONFORMANCE_CHECKLIST.md

**Verificação Obrigatória de Conformidade**
**Projeto:** Elysian / Álvaro
**Status:** 🟢 VIGENTE — EXECUTAR EM TODO PR
**Tipo:** Gate de Qualidade Arquitetônica
**SSOT:** Vault

---

## 0. Propósito

Este documento é uma **checklist técnica obrigatória** para todo Pull Request que toque em:

- Álvaro (backend cognitivo)
- Elysian Brain / Toolbelt
- Agentes Nervosos
- Orquestração de autonomia

Objetivo: **prevenir violação de ALVARO_AUTONOMY_LADDER.md**.

---

## 1. Checklist de Arquitetura

- [ ] **Fase Cognitiva Correta**
  
  - Valida se o código está na fase de maturidade aprovada?
  - Se toca comando/execução: já passou por Cognitive Score gate?
  - Se é novo: começa em Fase 0 (Observer Only)?
  
- [ ] **Sem Bypass UI → Álvaro**
  
  - Código não expõe Álvaro diretamente para frontend?
  - Toda comunicação user-facing passa por Sistema Nervoso?
  - Validar: nenhum endpoint em Álvaro responde com linguagem natural?

- [ ] **Comunicação Estruturada**
  
  - Outputs de Álvaro são sempre JSON/estruturados?
  - Nenhuma explicação narrativa/discursiva?
  - Campos canônicos presentes: `ok`, `error_code`, `data`?

- [ ] **Rastreabilidade de Decisão**
  
  - Toda conclusão de Álvaro aponta para evidência explícita?
  - Logs contêm referência a inputs + reasoning path?
  - Ausência de "caixa preta"?

- [ ] **Determinismo**
  
  - Mesma entrada sempre retorna mesma saída?
  - Validar: não há RNG sem seed explícito?
  - Ausência de race conditions / timing-dependent logic?

- [ ] **Capacidade de Recusa**
  
  - Álvaro pode retornar `insufficient_data` corretamente?
  - Código não inventa dados quando incerto?
  - Existe fallback explícito para casos ambíguos?

---

## 2. Checklist de Teste

- [ ] **Teste de Fase**
  
  - Se Fase > 1: há teste de regressão Shadow Mode?
  - Se Fase > 2: há teste de Advisor (only `insufficient_data`, etc)?
  - Se Fase > 3: há teste de Co-Pilot + Sistema Nervoso?

- [ ] **Teste de Determinismo**
  
  - Mesma entrada 10x → mesma saída 10x?
  - Validar com diferentes seeds aleatórias (se houver)?

- [ ] **Teste de Rastreabilidade**
  
  - Output contém breadcrumb de decisão?
  - Logs são estruturados (JSON, não free text)?

- [ ] **Teste de Recusa**
  
  - `insufficient_data` quando dados faltam?
  - `inconsistency_detected` quando há conflito?
  - Não há silenciar de erros / 200 fake OK?

- [ ] **Score Cognitivo**
  
  - Se Fase > 0: score antes / depois do PR?
  - Score subiu, manteve-se ou caiu?
  - Se caiu: rebase foi feito? ou escrito justificativa?

---

## 3. Checklist de Segurança

- [ ] **Sem Privilégio Elevado por Default**
  
  - Tool calls só via Sistema Nervoso?
  - Sem `execute_immediately` flag?
  - Sem bypass de gates?

- [ ] **Log de Auditoria**
  
  - Toda ação potencialmente destrutiva é registrada?
  - PII não é logada?
  - Timestamp + usuario + reasoning presentes?

- [ ] **Rollback Automático**
  
  - Se Fase 4: há mechanism para reverter se score cair?
  - Validar: degradação não quebra sistema?

---

## 4. Checklist de Conformidade com ALVARO_AUTONOMY_LADDER.md

- [ ] **Princípio Fundamental**
  
  - Álvaro não conversa com UI?
  - UI conversa com Sistema Nervoso (intermediário)?

- [ ] **Biomimética**
  
  - Camadas respeitam analogia cérebro/tronco/nervos/mãos/corpo?
  - Nenhum bypass direto entre camadas?

- [ ] **Lei do Butantã**
  
  - Evolução é via Butantã Shield (gate objetivo)?
  - Não há "vou confiar que fica bom"?

- [ ] **Estados de Maturidade**
  
  - Código respeita uma das 5 fases?
  - Transição entre fases é explícita / auditável?

- [ ] **Cognitive Score**
  
  - Se promoveu de fase: score calculado?
  - Dimensões (determinismo, não-invenção, rastreabilidade, concordância, estabilidade) medidas?

- [ ] **Regra de Comunicação**
  
  - Saída é estruturada, não narrativa?
  - Sem justificativas discursivas?

---

## 5. Checklist de Documentação

- [ ] **PLAN.md Atualizado**
  
  - Se fase nova: PLAN documenta transição?
  - Cognitive Score justificado?

- [ ] **README / Docstring**
  
  - Fase atual documentada?
  - Restrições conhecidas listadas?
  - Próxima fase planejada?

- [ ] **Vault Reference**
  
  - Se novo padrão: foi adicionado ao Vault?
  - Se violação conhecida: foi documentada como lição?

---

## 6. Critério de Aceite (PR Pass)

### ✅ PASS Completo
Todas as seções 1-5 acima têm ✅ e:
- Score não caiu (ou queda justificada)
- Testes passam
- Documentação sincronizada
- Vault atualizado (se necessário)

### ⚠️ PASS Condicional
Seções 1-5 com algum ⚠️ BUT:
- Queda conhecida foi escrita em justificativa
- Score mantém-se acima do mínimo da fase
- Próximo PR ou Sprint tem plano de recuperação
- Aprovação explícita do Architect/Tech Lead

### ❌ FAIL
Qualquer um dos seguintes:
- Bypass de UI → Álvaro sem intermediário
- Fase atual não respeita restrictions (ex: Fase 2 executando commands)
- Score caiu abaixo do mínimo sem justificativa
- Ausência de teste de determinismo/recusa
- Sem Cognitive Score calculado (se fase > 0)
- Output não é estruturado
- Violação de Lei do Butantã (confiança subjetiva em vez de gate objetivo)

---

## 7. Processo de Verificação

### Para Reviewer (humano)

1. Baixar a branch
2. Rodar: `npm run build:conductor && npm run test:conductor`
3. Executar questa checklist (marcar cada item)
4. Calcular Cognitive Score (se Fase > 0)
5. Validar PLAN.md + Vault refs
6. Aprovar se PASS ou PASS Condicional (com comentário)
7. Pedir mudanças se FAIL

### Para CI/CD (futuro)

```bash
# Detecta PR que toca Álvaro/Elysian
npm run audit:alvaro-conformance -- --pr=$GITHUB_PR_NUMBER

# Retorna:
# - PASS: permite merge
# - CONDITIONAL: requer manual override
# - FAIL: bloqueia merge
```

---

## 8. Template para Comentário em PR

```markdown
## Conformance Check

- [ ] Architecture phase validated
- [ ] No UI→Álvaro bypass
- [ ] Communication is structured
- [ ] Traceability present
- [ ] Determinism verified
- [ ] Refusal capability tested
- [ ] Cognitive Score: [BEFORE] → [AFTER]
- [ ] Documentation updated
- [ ] Vault references added

**Result:** [PASS / CONDITIONAL / FAIL]

**Notes:** ...
```

---

## 9. Histórico de Aplicação

(Preenchido após cada PR significativo)

| PR | Data | Resultado | Notas |
| -- | ---- | --------- | ----- |

---

## 10. Cláusula Final

> Esta checklist **não é sugestiva**.
> Ela é **obrigatória**.

Qualquer PR que toque Álvaro/Elysian sem passar por esta checklist é automaticamente **BLOCKED** até conformidade ser atingida.

Vault Link: [ALVARO_AUTONOMY_LADDER.md](ALVARO_AUTONOMY_LADDER.md)
