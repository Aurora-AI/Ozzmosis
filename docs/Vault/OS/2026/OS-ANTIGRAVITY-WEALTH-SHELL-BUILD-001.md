# 🧬 OS-ANTIGRAVITY-WEALTH-SHELL-BUILD-001

**Arquivo:** `docs/Vault/OS/2026/OS-ANTIGRAVITY-WEALTH-SHELL-BUILD-001.md`
**Tipo:** Ordem de Execução (Frontend Architecture)
**Executor:** Antigravity Engine (ou Desenvolvedor Front)
**Designer Responsável:** Jules
**Status:** 🚀 PRONTA PARA EXECUÇÃO

---

### 1. OBJETIVO DA MISSÃO

Construir a **Wealth Shell (Casca Viva)** do Genesis.
Trata-se de uma aplicação frontend navegável, visualmente rica ("High-End"), populada por dados *mockados*, que serve como o container para a experiência de vendas e, posteriormente, para a injeção dos módulos clínicos do Trustware.

**Meta:** Entregar um deploy (Vercel/Local) onde seja possível clicar, navegar e sentir o peso do produto, sem depender de backend real.

---

### 2. PRINCÍPIOS DE DESIGN (THE RULES)

1. **A Regra do "Private Banking":** A interface fora do Trustware deve parecer um terminal financeiro de elite. Fundo escuro ("Void"), tipografia elegante, zero ruído.
2. **Separação Igreja-Estado:**
* **Shell:** Pode ter vídeo, animação, promessa e beleza.
* **Trustware Slot:** É uma "zona desmilitarizada". Quando o usuário entra numa área de auditoria, o marketing morre e a clínica assume.


3. **Mock Honesto:** Os dados devem parecer reais (R$ 500.000,00, Consórcio Pesado, Scania), mas o código deve deixar claro que é estático (`data/mocks`).

---

### 3. ARQUITETURA DE ROTAS (SITEMAP)

O Executor deve criar a seguinte estrutura de diretórios em `apps/genesis-front`:

* `/` **(Landing / Portal)**
* *Propósito:* A entrada "Cinemática". Identificação do usuário e seleção de contexto (Consultor ou Cliente).
* *Vibe:* Imersiva. Vídeo de background ou imagem de altíssima qualidade com overlay escuro.


* `/wealth` **(The Console - Layout Base)**
* *Propósito:* O container principal que segura a navegação lateral e o header.


* `/wealth/dashboard` **(Visão Geral)**
* *Propósito:* O "Cockpit". Mostra oportunidades, metas e atalhos.


* `/wealth/portfolio` **(Meus Ativos/Propostas)**
* *Propósito:* Lista de cards ricos ("Proposal Tickets").


* `/wealth/audit/[id]` **(A Verdade - Trustware Zone)**
* *Propósito:* Página dedicada à renderização do Audit Terminal.
* *Comportamento:* A UI do Shell recua (diminui opacidade) para dar foco total ao Terminal.



---

### 4. ESTRUTURA DE COMPONENTES (BUILD LIST)

O Executor deve criar estes componentes (scaffolding):

#### 4.1 Shell Components (Marketing/Nav)

1. **`WealthSidebar`**: Navegação vertical retrátil. Ícones minimalistas.
2. **`WealthHeader`**: Breadcrumbs, User Profile, Status do Sistema (Mock).
3. **`CinematicHero`**: Componente de topo com suporte a vídeo/imagem, título H1 display e subtítulo.
4. **`AssetCard`**: O "Ticket". Deve mostrar:
* Nome do Produto (ex: "Frota Pesada Scania")
* Valor de Crédito (Highlight)
* Status Visual (Badge semântica de negócio, não clínica)
* Botão de Ação ("Auditar" ou "Simular")



#### 4.2 Layout Containers

1. **`ShellLayout`**: O wrapper que aplica o fundo "Void" e gerencia o scroll.
2. **`TrustwareFocusMode`**: Um wrapper especial que remove distrações quando o usuário está auditando.

#### 4.3 Placeholders de Integração

1. **`TrustwareTerminalMount`**: Um componente vazio (div com borda tracejada clínica) onde o *Audit Terminal* real será injetado futuramente. Deve ter um label: *"Sistema Clínico Inativo (Placeholder)"*.

---

### 5. DADOS MOCKADOS (DATA STRATEGY)

Criar em `apps/genesis-front/data/mocks/wealth_shell.json`:

* **User Profile:** (Nome, Cargo, Unidade).
* **Opportunities:** Lista de 3 cards de exemplo (Um "Aprovado", um "Em Análise", um "Bloqueado").
* *Importante:* O card "Bloqueado" deve ter um motivo de marketing ("Documentação pendente"), diferente do erro técnico do Trustware.


* **Metrics:** (Vendas no Mês, Comissões Projetadas - números grandes para efeito visual).

---

### 6. CRITÉRIOS DE ACEITE (DOD)

A execução só termina quando:

1. [ ] O projeto roda (`npm run dev`) sem erros de build.
2. [ ] É possível navegar da Home -> Dashboard -> Detalhe de Proposta.
3. [ ] A página de "Auditoria" mostra o layout da Shell, mas com o *slot* central reservado para o Trustware.
4. [ ] **Nenhum** componente novo usa cores padrão do Tailwind (blue-500, red-500). Tudo deve usar variáveis semânticas ou cores customizadas do tema "Wealth".
5. [ ] Não existe conexão com API real. Tudo lê do JSON local.

---

### 7. INSTRUÇÃO PARA O EXECUTOR (ANTIGRAVITY)

> "Execute a estrutura acima. Não tente 'interpretar' o design visual além do descrito (Fundo Escuro, Tipografia Limpa). Foque na estrutura de arquivos, na passagem de props e na integridade da navegação. O polimento final de pixels será feito em outra rodada."
