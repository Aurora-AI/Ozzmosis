# Skill: Doc Curator (Canônicos)

## Objetivo
Manter a Constituição Operacional e manuais canônicos consistentes e acionáveis.

## Escopo
- Inclui: Constituição/Processo/Checklist, Manual do repo/fábrica, Manifesto Vault/SSOT, Agent Skills.
- Não inclui: documentação de produtos (CRM/Jurídico/etc) nesta fase.

## Precondições
- Entender quais arquivos são canônicos (ver `docs/Vault_SSoT_MANIFEST.md`).
- Não introduzir “verdades” duplicadas: preferir links para canônicos.

## Passos
1) Validar que `docs/CONSTITUICAO/README.md` referencia os documentos principais e comandos canônicos
2) Atualizar `docs/CONSTITUICAO/CHECKLIST_FABRICA.md` se houver novos gates
3) Atualizar `docs/Vault_SSoT_MANIFEST.md` com mudanças canônicas
4) Garantir linguagem dupla:
   - seção “pessoas normais”
   - seção “dev/LLM”
5) Validar que `README.md` aponta para os canônicos e comandos

## Artefatos esperados
- Apenas arquivos de docs/skills (sem artefatos de runtime).
- Atualizações consistentes: Constituição referencia manual e manifesto; checklist pede rito do Vault.

## Critérios de aceite
- Docs explicam o que é Ozzmosis e como operar
- Manifesto do Vault atualizado

## Rollback
- Se a atualização causar inconsistência (links quebrados, comandos errados): reverter commit(s) e reaplicar com verificação local (`npm run repo:check`).
