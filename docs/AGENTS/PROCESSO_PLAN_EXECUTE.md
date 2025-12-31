# Processo Oficial — Architect → Plan → Execute (Ozzmosis)

## 1) Criar um PLAN
Use:
- scripts/agents/new-plan.ps1 (Windows/PowerShell)
- scripts/agents/new-plan.sh (Linux/Mac)

O PLAN deve conter:
- Contexto mínimo
- Passos numerados (1..N)
- Comandos exatos
- Critérios de aceite por passo
- Rollback

## 2) Executar (Builder)
Regra: 1 passo por vez.

Depois de cada passo:
- rodar scripts/agents/run-gates.(ps1|sh)
- corrigir falhas antes de avançar
- commit pequeno, push

## 3) PR
O PR deve conter:
- O que mudou
- Como validar (comandos)
- Critérios de aceite
- Riscos e mitigação

