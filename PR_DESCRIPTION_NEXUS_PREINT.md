# Aurora Conductor — Nexus Pre-Integration (Repo Hygiene + CI Matrix + Technical Audit)

## Escopo (OS-OZZMOSIS-CONDUCTOR-NEXUS-PREINT-20251227-001)

### WP1 — Higiene do repositório

- Removeu artefato untracked em `docs/constitution/` e versionou como documentação PowerQuery em `docs/powerquery/codigo-m-arquivos-csv.md`.
- Adicionou `.gitignore` (node + runtime) para impedir sujeira (`node_modules`, `.artifacts`, `dist`).

### WP2 — Survival como gate definitivo (Linux + Windows)

- Workflow ` .github/workflows/ci-conductor.yml` agora roda em matriz `ubuntu-latest` + `windows-latest`.
- `npm run survival:conductor` executa **3x por OS** (anti-flake), falhando no primeiro erro.

### WP3 — Auditoria técnica (Conductor ↔ Nexus)

- Relatório técnico completo em `docs/conductor/RELATORIO_TECNICO_CONDUCTOR_VS_AURORA_NEXUS.md`.

## Como validar (local)

```bash
npm ci
npm run build:conductor
npm run typecheck:conductor
npm run lint:conductor
npm run smoke:conductor
npm run survival:conductor
```

## Observações de contrato

- `compose()` não escreve artifacts por padrão; escrita é opt-in via `writeArtifacts: true`.

