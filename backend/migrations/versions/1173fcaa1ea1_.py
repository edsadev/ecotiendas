"""empty message

Revision ID: 1173fcaa1ea1
Revises: 75d04284bcb9
Create Date: 2021-12-28 12:23:48.489025

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1173fcaa1ea1'
down_revision = '75d04284bcb9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('pedidos_ecopicker_id_fkey', 'pedidos', type_='foreignkey')
    op.create_foreign_key(None, 'pedidos', 'ecopicker', ['ecopicker_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'pedidos', type_='foreignkey')
    op.create_foreign_key('pedidos_ecopicker_id_fkey', 'pedidos', 'ecoAmigos', ['ecopicker_id'], ['id'])
    # ### end Alembic commands ###
