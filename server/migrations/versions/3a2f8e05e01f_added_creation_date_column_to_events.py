"""added creation date column to Events

Revision ID: 3a2f8e05e01f
Revises: 1f676e3fe1d7
Create Date: 2024-12-31 18:35:43.602570

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3a2f8e05e01f'
down_revision = '1f676e3fe1d7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('creation_date', sa.Date(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_column('creation_date')

    # ### end Alembic commands ###
