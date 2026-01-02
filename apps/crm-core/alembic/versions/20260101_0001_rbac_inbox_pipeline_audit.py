"""rbac + inbox + pipeline + audit

Revision ID: 20260101_0001
Revises:
Create Date: 2026-01-01

"""

from alembic import op
import sqlalchemy as sa


revision = "20260101_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "rbac_roles",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("description", sa.String(length=256), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_rbac_roles_name", "rbac_roles", ["name"], unique=True)

    op.create_table(
        "rbac_permissions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("resource", sa.String(length=128), nullable=False),
        sa.Column("action", sa.String(length=128), nullable=False),
        sa.Column("description", sa.String(length=256), nullable=True),
        sa.UniqueConstraint("resource", "action", name="uq_rbac_perm_resource_action"),
    )
    op.create_index("ix_rbac_permissions_resource", "rbac_permissions", ["resource"], unique=False)
    op.create_index("ix_rbac_permissions_action", "rbac_permissions", ["action"], unique=False)

    op.create_table(
        "rbac_role_permissions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("rbac_roles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("permission_id", sa.Integer(), sa.ForeignKey("rbac_permissions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("effect", sa.String(length=16), nullable=False, server_default="allow"),
        sa.UniqueConstraint("role_id", "permission_id", name="uq_role_perm"),
    )
    op.create_index("ix_rbac_role_permissions_role_id", "rbac_role_permissions", ["role_id"], unique=False)
    op.create_index("ix_rbac_role_permissions_permission_id", "rbac_role_permissions", ["permission_id"], unique=False)

    op.create_table(
        "rbac_subject_roles",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("subject_id", sa.String(length=128), nullable=False),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("rbac_roles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("scope_id", sa.String(length=128), nullable=True),
        sa.UniqueConstraint("subject_id", "role_id", "scope_id", name="uq_subject_role_scope"),
    )
    op.create_index("ix_rbac_subject_roles_subject_id", "rbac_subject_roles", ["subject_id"], unique=False)
    op.create_index("ix_rbac_subject_roles_role_id", "rbac_subject_roles", ["role_id"], unique=False)
    op.create_index("ix_rbac_subject_roles_scope_id", "rbac_subject_roles", ["scope_id"], unique=False)

    op.create_table(
        "inbox_conversations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("scope_id", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("subject", sa.String(length=256), nullable=True),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column("external_ref", sa.String(length=256), nullable=True),
        sa.Column("last_message_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_inbox_conversations_scope_id", "inbox_conversations", ["scope_id"], unique=False)
    op.create_index("ix_inbox_conversations_status", "inbox_conversations", ["status"], unique=False)
    op.create_index("ix_inbox_conversations_source", "inbox_conversations", ["source"], unique=False)
    op.create_index("ix_inbox_conversations_external_ref", "inbox_conversations", ["external_ref"], unique=False)
    op.create_index("ix_inbox_conversations_created_at", "inbox_conversations", ["created_at"], unique=False)
    op.create_index("ix_inbox_conversations_updated_at", "inbox_conversations", ["updated_at"], unique=False)
    op.create_index("ix_inbox_conversations_last_message_at", "inbox_conversations", ["last_message_at"], unique=False)

    op.create_table(
        "inbox_messages",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("scope_id", sa.String(length=128), nullable=False),
        sa.Column("conversation_id", sa.Integer(), sa.ForeignKey("inbox_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("direction", sa.String(length=16), nullable=False),
        sa.Column("author_type", sa.String(length=16), nullable=False),
        sa.Column("author_id", sa.String(length=128), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("external_ref", sa.String(length=256), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_inbox_messages_scope_id", "inbox_messages", ["scope_id"], unique=False)
    op.create_index("ix_inbox_messages_conversation_id", "inbox_messages", ["conversation_id"], unique=False)
    op.create_index("ix_inbox_messages_created_at", "inbox_messages", ["created_at"], unique=False)

    op.create_table(
        "pipeline_deals",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("scope_id", sa.String(length=128), nullable=False),
        sa.Column("title", sa.String(length=256), nullable=False),
        sa.Column("customer_org_id", sa.String(length=128), nullable=True),
        sa.Column("stage", sa.String(length=32), nullable=False),
        sa.Column("value_estimate", sa.Numeric(18, 2), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=True),
        sa.Column("owner_subject_id", sa.String(length=128), nullable=True),
        sa.Column("metadata_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_pipeline_deals_scope_id", "pipeline_deals", ["scope_id"], unique=False)
    op.create_index("ix_pipeline_deals_stage", "pipeline_deals", ["stage"], unique=False)
    op.create_index("ix_pipeline_deals_created_at", "pipeline_deals", ["created_at"], unique=False)
    op.create_index("ix_pipeline_deals_updated_at", "pipeline_deals", ["updated_at"], unique=False)

    op.create_table(
        "pipeline_approvals",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("scope_id", sa.String(length=128), nullable=False),
        sa.Column("deal_id", sa.Integer(), sa.ForeignKey("pipeline_deals.id", ondelete="CASCADE"), nullable=False),
        sa.Column("approval_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("requested_by", sa.String(length=128), nullable=False),
        sa.Column("requested_at", sa.DateTime(), nullable=False),
        sa.Column("decided_by", sa.String(length=128), nullable=True),
        sa.Column("decided_at", sa.DateTime(), nullable=True),
        sa.Column("reason", sa.String(length=256), nullable=True),
    )
    op.create_index("ix_pipeline_approvals_scope_id", "pipeline_approvals", ["scope_id"], unique=False)
    op.create_index("ix_pipeline_approvals_deal_id", "pipeline_approvals", ["deal_id"], unique=False)
    op.create_index("ix_pipeline_approvals_status", "pipeline_approvals", ["status"], unique=False)
    op.create_index("ix_pipeline_approvals_requested_at", "pipeline_approvals", ["requested_at"], unique=False)

    op.create_table(
        "audit_log",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("scope_id", sa.String(length=128), nullable=True),
        sa.Column("event_type", sa.String(length=128), nullable=False),
        sa.Column("actor_id", sa.String(length=128), nullable=False),
        sa.Column("resource_type", sa.String(length=128), nullable=True),
        sa.Column("resource_id", sa.String(length=128), nullable=True),
        sa.Column("decision", sa.String(length=16), nullable=True),
        sa.Column("reason", sa.String(length=256), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_audit_log_scope_id", "audit_log", ["scope_id"], unique=False)
    op.create_index("ix_audit_log_event_type", "audit_log", ["event_type"], unique=False)
    op.create_index("ix_audit_log_actor_id", "audit_log", ["actor_id"], unique=False)
    op.create_index("ix_audit_log_resource_type", "audit_log", ["resource_type"], unique=False)
    op.create_index("ix_audit_log_resource_id", "audit_log", ["resource_id"], unique=False)
    op.create_index("ix_audit_log_created_at", "audit_log", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_table("audit_log")
    op.drop_table("pipeline_approvals")
    op.drop_table("pipeline_deals")
    op.drop_table("inbox_messages")
    op.drop_table("inbox_conversations")
    op.drop_table("rbac_subject_roles")
    op.drop_table("rbac_role_permissions")
    op.drop_table("rbac_permissions")
    op.drop_table("rbac_roles")
