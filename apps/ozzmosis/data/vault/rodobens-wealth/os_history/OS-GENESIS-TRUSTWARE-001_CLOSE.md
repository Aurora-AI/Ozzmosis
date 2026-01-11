# OS-GENESIS-TRUSTWARE-001 — CLOSE

## Summary
- Added Genesis-owned Trustware policy v0 (YAML) with PyYAML loader and deterministic evaluation.
- Enforced policy in decide engine (policy.mode=error blocks deterministically).
- Added survival tests for policy enforcement and determinism.

## Evidence
- Policy file: apps/alvaro-core/src/alvaro/genesis/policies/genesis.v0.yaml
- Decision JSON includes: policy_version, policy_mode, policy_rule_ids_triggered, reasons (reason codes).
- Deterministic: same input + same policy => same verdict and stable fields.

## Commits
- WP1: 70d6db0df9bcf1a75dfa584752573c47ea7d8049
- WP2: f9486e4bd16d26dc0b8a12d26a9bc5ba42668c51
- WP3: 1aa8bbc5cf20e95bcecc7a40721f03990a42b35e

## Checks
- npm run repo:check (PASS)
