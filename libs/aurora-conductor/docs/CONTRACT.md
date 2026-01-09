# Contract — Aurora Conductor (lib)

## Purpose
Orquestrar eventos soberanos com politica fail-closed e registro deterministico.

## Public API
- `Conductor.handle(event: ConductorEvent): Promise<OrchestrationResult>`
- Types: `ConductorEvent`, `PolicyVerdict`, `OrchestrationResult`
- Ports: `ShieldPort`, `ChronosPort`, `BrainPort`

## Failure Modes (Fail-Closed)
- Se `ShieldPort.validate` retorna `allowed=false`, o resultado e `REJECTED`.
- `reason_code` propaga o motivo da rejeicao.

## Versioning
- Fonte: `libs/aurora-conductor/package.json`
