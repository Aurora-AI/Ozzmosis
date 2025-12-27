# Skill: Repo Guardian (Fábrica)

## Objetivo
Garantir que o Ozzmosis mantém o contrato de fábrica: instalação canônica, higiene, docs mínimas e gates.

## Escopo
- Inclui: repo contract, Chronos scaffold, gates do Conductor, higiene pós-gates.
- Não inclui: criação/migração de produtos, mudanças de comportamento do Conductor sem evidências (tests).

## Entradas esperadas
- Branch ou PR
- Lista de arquivos alterados (se houver)
- Comando de validação local/CI (se necessário)

## Precondições
- Executar na raiz do repo (onde existe `package-lock.json`).
- Node.js 20+ e npm 10+.

## Passos (determinísticos)
1) `npm ci` na raiz
2) Rodar `npm run repo:check`
3) Rodar gates do Conductor:
   - build/typecheck/lint/smoke/survival
4) Rodar gates do Chronos (se existir):
   - build + smoke
5) Verificar higiene:
   - `npm run repo:clean` deve passar
6) Validar que não houve introdução de “produto” (apps com implementação) nesta fase

## Artefatos esperados
- Nenhum artifact por padrão (repo deve permanecer limpo após gates).
- Alterações canônicas apenas quando o PR for explícito sobre docs/contrato/skills/scaffold.

## Critérios de aceite
- Todos os comandos passam
- Repo não fica sujo (sem `.artifacts`, sem `last-run.json` por padrão)
- Não há criação/migração de produto

## Rollback
- Se qualquer gate falhar: reverter commits do PR ou ajustar até o CI ficar verde.
- Se houver sujeira pós-gates: identificar gerador do artifact e tornar escrita opt-in ou ignorada via contrato (com revisão).

## Não fazer
- Não adicionar apps/produtos
- Não introduzir dependências “latest”
- Não alterar comportamento do Conductor sem testes correspondentes
