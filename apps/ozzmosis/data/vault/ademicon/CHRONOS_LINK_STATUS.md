# Chronos Link Status — Vault Ademicon

Data: 2026-01-02

## Chronos alvo
- App: `apps/chronos-backoffice`
- Indexer: `libs/aurora-chronos/scripts/build-index.ts`

## Como o Chronos consome o Vault
- UI: pages do Chronos leem direto do filesystem em `apps/ozzmosis/data/vault/ademicon`.
- Index: `libs/aurora-chronos/content/index.json` inclui os documentos do Vault (gerado por script).

## Documentos expostos
- `README.md`
- `00_MANIFESTO/DOCTRINE_WEALTH.md`
- `01_STATES/SSOT_STATES.md`
- `03_POLICIES/risk_policy.md`
- `04_DASHBOARD/wireframe_spec.md`

## Como validar localmente
- `npm -w libs/aurora-chronos run chronos:index`
- `rg -n "VAULT-ADEMICON" -S libs/aurora-chronos/content/index.json`
- `npm run dev:chronos` e abrir `/vault/ademicon/states`

## Index gerado em
- `libs/aurora-chronos/content/index.json`
