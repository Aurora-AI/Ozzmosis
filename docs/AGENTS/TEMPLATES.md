# Templates Oficiais (Ozzmosis)

## TEMPLATE — PLAN.md

# PLAN — <TITULO>
Data: <YYYY-MM-DD>
Autor: <humano/agent>

## Objetivo
<1-3 linhas>

## Escopo
Inclui:
- ...
Não inclui:
- ...

## Riscos
- R1: ...
- R2: ...

## Passos (executar 1 por vez)
1) <passo>
   - Comandos:
     - ...
   - Arquivos:
     - ...
   - Critérios de aceite:
     - ...

2) ...

## Gates
- npm ci
- npm run repo:check
- (outros conforme mudança)

## Rollback
- git revert <sha>
- npm ci && npm run repo:check

---

## TEMPLATE — PR Description (resumo)

### O que foi feito
- ...

### Como validar
- ...

### Critérios de aceite
- ...

### Riscos / mitigação
- ...

