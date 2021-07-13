"""empty message

Revision ID: 750a8376e7ff
Revises: 7f30b955308b
Create Date: 2021-07-07 17:43:09.569201

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '750a8376e7ff'
down_revision = '7f30b955308b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('detalle_ticket', 'numero_semana',
               existing_type=sa.VARCHAR())
    op.alter_column('detalle_ticket', 'mes',
               existing_type=sa.VARCHAR())
    op.alter_column('detalle_ticket', 'año',
               existing_type=sa.VARCHAR())
    op.drop_constraint('ecoAdmins_sector_id_fkey', 'ecoAdmins', type_='foreignkey')
    op.drop_column('ecoAdmins', 'sector_id')
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR())
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR())
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.add_column('ecoAdmins', sa.Column('sector_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('ecoAdmins_sector_id_fkey', 'ecoAdmins', 'sectores', ['sector_id'], ['id'])
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