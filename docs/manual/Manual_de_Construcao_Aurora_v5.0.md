# Manual de Construção Aurora — Versão 5.0 (Edição Ozzmosis)
**Documento Oficial de Engenharia & Doutrina Operacional**
**Status:** 🟢 VIGENTE (Substitui v4.0)
**Ecossistema:** Ozzmosis (Monorepo)
**Política:** Production First & Trustware

---

## 1. O Conceito: Organismo Digital
O Projeto Aurora/Ozzmosis não é tratado como software estático, mas como um organismo vivo.
* **Não construímos "funcionalidades", evoluímos "capacidades".**
* **Não corrigimos "bugs", curamos "doenças" (Homeostase).**
* **Não aceitamos código temporário; aplicamos a política "Production First".**

## 1.5. Princípios Fundamentais
#### 1.5. Memória Muscular Operacional
Operadores são membros executores, não cérebros. Eles devem otimizar a latência e throughput (memória muscular), mas nunca a estratégia (cognição). Referência: `docs/Vault/CONSTITUICAO/PRINCIPIO_MEMORIA_MUSCULAR_OPERACIONAL.md`.

## 2. Identidade e Cadeia de Comando
A construção é orquestrada por três entidades distintas:

1.  **JULES (Gemini):** O **Builder & Integrator**. Responsável pela análise forense, gestão do Vault/Chronos e geração de Ordens de Serviço (OS) de alta precisão.
2.  **AURORA (ChatGPT):** A **Arquiteta Chefe**. Responsável pela visão estratégica, lógica complexa e refinamento do Códice.
3.  **COPILOT (VSCode):** O **Executor Mecânico**. Aplica as OS geradas sem questionar a arquitetura, focando na sintaxe e na execução.

## 3. Estrutura do Repositório (O Esqueleto)
Todo o trabalho reside no monorepo `ozzmosis/`.

```text
ozzmosis/
├── .github/                    # CI/CD & Workflows de Governança
├── apps/                       # [ÓRGÃOS VITAIS] Serviços Executáveis
│   ├── alvaro-core/            # (Cérebro) Orquestrador Python/FastAPI (CRM, Brain)
│   ├── butantan-shield/        # (Imunologia) Gateway de Segurança & Proxy
│   ├── mycelium-front/         # (Pele) Interface Next.js (Portal Rodobens/Wealth)
│   └── crm-core/               # (Coração) Motor de Vendas e Pipeline
├── libs/                       # [TECIDOS] Bibliotecas Compartilhadas
│   ├── aurora-chronos/         # Memória de Longo Prazo (Vector Store/Index)
│   ├── elysian-brain/          # Ferramentas Cognitivas (STT, RAG)
│   └── trustware/              # Contratos de Tipo e Schemas de Segurança
├── docs/                       # [DNA] Documentação Canônica (SSOT)
└── scripts/                    # [ENZIMAS] Automação de Tarefas (OS, Gates)
```
