# DECISÃO: LLM LOCAL GEMINI 2.0 FLASH EXPERIMENTAL

**Status:** Canonical Decision  
**Category:** Architecture > AI Integration  
**Date:** 2026-01-12  
**Decision Maker:** Comandante (human authority)  
**Version:** 1.0  

---

## I. CONTEXTO

Aurora utiliza LLMs para planejamento técnico (Aurora LLM role) em processos de OS → PLAN → EXECUTE → CLOSE.

Anteriormente, não havia decisão documentada sobre qual LLM usar para inferência local (sem internet).

---

## II. DECISÃO

**Escolha:** Gemini 2.0 Flash Experimental (via API local)

**Razões:**

1. **Performance:** Flash tem latência < 200ms para prompts curtos
2. **Contexto:** Suporta até 1M tokens de contexto (necessário para repos grandes)
3. **Custo:** Modo experimental sem cobrança (fase de validação)
4. **Estabilidade:** Versão Flash mais estável que modelos experimentais completos
5. **Integração:** API compatível com Google AI Studio (fallback em cloud se necessário)

---

## III. ALTERNATIVAS CONSIDERADAS

| LLM | Prós | Contras | Decisão |
|-----|------|---------|---------|
| **Gemini 2.0 Flash Experimental** | Rápido, 1M context, experimental grátis | Experimental (pode mudar) | ✅ **ESCOLHIDO** |
| Claude 3.5 Sonnet | Excelente raciocínio, bom para código | Caro, requer internet | ❌ Rejeita (custo) |
| GPT-4 Turbo | Boa qualidade | Caro, context limitado (128k) | ❌ Rejeita (custo + context) |
| Llama 3.2 (local) | Grátis, totalmente local | Qualidade inferior, requer hardware | ❌ Rejeita (qualidade) |

---

## IV. IMPLEMENTAÇÃO

### Setup (Windows)

1. Instalar Google AI Studio SDK:
   ```bash
   pip install google-generativeai
   ```

2. Configurar API key:
   ```bash
   export GOOGLE_API_KEY="..."
   ```

3. Usar modelo:
   ```python
   import google.generativeai as genai
   
   genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
   model = genai.GenerativeModel('gemini-2.0-flash-exp')
   
   response = model.generate_content(prompt)
   ```

### Configuração Repo

- **Local:** Nenhum arquivo de config versionado (secrets fora do repo)
- **CI/CD:** Não usar LLM em CI (gates são determinísticos)

---

## V. IMPACTO

### Apps Afetados

- **alvaro-core:** Pode usar Gemini para decisões Genesis (via policies)
- **elysian-brain:** Toolbelt pode usar Gemini para NLP tasks

### Documentação Afetada

- Manual de Construção v6.0 (adicionar seção "LLM Local Setup")
- AGENTS/LAW.md (já documenta papel LLM Aurora)

---

## VI. RISCOS E MITIGAÇÃO

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| API Experimental deprecada | Média | Migrar para Gemini 2.0 Flash (stable) quando disponível |
| Rate limits | Baixa | Implementar fallback para Claude/GPT-4 |
| Custo (se sair de experimental) | Alta | Avaliar custo antes de remover "experimental" flag |
| Qualidade insuficiente | Baixa | Testes de raciocínio em gates |

---

## VII. MÉTRICAS DE SUCESSO

- **Latência média:** < 300ms para prompts PLAN.md
- **Taxa de acerto:** ≥ 90% de PLANs executáveis sem modificação
- **Custo mensal:** $0 (enquanto experimental)

---

## VIII. REVISÃO

**Próxima Revisão:** 2026-03-12 (ou quando Gemini 2.0 Flash sair de experimental)

**Critérios de Revisão:**
- Custo acumulado > $50/mês → reavaliar alternativas
- Taxa de acerto < 80% → considerar Claude 3.5
- API deprecada → migração obrigatória

---

## IX. REFERÊNCIAS

- [Gemini 2.0 Flash Documentation](https://ai.google.dev/gemini-api/docs/models/gemini-v2)
- [Google AI Studio](https://aistudio.google.com/)
- [Agents Law (LLM Aurora Role)](../AGENTS/LAW.md#iii-poderes-do-llm-aurora)

---

## X. CHANGELOG

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-01-12 | Initial decision: Gemini 2.0 Flash Experimental |

---

**Decisor:** Comandante  
**Executor:** Copilot (documented decision)  
**Vault:** CONSTITUICAO/DECISOES/  
**Permanência:** Imutável (novas versões criam novo arquivo)
