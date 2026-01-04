"""contacts + deals

Revision ID: 20260103_0002
Revises: 20260101_0001
Create Date: 2026-01-03

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "20260103_0002"
down_revision = "20260101_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    jsonb = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")

    op.create_table(
        "crm_contacts",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("whatsapp_id", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("cpf_cnpj", sa.String(), nullable=True),
        sa.Column("ai_memory", jsonb, nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
    )
    op.create_index(op.f("ix_crm_contacts_id"), "crm_contacts", ["id"], unique=False)
    op.create_index(op.f("ix_crm_contacts_whatsapp_id"), "crm_contacts", ["whatsapp_id"], unique=True)
    op.create_index(op.f("ix_crm_contacts_email"), "crm_contacts", ["email"], unique=True)
    op.create_index("ix_crm_contacts_cpf_cnpj", "crm_contacts", ["cpf_cnpj"], unique=True)

    dealstage = sa.Enum(
        "NEW",
        "DISCOVERY",
        "QUALIFIED",
        "PROPOSAL",
        "NEGOTIATION",
        "CLOSED_WON",
        "CLOSED_LOST",
        "CHURN_ALERT",
        name="dealstage",
    )

    op.create_table(
        "crm_deals",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("contact_id", sa.String(), sa.ForeignKey("crm_contacts.id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("pipeline_type", sa.String(), nullable=True, server_default=sa.text("'rodobens_wealth'")),
        sa.Column("stage", dealstage, nullable=False, server_default=sa.text("'NEW'")),
        sa.Column("amount", sa.Float(), nullable=True, server_default=sa.text("0.0")),
        sa.Column("expected_close_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("srv_matrix", jsonb, nullable=False, server_default=sa.text("'{}'")),
        sa.Column("product_data", jsonb, nullable=False, server_default=sa.text("'{}'")),
        sa.Column("safety_score", sa.Integer(), nullable=True, server_default=sa.text("100")),
        sa.Column("compliance_flags", jsonb, nullable=False, server_default=sa.text("'[]'")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f("ix_crm_deals_id"), "crm_deals", ["id"], unique=False)
    op.create_index(op.f("ix_crm_deals_contact_id"), "crm_deals", ["contact_id"], unique=False)
    op.create_index(op.f("ix_crm_deals_pipeline_type"), "crm_deals", ["pipeline_type"], unique=False)
    op.create_index(op.f("ix_crm_deals_stage"), "crm_deals", ["stage"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_crm_deals_stage"), table_name="crm_deals")
    op.drop_index(op.f("ix_crm_deals_pipeline_type"), table_name="crm_deals")
    op.drop_index(op.f("ix_crm_deals_contact_id"), table_name="crm_deals")
    op.drop_index(op.f("ix_crm_deals_id"), table_name="crm_deals")
    op.drop_table("crm_deals")
    op.execute("DROP TYPE IF EXISTS dealstage")

    op.drop_index("ix_crm_contacts_cpf_cnpj", table_name="crm_contacts")
    op.drop_index(op.f("ix_crm_contacts_email"), table_name="crm_contacts")
    op.drop_index(op.f("ix_crm_contacts_whatsapp_id"), table_name="crm_contacts")
    op.drop_index(op.f("ix_crm_contacts_id"), table_name="crm_contacts")
    op.drop_table("crm_contacts")
