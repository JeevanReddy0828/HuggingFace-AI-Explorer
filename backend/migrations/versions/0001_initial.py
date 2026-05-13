"""initial

Revision ID: 0001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "bookmarks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("model_id", sa.String(256), nullable=False, unique=True, index=True),
        sa.Column("model_name", sa.String(256), nullable=False),
        sa.Column("author", sa.String(128)),
        sa.Column("pipeline_tag", sa.String(64)),
        sa.Column("downloads", sa.BigInteger(), default=0),
        sa.Column("likes", sa.Integer(), default=0),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )


def downgrade() -> None:
    op.drop_table("bookmarks")
