from __future__ import annotations

import json
from typing import Any, Optional

from sqlalchemy.orm import Session

from src.models.audit import AuditLog


def write_audit_log(
    session: Session,
    *,
    actor_subject: str,
    action: str,
    resource_type: Optional[str],
    resource_id: Optional[str],
    payload: dict[str, Any],
) -> AuditLog:
    entry = AuditLog(
        scope_id=payload.get("scope_id"),
        event_type=str(action),
        actor_id=str(actor_subject),
        resource_type=resource_type,
        resource_id=resource_id,
        payload_json=json.dumps(payload, ensure_ascii=False, sort_keys=True),
    )
    session.add(entry)
    session.flush()
    return entry
