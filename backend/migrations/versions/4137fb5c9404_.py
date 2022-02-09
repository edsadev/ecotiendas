"""empty message

Revision ID: 4137fb5c9404
Revises: 1173fcaa1ea1
Create Date: 2021-12-31 14:43:18.284394

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4137fb5c9404'
down_revision = '1173fcaa1ea1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('tickets', 'total_kg',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True)
    op.alter_column('tickets', 'total_m3',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('tickets', 'total_m3',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False)
    op.alter_column('tickets', 'total_kg',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False)
    # ### end Alembic commands ###