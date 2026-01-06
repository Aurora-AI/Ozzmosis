# AGENTS — Contrato Operacional do Repositório (Ozzmosis)

## Lei (Obrigatorio)
- **Manual de Construcao Aurora (canonico):** `docs/manual/Manual_de_Construcao_Aurora.md`
- **Lei dos Agentes:** `docs/AGENTS/LAW.md`

Em caso de conflito, prevalece o Manual.

Este arquivo define como qualquer agente (Codex 5.2 / Roo Code / Copilot) deve operar neste repositório.
Ele tem precedência sobre “boas práticas genéricas” do agente.

## 1) Filosofia (Aurora / Trustware)

- A IA planeja; o sistema executa.
- Planejamento explícito é obrigatório: toda mudança relevante começa com PLAN.md.
- O repositório é SSOT operacional: regras e prompts são versionados aqui.

## 2) Modos de operação (obrigatórios)

### 2.1 Architect Mode (Planejar)
Pode:
- Ler arquivos e documentação do repo
- Produzir/atualizar PLAN.md
- Propor mudanças e listar riscos

Não pode:
- Escrever código de produção
- Alterar configs, workflows, Dockerfiles
- Rodar comandos destrutivos
- Fazer commit/push

Saída obrigatória:
- Um `PLAN.md` com passos numerados, comandos exatos e critérios de aceite.

### 2.2 Builder Mode (Executar)
Pode:
- Executar exatamente 1 passo do PLAN por vez
- Alterar somente os arquivos necessários para o passo atual
- Rodar gates (scripts/agents/run-gates.*) após cada passo

Não pode:
- Executar múltiplos passos “de uma vez”
- “Refatorar por conveniência”
- Inserir dependências não aprovadas no PLAN
- Fazer ações perigosas sem confirmação humana

## 3) Política Trustware (permissões)

Regra: qualquer comando fora do allowlist exige confirmação humana explícita.

Ver policy detalhada em:
- docs/AGENTS/POLICY_TRUSTWARE.md

Resumo:
- PROIBIDO sem confirmação humana: rm/rmdir, del, format, docker system prune, git push, git reset --hard, rebase, alterações em secrets/env.
- PERMITIDO: leitura de arquivos, lint, typecheck, testes, build, docker compose config, npm ci.

## 4) Contrato do Repositório (Ozzmosis)

- Instalação canônica: `npm ci` na raiz.
- Um único lockfile: `package-lock.json` na raiz.
- Gates definem verdade: se falhar em gate, não entra em main.

Comandos úteis (padrão):
- `npm run repo:check`
- `npm run build:conductor`
- `npm run lint:conductor`
- `npm run typecheck:conductor`
- `npm run smoke:conductor`
- `npm run survival:conductor`

## 5) Procedimento obrigatório (toda tarefa)

1) Criar/atualizar `PLAN.md` (Architect Mode)
2) Executar 1 passo (Builder Mode)
3) Rodar gates: `scripts/agents/run-gates.(ps1|sh)`
4) Commit pequeno e descritivo
5) Push somente após gates PASS

## 6) Padrões de commit

- feat(scope): ...
- fix(scope): ...
- ci(scope): ...
- chore(scope): ...

## 7) Se faltar contexto

Nunca “inventar”.
Ação:
- abrir docs/AGENTS/README.md
- ler a seção relevante
- se ainda faltar, pedir o artefato faltante (transcrição/OS/canônico)
