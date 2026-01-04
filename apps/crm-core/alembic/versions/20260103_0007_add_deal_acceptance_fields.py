"""add deal acceptance fields

Revision ID: 20260103_0007
Revises: 20260103_0006
Create Date: 2026-01-03

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260103_0007"
down_revision = "20260103_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    jsonb = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")

    op.add_column("crm_deals", sa.Column("accepted_tier", sa.String(), nullable=True))
    op.add_column("crm_deals", sa.Column("accepted_proposal_data", jsonb, nullable=True))
    op.add_column("crm_deals", sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("crm_deals", sa.Column("client_fingerprint", sa.String(), nullable=True))
    op.add_column(
        "crm_deals",
        sa.Column("acceptance_version", sa.Integer(), nullable=False, server_default=sa.text("0")),
    )
    op.alter_column("crm_deals", "acceptance_version", server_default=None)


def downgrade() -> None:
    op.drop_column("crm_deals", "acceptance_version")
    op.drop_column("crm_deals", "client_fingerprint")
    op.drop_column("crm_deals", "accepted_at")
    op.drop_column("crm_deals", "accepted_proposal_data")
    op.drop_column("crm_deals", "accepted_tier")

