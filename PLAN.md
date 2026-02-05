```md
## OS-CONFIG-GITHUB-MODELS-TOKEN-20260116

### Objective
Configurar o token do GitHub para acesso a modelos no projeto, garantindo uso em dev local e CI sem commit de segredos.

### Scope
Inclui:
- Dev local: `.env.local` (não commitado).
- CI: GitHub Actions secrets (não commitado).
- Runbook mínimo de setup + validação.

Não inclui:
- Alterações em código de produto.
- Mudança de provider de modelos.

### Risks
- R1: Exposição do token em repositório público ou histórico do git.  
  Mitigação: nunca commitar `.env.local`; garantir `.gitignore`; rotacionar o token se houver suspeita de vazamento.
- R2: Misconfiguração causando falha de acesso ou acesso indevido.  
  Mitigação: escopos mínimos; nome de env consistente; smoke check “fail-fast” quando ausente.

### Steps (executar 1 por vez)

#### 1) Dev local: configurar `.env.local`
- Arquivos:
  - `.env.local` (não versionado)
  - `.gitignore`
- Ações:
  - Criar/editar `.env.local` na raiz do repo (ou na raiz do app, se sua stack exigir).
  - Adicionar:
    - `GITHUB_TOKEN=<seu_token>`
  - Garantir que o arquivo **não** será rastreado:
    - Verificar/atualizar `.gitignore` para conter:
      - `.env.local`
      - `.env.*.local`
- Critérios de aceite:
  - `.env.local` contém `GITHUB_TOKEN=<token>`.
  - `git status -sb` não lista `.env.local`.

#### 2) CI (GitHub Actions): configurar secret
- Ações (GitHub UI):
  - Repo → **Settings** → **Secrets and variables** → **Actions**
  - Criar Secret:
    - Name: `GITHUB_TOKEN`
    - Value: `<seu_token>`
- Uso no workflow:
  - Referenciar sempre como:
    - `${{ secrets.GITHUB_TOKEN }}`
- Critérios de aceite:
  - Secret `GITHUB_TOKEN` existe no repositório.
  - Workflows que precisam do token usam `${{ secrets.GITHUB_TOKEN }}` (e nunca um valor hardcoded).

#### 3) Validação / smoke check (fail-fast)
- Objetivo:
  - Falhar imediatamente quando `GITHUB_TOKEN` estiver ausente.
  - Garantir que o token não aparece em logs.
- Implementação recomendada:
  - Em qualquer script/runner que exija o token, adicionar checagem explícita:
    - Se `GITHUB_TOKEN` não estiver definido → **exit 1** com mensagem curta (sem imprimir valores).
- Critérios de aceite:
  - Execução local falha rápido quando `GITHUB_TOKEN` não está definido.
  - Execução em CI falha rápido quando o secret está ausente.
  - Nenhum log imprime o token.

### Gates
- N/A (configuração e runbook).  
  *Se seu repo possui gates padronizados, execute-os após ajustes em `.gitignore`.*

### Rollback
- Remover o secret `GITHUB_TOKEN` em GitHub Actions.
- Remover `GITHUB_TOKEN` de `.env.local`.
- Rotacionar o token se houver qualquer suspeita de exposição.

### Notes (hardening)
- Preferir token com **least privilege** (somente o necessário).
- Se o token for usado por múltiplos workflows, padronizar o nome **GITHUB_TOKEN** em todo o repo.
- Nunca colocar tokens em `.env`, `README`, issues ou commits.
```
