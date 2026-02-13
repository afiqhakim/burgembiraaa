"""add profile_picture column to users

Revision ID: 4010da206518
Revises: 3009da206517
Create Date: 2026-02-13 14:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4010da206518'
down_revision: Union[str, Sequence[str], None] = '3009da206517'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('profile_picture', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'profile_picture')
