# Agent Skills — Ozzmosis

## O que são
“Skills” são módulos de execução: instruções + recursos + critérios de aceite, acionáveis por agentes (Codex/Copilot/VS Code) sem reexplicar o mundo.

## Princípio: progressive disclosure
Contexto é ativo operacional, mas contexto em excesso cria erro.
Regra: carregar (ler) apenas a(s) skill(s) necessária(s) para a tarefa atual, e só então seguir o passo a passo.

## Como usar (padrão)
Quando delegar uma tarefa ao agente:
1) referencie a skill (ex.: `agent-skills/repo-guardian`),
2) descreva o alvo (branch/PR/arquivos),
3) exija que o agente siga os passos e reporte os critérios de aceite.

## Estrutura padrão
- `agent-skills/<skill-name>/SKILL.md` (obrigatório)
- `agent-skills/<skill-name>/scripts/*` (opcional; automações)
- `agent-skills/<skill-name>/references/*` (opcional; referências locais do repo)

## Convenções de naming
- `kebab-case` (ex.: `repo-guardian`)
- Nome deve refletir a responsabilidade (um “anticorpo” por skill)

## Definition of Done (uma skill)
- Define objetivo e escopo (inclui/não inclui)
- Declara precondições (ambiente, branch, ferramentas)
- Lista comandos/gates determinísticos
- Define artefatos esperados (arquivos/saídas) e o que é proibido gerar
- Define rollback (como desfazer/reverter)
- Referencia canônicos (Constituição/Checklist/Vault) quando aplicável

## Skills iniciais
- `repo-guardian`: valida contrato da fábrica (higiene + gates).
- `conductor-guardian`: valida invariantes do Kernel (survival/smoke/determinismo).
- `doc-curator`: mantém constituição e manuais canônicos atualizados.
- `chronos-bootstrap`: cria/valida o scaffold do Chronos sem acoplamento prematuro.
