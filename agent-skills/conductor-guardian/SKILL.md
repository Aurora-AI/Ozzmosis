# Skill: Conductor Guardian (Kernel)

## Objetivo
Proteger as invariantes do Aurora Conductor: determinismo, policy enforcement, side-effects opt-in e API estável.

## Escopo
- Inclui: gates oficiais do Conductor (build/typecheck/lint/smoke/survival) e verificação de side-effects.
- Não inclui: refactors “cosméticos” que alterem exports/semântica sem necessidade.

## Precondições
- Executar na raiz do repo.
- Node.js 20+ e npm 10+.

## Passos
1) `npm ci` (raiz)
2) `npm run build:conductor`
3) `npm run typecheck:conductor`
4) `npm run lint:conductor`
5) `npm run smoke:conductor`
6) `npm run survival:conductor`
7) `npm run repo:clean` (repo não deve gerar artefatos por padrão)

## Artefatos esperados
- Nenhum artifact por padrão (sem `.artifacts`, sem `last-run.json`).
- Dist gerado deve ser ignorado/opt-in (não versionado).

## Critérios de aceite
- Suite completa passa
- Nenhum artifact é escrito por padrão
- Exports públicos mínimos permanecem estáveis (freeze test)

## Rollback
- Se exports ou comportamento mudarem sem intenção: reverter commit(s) e reintroduzir mudança apenas com testes/justificativa.

## Não fazer
- Não “simplificar” removendo survival tests
- Não adicionar comportamento dependente de clock/rede sem proteção e testes
