from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Role(Base):
    __tablename__ = "rbac_roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow)


class Permission(Base):
    __tablename__ = "rbac_permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    resource: Mapped[str] = mapped_column(String(128), index=True)
    action: Mapped[str] = mapped_column(String(128), index=True)
    description: Mapped[Optional[str]] = mapped_column(String(256))

    __table_args__ = (UniqueConstraint("resource", "action", name="uq_rbac_perm_resource_action"),)


class RolePermission(Base):
    __tablename__ = "rbac_role_permissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("rbac_roles.id", ondelete="CASCADE"), index=True)
    permission_id: Mapped[int] = mapped_column(ForeignKey("rbac_permissions.id", ondelete="CASCADE"), index=True)
    effect: Mapped[str] = mapped_column(String(16), default="allow")

    __table_args__ = (UniqueConstraint("role_id", "permission_id", name="uq_role_perm"),)


class SubjectRole(Base):
    __tablename__ = "rbac_subject_roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    subject_id: Mapped[str] = mapped_column(String(128), index=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("rbac_roles.id", ondelete="CASCADE"), index=True)
    scope_id: Mapped[Optional[str]] = mapped_column(String(128), index=True)

    __table_args__ = (UniqueConstraint("subject_id", "role_id", "scope_id", name="uq_subject_role_scope"),)
