# Constituição Operacional — Ozzmosis (Fábrica Aurora)

## 1) O que é o Ozzmosis
O Ozzmosis é a Fábrica (monorepo) do ecossistema Aurora: um ambiente limpo, determinístico e auditável onde bibliotecas e aplicações serão construídas sob um contrato único.

Este repositório NÃO é um produto final. Ele é a infraestrutura que permite criar produtos verticais (CRM, Legal, Shield) com governança.

## 2) A Pedra Inicial: Aurora Conductor
O Aurora Conductor é o Kernel lógico (governança + Trustware). Ele é a “pedra filosofal” porque transforma intenção em plano auditável e aplicado sob políticas.

Regras do Kernel:
- Side-effects por padrão = ZERO (artefatos são opt-in).
- Determinismo é obrigatório (sem rede/clock por padrão).
- CI e Survival Tests são lei (se falhar, não entra).

## 3) O Segundo Pilar: Chronos (em desenvolvimento)
Chronos é o pilar do “tempo operacional” (agendamento, cadência, ritmos). Nesta fase, ele existe como:
- contrato,
- disciplina de build,
- smoke test,
- e espaço formal no monorepo.

Nenhuma lógica de produto é implementada aqui ainda.

## 4) Invariantes (não negociáveis)
- Instalação canônica: `npm ci` na raiz.
- Gates definem verdade: se falha no gate, não entra em `main`.
- Side-effects por padrão = zero (artifacts opt-in).
- Nada de “produtos” nesta fase. Evite expandir `apps/*` com lógica de produto nova.

## 5) Comandos canônicos
### Kernel (Conductor)
- `npm run build:conductor`
- `npm run typecheck:conductor`
- `npm run lint:conductor`
- `npm run smoke:conductor`
- `npm run survival:conductor`

### Repo (contrato)
- `npm run repo:check`
- `npm run repo:clean`
- `npm run install:clean` (quando `npm ci` falhar por lock local)

### Chronos (menção; evolução em OS própria)
- `npm run chronos:build`
- `npm run chronos:smoke`

## 6) Agent Skills (Contexto carregável)
O processo produtivo usa “Agent Skills” para reduzir prompts gigantes e manter consistência.
Regra: progressive disclosure — carregar apenas o necessário, quando necessário.
Ver: `agent-skills/README.md` e skills individuais.

## 7) Manual do produto (repo/fábrica)
Ver: `docs/ozzmosis/MANUAL_PRODUTO_OZZMOSIS.md`.

## 8) Regra doutrinária (Vault / SSOT)
O Vault (Google Drive) é memória oficial. Se não está no Vault, não existe.
Este repo mantém os ativos versionados e exige espelhamento conforme `docs/Vault_SSoT_MANIFEST.md`.
