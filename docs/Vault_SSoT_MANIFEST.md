# Vault SSOT Manifest — Aurora_PD_Vault

## Doutrina
O Google Drive Vault (Aurora_PD_Vault) é a memória oficial. Se não está no Vault, não existe.

Este repositório contém os ativos versionados e exige espelhamento dos canônicos.

## O que deve ser espelhado (canônicos)
- .editorconfig
- .gitattributes
- .gitignore
- docs/CONTRACT.md
- docs/CONSTITUICAO/*
- docs/chronos/*
- docs/ozzmosis/MANUAL_PRODUTO_OZZMOSIS.md
- agent-skills/*
- (Conductor) docs/conductor/* (se houver canônicos de governança)

## Procedimento operacional (manual)
1) Após merge em main, exportar os arquivos canônicos do repo.
2) Subir para o Vault no diretório correspondente:
   - `Aurora_PD_Vault/Ozzmosis/CONSTITUICAO/`
   - `Aurora_PD_Vault/Ozzmosis/AGENT_SKILLS/`
   - `Aurora_PD_Vault/Ozzmosis/MANUAIS/`
3) Registrar data e commit SHA espelhado neste manifesto (abaixo).

## Registro de espelhamentos
- [ ] DATA: ____  COMMIT: ____  RESPONSÁVEL: ____

## Definition of Done (SSOT)
O PR só é considerado “Done” após:
1) merge em `main`,
2) espelhamento dos canônicos no Vault,
3) e atualização do registro acima (DATA/COMMIT/RESPONSÁVEL) para o commit efetivamente espelhado.
