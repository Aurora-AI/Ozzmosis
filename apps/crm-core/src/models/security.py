from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class Role:
    id: str
    name: str
    description: Optional[str] = None


@dataclass
class Permission:
    id: str
    resource: str
    action: str
    description: Optional[str] = None


@dataclass
class RolePermission:
    role_id: str
    permission_id: str
    effect: str  # 'allow' or 'deny'


@dataclass
class PrincipalRole:
    principal_id: str
    role_id: str
    scope: Optional[str] = None


@dataclass
class AuditLogEntry:
    actor_id: str
    actor_type: str
    action: str
    resource: str
    decision: str
    matched_rules: List[Dict[str, Any]] = field(default_factory=list)
    reason: Optional[str] = None
    correlation_id: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)


# In-memory stores
ROLES: List[Role] = []
PERMISSIONS: Dict[str, Permission] = {}
ROLE_PERMISSIONS: List[RolePermission] = []
PRINCIPAL_ROLES: List[PrincipalRole] = []
AUDIT_LOG: List[AuditLogEntry] = []


def add_role(role: Role):
    ROLES.append(role)


def add_permission(permission: Permission):
    PERMISSIONS[permission.id] = permission


def assign_permission(role_id: str, permission_id: str, effect: str = 'allow'):
    ROLE_PERMISSIONS.append(RolePermission(role_id=role_id, permission_id=permission_id, effect=effect))


def assign_role(principal_id: str, role_id: str, scope: Optional[str] = None):
    PRINCIPAL_ROLES.append(PrincipalRole(principal_id=principal_id, role_id=role_id, scope=scope))


def log_audit(entry: AuditLogEntry):
    AUDIT_LOG.append(entry)
