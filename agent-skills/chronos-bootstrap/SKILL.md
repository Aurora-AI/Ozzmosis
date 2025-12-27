# Skill: Chronos Bootstrap (Pilar em desenvolvimento)

## Objetivo
Criar e validar o scaffold do Chronos sob o mesmo rigor do Kernel, sem acoplamento a produtos.

## Escopo
- Inclui: `libs/aurora-chronos` scaffold, build + smoke, integração via scripts raiz, CI complementar.
- Não inclui: lógica de produto, integrações com Drive/Vault automatizadas, acoplamento com apps.

## Precondições
- Executar na raiz do repo.
- Garantir nomenclatura canônica “Chronos” (evitar “Chronus”).

## Passos
1) Criar `libs/aurora-chronos` (se não existir)
2) Implementar build + smoke test mínimo
3) Integrar scripts agregadores na raiz
4) Garantir CI mínimo (Linux) para repo contract + chronos

## Artefatos esperados
- Nenhum artifact por padrão (dist deve ser ignorado; repo deve permanecer limpo após gates).

## Critérios de aceite
- `npm run chronos:build` passa
- `npm run chronos:smoke` passa
- Não existe lógica de produto

## Rollback
- Se o scaffold quebrar gates do repo: reverter commit(s) e reintroduzir apenas o mínimo que passa build/smoke.
