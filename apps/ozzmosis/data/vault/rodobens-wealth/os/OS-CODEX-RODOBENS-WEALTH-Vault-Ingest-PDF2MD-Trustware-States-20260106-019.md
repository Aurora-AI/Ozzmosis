# OS-CODEX-RODOBENS-WEALTH-Vault-Ingest-PDF2MD-Trustware-States-20260106-019

## Objetivo
Implantar SSOT Rodobens Wealth no Vault e pipeline deterministico PDF->MD com index e baseline Trustware + documento de estados.

## Escopo
- Vault: raw/ processed/ index/ _runs/ os/
- PDF->MD: front-matter + hashes + index.json
- Backend runtime-selection (sem CUDA-only)
- Trustware YAML templates
- Cinematic Commerce states

## Evidencias / Aceite
- [ ] Vault criado em `apps/ozzmosis/data/vault/rodobens-wealth/`
- [ ] `scripts/rodobens/pdf2md.*` gera MD com front-matter + hashes
- [ ] `apps/ozzmosis/data/vault/rodobens-wealth/index/index.json` existe e lista entradas
- [ ] Selecao runtime documentada (engine/providers) - sem dependencia exclusiva de CUDA
- [ ] Trustware templates em YAML existem
- [ ] Documento de estados existe em `docs/rodobens/CINEMATIC_COMMERCE_STATES.md`
- [ ] PLAN atualizado
