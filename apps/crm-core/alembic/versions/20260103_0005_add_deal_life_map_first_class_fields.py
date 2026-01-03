"""add deal life_map first class fields

Revision ID: 20260103_0005
Revises: 20260103_0004
Create Date: 2026-01-03

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260103_0005"
down_revision = "20260103_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    jsonb = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")

    op.add_column("crm_deals", sa.Column("life_map", jsonb, nullable=True))
    op.add_column(
        "crm_deals",
        sa.Column("life_map_version", sa.Integer(), nullable=False, server_default=sa.text("0")),
    )
    op.add_column("crm_deals", sa.Column("life_map_updated_at", sa.DateTime(timezone=True), nullable=True))
    op.alter_column("crm_deals", "life_map_version", server_default=None)


def downgrade() -> None:
    op.drop_column("crm_deals", "life_map_updated_at")
    op.drop_column("crm_deals", "life_map_version")
    op.drop_column("crm_deals", "life_map")

