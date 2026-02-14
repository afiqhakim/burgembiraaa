"""order status flow

Revision ID: c8f81710d5b8
Revises: a57d10c27373
Create Date: 2026-02-14 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8f81710d5b8'
down_revision: Union[str, Sequence[str], None] = 'a57d10c27373'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('orders', sa.Column('shipped_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('orders', sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True))



def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('orders', 'delivered_at')
    op.drop_column('orders', 'shipped_at')
