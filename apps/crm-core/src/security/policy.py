from __future__ import annotations

from typing import Final


def normalize_permission(permission: str) -> str:
    if not isinstance(permission, str):
        raise TypeError("permission must be a string")

    value = permission.strip().lower().replace(" ", "")
    if ":" not in value:
        raise ValueError("permission must be in the form 'resource:action'")

    resource, action = value.split(":", 1)
    if not resource or not action:
        raise ValueError("permission must be in the form 'resource:action'")

    return f"{resource}:{action}"


PERM_RBAC_ADMIN: Final[str] = normalize_permission("rbac:admin")

PERM_INBOX_READ: Final[str] = normalize_permission("inbox:read")
PERM_INBOX_WRITE: Final[str] = normalize_permission("inbox:write")

PERM_PIPELINE_READ: Final[str] = normalize_permission("pipeline:read")
PERM_PIPELINE_WRITE: Final[str] = normalize_permission("pipeline:write")
PERM_PIPELINE_APPROVE: Final[str] = normalize_permission("pipeline:approve")


ALL_PERMISSIONS: Final[tuple[str, ...]] = (
    PERM_RBAC_ADMIN,
    PERM_INBOX_READ,
    PERM_INBOX_WRITE,
    PERM_PIPELINE_READ,
    PERM_PIPELINE_WRITE,
    PERM_PIPELINE_APPROVE,
)
