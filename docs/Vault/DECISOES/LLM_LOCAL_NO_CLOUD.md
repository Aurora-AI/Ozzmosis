# DECISÃO — LLM Local por padrão; sem fallback cloud
**Status:** 🟢 VIGENTE  
**Data:** 2026-01-12  
**Autoridade:** Constituição Aurora (derivada)

---

## Decisão
1) Qualquer chat interno, rotas operacionais e ferramentas de agente devem usar **LLM/SLM local** por padrão (ex.: Ollama, LM Studio, servidor local).
2) Provedor cloud (OpenAI/Anthropic/etc.) é **proibido por padrão**.
3) Se o provider for desconhecido: **falhar explicitamente**.
4) **Sem persistência automática** de conversas por padrão (side-effects = zero), exceto quando existir OS específica de persistência + evidência.
5) Logs devem evitar conteúdo sensível; registrar apenas metadados operacionais quando necessário.

---

## Racional

- Soberania cognitiva
- Redução de custo
- Evitar dependência de credenciais
- Auditabilidade e previsibilidade
