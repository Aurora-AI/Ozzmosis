# Rodobens Wealth — Product Evidence Index (Vault SSOT)

**Data:** 2026-01-12
**Projeto:** Ozzmosis / Genesis Frontend / Rodobens Wealth
**Natureza:** Evidência (Vault-first)

---

## Arquivos encontrados

### 1. apps/ozzmosis/data/vault/rodobens-wealth/README.md
- Tipo: SSOT / README
- Trechos:
  - "Este diretorio e a Fonte Unica da Verdade (SSOT) para o dominio Rodobens Wealth."
  - Estrutura: sources, knowledge, policies, diagrams, os, evidence
- Implicação: Confirma que todo catálogo/mix de produtos Rodobens Wealth deve estar neste Vault.

### 2. apps/ozzmosis/data/vault/rodobens-wealth/policies/trustware_rules.yaml
- Tipo: Políticas / Trustware
- Trechos:
  - "domain: rodobens_wealth"
  - Regras: FGTS_POLICY, IW_REQUIRED, DATE_GUARANTEE_PROHIBITED
- Implicação: Existem regras explícitas para consórcio, FGTS, promessas de contemplação.

### 3. apps/ozzmosis/data/vault/rodobens-wealth/diagrams/cinematic_states.md
- Tipo: Diagrama / Estados
- Trechos:
  - "Estados (alto nivel): HOME, PORTAL_SELECT, DISCOVERY, ..."
  - "PROPOSAL_VIEW (Essential | Wealth | Legacy)"
- Implicação: Mapeia estados e etapas do produto/negócio Rodobens Wealth.

### 4. apps/ozzmosis/data/vault/rodobens-wealth/os/OS-CODEX-RODOBENS-ULTIMATE-EXECUTION-20260106-019.md
- Tipo: OS / Execução
- Trechos:
  - "Materializacao do DMI Rodobens Wealth: SSOT no Vault + pipeline PDF->MD deterministico"
  - "Vault Rodobens Wealth criado e governado"
- Implicação: Confirma a existência do SSOT e pipeline de ingestão de produtos.

### 5. apps/ozzmosis/data/vault/rodobens-wealth/os/OS-CODEX-RODOBENS-WEALTH-Vault-Ingest-PDF2MD-Trustware-States-20260106-019.md
- Tipo: OS / Execução
- Trechos:
  - "Implantar SSOT Rodobens Wealth no Vault e pipeline deterministico PDF->MD com index e baseline Trustware + documento de estados."
  - "Trustware YAML templates"
- Implicação: Confirma ingestão, indexação e baseline de regras Trustware para produtos.

### 6. apps/ozzmosis/data/vault/rodobens-wealth/diagrams/cinematic_states.md
- Tipo: Diagrama / Estados
- Trechos:
  - "Estados (alto nivel): HOME, PORTAL_SELECT, DISCOVERY, ..."
  - "PROPOSAL_VIEW (Essential | Wealth | Legacy)"
- Implicação: Mapeia estados e etapas do produto/negócio Rodobens Wealth.

### 7. docs/Vault/FRONTEND_FACTORY_PRODUCT.md
- Tipo: Produto / Concepção
- Trechos:
  - "flexível o suficiente para domínios distintos (jurídico vs seguros)"
  - "Seguros exige cognição de confiança e conversão."
- Implicação: Produto frontend contempla seguros/wealth como domínios cognitivos distintos.

### 8. docs/Vault/FRONTEND/GOD_MODE_GOVERNANCE.md
- Tipo: Governança / Produto
- Trechos:
  - "domain: seguros | juridico | wealth | other"
- Implicação: Wealth é domínio cognitivo explícito na governança frontend.

### 9. docs/Vault/FRONTEND/FRONTEND_FACTORY_WORKFLOW.md
- Tipo: Workflow / Produto
- Trechos:
  - "domínio cognitivo: juridico | seguros | wealth | ..."
- Implicação: Workflow frontend reconhece wealth/seguros como domínios de produto.

### 10. docs/Vault/FRONTEND/FRONTEND_GOVERNANCE.md
- Tipo: Governança / SSOT
- Trechos:
  - "Se não está no Vault, não existe."
- Implicação: Confirma que Vault é SSOT para qualquer produto/decisão.

---

## Conclusões SSOT

### Confirmado
- Rodobens Wealth é SSOT no Vault, com README, políticas Trustware, diagramas de estados, OS de ingestão e execução.
- Domínios "wealth" e "seguros" são reconhecidos e governados em múltiplos artefatos.
- Políticas Trustware para consórcio, FGTS, promessas de contemplação existem.
- Workflow e governança frontend contemplam wealth/seguros como domínios cognitivos.

### A Confirmar
- Detalhamento de produtos específicos (catálogo, mix, Plano Pontual, entrega programada, etc.) não está explicitamente listado em artefatos SSOT.
- Menções diretas a "Rodobens-Alper", "Aurora Real", "Private Vault/Elysian Lex" não foram encontradas nos artefatos Vault.

### Não Encontrado no Vault
- Catálogo granular de produtos Rodobens (consórcios/seguros/wealth) — não há lista explícita.
- Itens "Plano Pontual", "entrega programada", "lance embutido", "prestamista", "responsabilidade civil" — não há artefato SSOT dedicado.
- Mapeamento de oferta comercial — não há documento SSOT consolidado.

---

**Nota:** Este índice é evidência Vault-first, não é o Product Map final. Habilita WP4 para mapeamento semântico.
