"""create crm_ingest_events

Revision ID: 20260103_0003
Revises: 20260103_0002
Create Date: 2026-01-03

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260103_0003"
down_revision = "20260103_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    jsonb = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")

    ingest_status = sa.Enum("RECEIVED", "LINKED", "ERROR", name="ingeststatus")

    op.create_table(
        "crm_ingest_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column("sender_id", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata", jsonb, nullable=False, server_default=sa.text("'{}'")),
        sa.Column("contact_id", sa.String(), sa.ForeignKey("crm_contacts.id"), nullable=True),
        sa.Column("status", ingest_status, nullable=False, server_default=sa.text("'RECEIVED'")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
    )
    op.create_index(op.f("ix_crm_ingest_events_id"), "crm_ingest_events", ["id"], unique=False)
    op.create_index(op.f("ix_crm_ingest_events_source"), "crm_ingest_events", ["source"], unique=False)
    op.create_index(op.f("ix_crm_ingest_events_sender_id"), "crm_ingest_events", ["sender_id"], unique=False)
    op.create_index(op.f("ix_crm_ingest_events_contact_id"), "crm_ingest_events", ["contact_id"], unique=False)
    op.create_index(op.f("ix_crm_ingest_events_status"), "crm_ingest_events", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_crm_ingest_events_status"), table_name="crm_ingest_events")
    op.drop_index(op.f("ix_crm_ingest_events_contact_id"), table_name="crm_ingest_events")
    op.drop_index(op.f("ix_crm_ingest_events_sender_id"), table_name="crm_ingest_events")
    op.drop_index(op.f("ix_crm_ingest_events_source"), table_name="crm_ingest_events")
    op.drop_index(op.f("ix_crm_ingest_events_id"), table_name="crm_ingest_events")
    op.drop_table("crm_ingest_events")
    op.execute("DROP TYPE IF EXISTS ingeststatus")

