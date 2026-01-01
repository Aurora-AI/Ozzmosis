# RBAC Decisions

This document records fixed design decisions for the clean-room RBAC implementation.

1. Hierarchy: Roles do NOT implicitly inherit other roles by default. If inheritance is needed it will be explicit via `role_includes` mapping.
2. Multi-tenant: model is tenant-aware. `principal_roles` include an optional `scope` field (tenant id). Global roles allowed when `scope` is null.
3. Permission granularity: use `resource:action` naming; support wildcard `resource:*` and `*:action` for coarse-grained rules.
4. Deny semantics: `deny` always wins. Explicit deny must be used sparingly and audited.
5. Audit: every administrative change and every `DENY` decision writes to `audit_log` with correlation id.
6. Performance: authorization engine optimized for in-memory lookup; caches allowed but must expire on role/perm changes.
7. Determinism & testing: pure functions for `authorize()` with injected stores for testability.
