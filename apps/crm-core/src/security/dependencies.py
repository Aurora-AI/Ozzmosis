from __future__ import annotations

import os
from typing import Callable, Optional, Set

from fastapi import Depends, Header, HTTPException, status

from .policy import PERM_RBAC_ADMIN, normalize_permission


def get_current_subject(x_subject: Optional[str] = Header(default=None, alias="X-Subject")) -> str:
    subject = (x_subject or "").strip()
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing subject")
    return subject


def _parse_bootstrap_subjects() -> Set[str]:
    raw = os.getenv("AURORA_RBAC_BOOTSTRAP_SUBJECTS", "")
    return {s.strip() for s in raw.split(",") if s.strip()}


def _bootstrap_allows(subject: str, permission: str) -> bool:
    # Bootstrap rule (explicit): an allowlist of subjects may receive RBAC admin.
    # This is intentionally narrow and deny-by-default for everything else.
    subjects = _parse_bootstrap_subjects()
    return subject in subjects and normalize_permission(permission) == PERM_RBAC_ADMIN


def require_permission(permission: str) -> Callable[..., str]:
    required = normalize_permission(permission)

    def _dependency(subject: str = Depends(get_current_subject)) -> str:
        # TODO(DB): Resolve subject roles/permissions from database when DB session dependency exists.
        if _bootstrap_allows(subject, required):
            return subject

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")

    return _dependency
