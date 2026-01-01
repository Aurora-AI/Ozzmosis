# RBAC Spec (Clean-Room)

This document is the Single Source Of Truth (SSOT) for the RBAC model to be implemented in Aurora (clean-room inspired by Corteza).

## Concepts

- Principal: an actor in the system. Types: `User`, `Service`.
- Role: named collection of permissions. Example: `sales_rep`, `account_admin`.
- Permission: atomic right expressed as `resource:action` (e.g. `invoice:read`, `invoice:approve`).
- Resource: logical resource (e.g. `invoice`, `conversation`, `channel`, `user`).
- Action: CRUD-like verbs or domain actions (create, read, update, delete, approve, assign).
- Scope: tenant/organization context. Permissions are evaluated within `scope` when applicable.
- Policy: allow/deny rule; system uses *deny-wins*.
- Assignment: binding between Principal and Role (optionally scoped).
- Inheritance: optional — roles may include other roles; must be explicit if used.

## Core rules

- Determinism: same inputs (principal, action, resource, scope) → same decision.
- Deny wins: any explicit deny matching the request yields `DENY` even if allows exist.
- Least privilege: roles should be narrow and composable.
- Auditing: every administrative decision and every `DENY` must be logged to `audit_log`.
- Naming: permissions as `resource:action` and roles lowercase with underscores.

## Data model (high level)

- `roles(id, name, description)`
- `permissions(id, name, resource, action, description)`
- `role_permissions(role_id, permission_id, effect)` — `effect` in {`allow`,`deny`}.
- `principal_roles(principal_id, role_id, scope)`
- `resource_policies` (optional ABAC-lite) for attribute-based checks.
- `audit_log(actor_id, actor_type, action, resource, decision, reason, timestamp, correlation_id)`

## Evaluation semantics

1. Collect principal's roles for given scope.
2. Expand role inheritance (if enabled).
3. Collect all `role_permissions` for those roles.
4. Find permissions matching `resource:action` (supports wildcard `resource:*`).
5. If any matching rule has `deny` → Decision=DENY (audit). Else if any `allow` → ALLOW. Else → DENY (default deny).

## Auditing

- Log entries must include `actor`, `action`, `resource`, `decision`, `matched_rules` and `correlation_id`.

## Notes

- This spec purposefully avoids copying Corteza implementation details. It defines the contract and semantics for a clean reimplementation.
