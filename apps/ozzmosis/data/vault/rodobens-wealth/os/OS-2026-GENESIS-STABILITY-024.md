---
id: OS-2026-GENESIS-STABILITY-024
project: ozzmosis
domain: backend
scope: genesis-stability
status: IN_PROGRESS
created_at: 2026-01-06
ssot: apps/ozzmosis/data/vault/rodobens-wealth/os/OS-2026-GENESIS-STABILITY-024.md
---

# OS-2026-GENESIS-STABILITY-024

## Objetivo
Eliminar os 🔴 criticos do Product Maturity Report para:
- apps/butantan-shield (contract + survival)
- apps/aurora-conductor-service (contract)
- libs/elysian-brain (core + contract)

## Ordem de execucao
1) Step 1 — Contratos (Shield + Conductor-Service)
2) Step 2 — Shield survival + enforcement fail-closed no alvaro-core
3) Step 3 — Rodobens ingest (PDF->MD) + core minimo no elysian-brain

## Criterios de aceite (matematicos)
- stable_contract >= 🟡 para Shield + Conductor-Service + Brain
- butantan-shield survival_tests = 🟢
- elysian-brain sai do 🔴 em core com leitura deterministica do Vault index
- evidencias versionadas em Vault _runs/

## Evidencias (Vault)
- apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-024/entrypoints_check.json
- apps/ozzmosis/data/vault/rodobens-wealth/_runs/contract-public-024/contract_overlay.json
- apps/ozzmosis/data/vault/rodobens-wealth/_runs/remediation-shield-024/survival_check.json
- apps/ozzmosis/data/vault/rodobens-wealth/_runs/rodobens-ingest-024/run_manifest.json
