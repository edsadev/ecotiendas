"""empty message

Revision ID: 1c8e25869465
Revises: 72e3754d2fbb
Create Date: 2021-07-12 16:36:47.440983

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1c8e25869465'
down_revision = '72e3754d2fbb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('detalle_ticket', 'numero_semana',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.add_column('ecoTiendas', sa.Column('nombre', sa.String(), nullable=True))
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'zonal_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('tickets', 'zonal_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('ecoTiendas', 'nombre')
    op.alter_column('detalle_ticket', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'numero_semana',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###
