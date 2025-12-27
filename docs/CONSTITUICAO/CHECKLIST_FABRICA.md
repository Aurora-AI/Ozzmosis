# Checklist — Fábrica Ozzmosis

## Antes do PR
- [ ] `npm ci` (raiz)
- [ ] Se `npm ci` falhar por lock local: `npm run install:clean` e repetir `npm ci`
- [ ] `npm run build:conductor`
- [ ] `npm run typecheck:conductor`
- [ ] `npm run lint:conductor`
- [ ] `npm run smoke:conductor`
- [ ] `npm run survival:conductor`
- [ ] `npm run repo:check`
- [ ] `npm run repo:clean`
- [ ] `git status --porcelain` (limpo)

## Opcional (Chronos — em OS própria)
- [ ] `npm run chronos:build`
- [ ] `npm run chronos:smoke`

## Regra de SSOT (Vault)
- [ ] Atualizei `docs/Vault_SSoT_MANIFEST.md` com o que mudou.
- [ ] Espelhei os canônicos no Vault (conforme manifesto).

## Após o merge (obrigatório para “Done”)
- [ ] Preenchi o registro em `docs/Vault_SSoT_MANIFEST.md` com DATA/COMMIT/RESPONSÁVEL do espelhamento.
