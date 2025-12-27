# Processo Produtivo — Ozzmosis (Fábrica)

## Missão
Operar como fábrica: produzir ativos (código, docs, contratos) com governança, sem legados, sem atalhos.

## Fases (Ciclo Aurora)
1) Planejamento (Arquitetura): define o que entra, o que não entra, invariantes e aceite.
2) OS (Ordem de Serviço): instrução autocontida para execução por agente.
3) Execução delegada: agente executa mecanicamente.
4) Revisão: validação por gates + inspeção de diffs.
5) Registro canônico: espelhar no Vault e versionar no repo.

## Regras de ouro
- Nada entra sem passar em CI.
- Nada “polui” o repo ao rodar testes (artifacts são opt-in).
- Contexto é ativo operacional: o que é regra vira contrato; o que é guia vira playbook.
- Progressive disclosure via Agent Skills: carregar apenas a skill necessária, no momento necessário, evitando prompts gigantes e reduzindo erros.

## Critérios formais de pronto (Definition of Done)
- `npm ci` roda na raiz.
- Gates do Conductor passam.
- Repo contract check passa.
- Documentação canônica atualizada e referenciada na Constituição.
- Manifesto de espelhamento para Vault atualizado.
- Espelhamento no Vault executado pós-merge e registro preenchido em `docs/Vault_SSoT_MANIFEST.md`.
