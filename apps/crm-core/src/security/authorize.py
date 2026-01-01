from dataclasses import asdict
from enum import Enum
import importlib.util
import pathlib
from typing import Any, Dict, Optional


_MODELS_PATH = pathlib.Path(__file__).resolve().parents[1] / "models" / "security.py"
_spec = importlib.util.spec_from_file_location("crm_core_models_security", _MODELS_PATH)
if _spec is None or _spec.loader is None:
    raise ImportError(f"Unable to load RBAC models from {_MODELS_PATH}")
models = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(models)


class RBACStore:
    def __init__(
        self,
        roles=None,
        permissions=None,
        role_permissions=None,
        principal_roles=None,
        audit_log=None,
    ):
        self.roles = roles if roles is not None else models.ROLES
        self.permissions = permissions if permissions is not None else models.PERMISSIONS
        self.role_permissions = role_permissions if role_permissions is not None else models.ROLE_PERMISSIONS
        self.principal_roles = principal_roles if principal_roles is not None else models.PRINCIPAL_ROLES
        self.audit_log = audit_log if audit_log is not None else models.AUDIT_LOG


class Decision(Enum):
    ALLOW = "ALLOW"
    DENY = "DENY"


def _matches_permission(perm: Any, resource: str, action: str) -> bool:
    # support exact and wildcard matches: resource == perm.resource or perm.resource == '*'
    if perm.resource != '*' and perm.resource != resource:
        return False
    if perm.action != '*' and perm.action != action:
        return False
    return True


def authorize(
    principal_id: str,
    action: str,
    resource: str,
    scope: Optional[str] = None,
    correlation_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Evaluate authorization for principal on resource/action within optional scope.
    Returns dict: {decision: Decision, reason: str, matched: list}
    """
    store = RBACStore()
    matched_rules = []
    # 1) collect roles for principal (respect scope: exact match or global role with scope None)
    roles = [
        pr.role_id
        for pr in store.principal_roles
        if pr.principal_id == principal_id and (pr.scope == scope or pr.scope is None)
    ]

    # 2) collect role_permissions for those roles
    for rp in store.role_permissions:
        if rp.role_id in roles:
            perm = store.permissions.get(rp.permission_id)
            if not perm:
                continue
            if _matches_permission(perm, resource, action):
                matched_rules.append({
                    'role_id': rp.role_id,
                    'permission_id': rp.permission_id,
                    'effect': rp.effect,
                    'perm': asdict(perm)
                })

    # 3) deny wins
    for r in matched_rules:
        if r['effect'].lower() == 'deny':
            models.log_audit(models.AuditLogEntry(
                actor_id=principal_id,
                actor_type='principal',
                action=f"{resource}:{action}",
                resource=resource,
                decision=Decision.DENY.value,
                matched_rules=matched_rules,
                reason='matched deny rule',
                correlation_id=correlation_id,
            ))
            return {'decision': Decision.DENY, 'reason': 'matched deny', 'matched': matched_rules}

    # 4) any allow -> ALLOW
    for r in matched_rules:
        if r['effect'].lower() == 'allow':
            models.log_audit(models.AuditLogEntry(
                actor_id=principal_id,
                actor_type='principal',
                action=f"{resource}:{action}",
                resource=resource,
                decision=Decision.ALLOW.value,
                matched_rules=matched_rules,
                reason='matched allow rule',
                correlation_id=correlation_id,
            ))
            return {'decision': Decision.ALLOW, 'reason': 'matched allow', 'matched': matched_rules}

    # 5) default deny
    models.log_audit(models.AuditLogEntry(
        actor_id=principal_id,
        actor_type='principal',
        action=f"{resource}:{action}",
        resource=resource,
        decision=Decision.DENY.value,
        matched_rules=matched_rules,
        reason='no matching rule (default deny)',
        correlation_id=correlation_id,
    ))
    return {'decision': Decision.DENY, 'reason': 'no match', 'matched': matched_rules}


def explain(result: Dict[str, Any]) -> Dict[str, Any]:
    # lightweight wrapper to expose matched rules and reason
    return {
        'decision': result['decision'].value if isinstance(result['decision'], Decision) else str(result['decision']),
        'reason': result.get('reason'),
        'matched': result.get('matched', [])
    }
