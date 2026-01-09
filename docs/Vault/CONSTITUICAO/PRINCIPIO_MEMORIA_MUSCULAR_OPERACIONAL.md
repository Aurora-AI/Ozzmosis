# PRINCÍPIO DA MEMÓRIA MUSCULAR OPERACIONAL
## Doutrina de Segregação Cognitiva do Organismo Aurora

**ID:** CHRONOS-PRINCIPLE-MUSCLE-MEMORY-001
**Status:** 🟢 CANÔNICO
**Classificação:** Doutrina de Segurança / Trustware
**Origem:** Laboratório Álvaro / Análise Biológica

---

### 1. DEFINIÇÃO FUNDAMENTAL
No ecossistema Aurora, **Inteligência** e **Execução** são funções biologicamente distintas e não sobreponíveis.
* **Cognição (Cérebro):** Capacidade de definir objetivos, interpretar contextos e alterar estratégias.
* **Memória Muscular (Membros):** Capacidade de otimizar a execução de uma ordem repetitiva sem compreender o seu propósito semântico.

**O Princípio:** Operadores e Agentes Executores devem desenvolver *Memória Muscular*, mas são estritamente proibidos de desenvolver *Cognição*.

### 2. O QUE É PERMITIDO (A ESFERA REFLEXA)
Os operadores (Agentes CLI, Scripts, Workers) **DEVEM** otimizar-se através da repetição. Isso é eficiência energética (Biologia de 20W).
O "aprendizado" permitido resume-se a métricas de execução física:
1.  **Latência:** "Este caminho responde mais rápido."
2.  **Taxa de Erro:** "Esta rota falha frequentemente; devo tentar outra réplica."
3.  **Throughput:** "Consigo processar lotes de 50, mas falho com 100."
4.  **Cache Determinístico:** "Já vi esta entrada exacta antes; retorno a saída guardada." (Idempotência).

### 3. O QUE É PROIBIDO (A ESFERA COGNITIVA)
É vedado a qualquer operador:
1.  **Questionar o "Porquê":** O operador não avalia a ética ou a estratégia da ordem.
2.  **Alterar o Contrato:** O operador não pode modificar a estrutura da saída para "melhorar" o resultado semântico.
3.  **Inferência de Intenção:** O operador não deve tentar adivinhar o que o Conductor "quis dizer".
4.  **Persistência de Longo Prazo:** A memória muscular deve ser volátil ou invalidável.

### 4. PROTOCOLO DE INVALIDAÇÃO
A Memória Muscular é subserviente à Decisão Cognitiva.
* **Regra de Ouro:** Sempre que o *Aurora Conductor* altera uma política, esquema ou contrato, toda a memória muscular associada nos operadores deve ser purgada imediatamente.

### 5. IMPLEMENTAÇÃO TÉCNICA (TRUSTWARE)
Para garantir este princípio, o código dos operadores deve ser:
* **Stateless:** Não guarda estado da conversa ou negócio.
* **Determinístico:** Mesma entrada = Mesma saída.
* **Auditável:** O operador deve reportar *o que* fez, nunca *o que achou* que deveria fazer.

