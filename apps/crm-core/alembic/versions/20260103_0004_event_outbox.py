"""create crm_event_outbox

Revision ID: 20260103_0004
Revises: 20260103_0003
Create Date: 2026-01-03

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260103_0004"
down_revision = "20260103_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    jsonb = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")

    outbox_status = sa.Enum("PENDING", "PROCESSING", "COMPLETED", "FAILED", name="outboxstatus")

    op.create_table(
        "crm_event_outbox",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("event_type", sa.String(), nullable=False),
        sa.Column("payload", jsonb, nullable=False),
        sa.Column("status", outbox_status, nullable=False, server_default=sa.text("'PENDING'")),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("last_error", sa.Text(), nullable=True),
        sa.Column("trace_id", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("next_retry_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_index(op.f("ix_crm_event_outbox_id"), "crm_event_outbox", ["id"], unique=False)
    op.create_index(op.f("ix_crm_event_outbox_event_type"), "crm_event_outbox", ["event_type"], unique=False)
    op.create_index(op.f("ix_crm_event_outbox_trace_id"), "crm_event_outbox", ["trace_id"], unique=False)
    op.create_index(op.f("ix_crm_event_outbox_status"), "crm_event_outbox", ["status"], unique=False)
    op.create_index("ix_crm_event_outbox_next_retry_at", "crm_event_outbox", ["next_retry_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_crm_event_outbox_next_retry_at", table_name="crm_event_outbox")
    op.drop_index(op.f("ix_crm_event_outbox_status"), table_name="crm_event_outbox")
    op.drop_index(op.f("ix_crm_event_outbox_trace_id"), table_name="crm_event_outbox")
    op.drop_index(op.f("ix_crm_event_outbox_event_type"), table_name="crm_event_outbox")
    op.drop_index(op.f("ix_crm_event_outbox_id"), table_name="crm_event_outbox")
    op.drop_table("crm_event_outbox")
    op.execute("DROP TYPE IF EXISTS outboxstatus")

