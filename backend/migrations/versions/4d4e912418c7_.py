"""empty message

Revision ID: 4d4e912418c7
Revises: 1ff351ead5a7
Create Date: 2021-12-27 14:59:19.291815

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4d4e912418c7'
down_revision = '1ff351ead5a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ecopicker',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cedula', sa.String(), nullable=False),
    sa.Column('fecha_nacimiento', sa.String(), nullable=True),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('apellido', sa.String(), nullable=True),
    sa.Column('direccion', sa.String(), nullable=True),
    sa.Column('foto', sa.LargeBinary(), nullable=True),
    sa.Column('genero', sa.String(), nullable=False),
    sa.Column('correo', sa.String(), nullable=False),
    sa.Column('telefono', sa.String(), nullable=True),
    sa.Column('zonal_id', sa.Integer(), nullable=True),
    sa.Column('usuario_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
    sa.ForeignKeyConstraint(['zonal_id'], ['zonales.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('bodegueros')
    op.add_column('ecoTiendas', sa.Column('ecopicker_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'ecoTiendas', 'ecopicker', ['ecopicker_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'ecoTiendas', type_='foreignkey')
    op.drop_column('ecoTiendas', 'ecopicker_id')
    op.create_table('bodegueros',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('cedula', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('fecha_nacimiento', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('nombre', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('fecha_registro', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('apellido', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('direccion', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('foto', postgresql.BYTEA(), autoincrement=False, nullable=True),
    sa.Column('genero', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('correo', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('telefono', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('zonal_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('sector_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('usuario_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['sector_id'], ['sectores.id'], name='bodegueros_sector_id_fkey'),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], name='bodegueros_usuario_id_fkey'),
    sa.ForeignKeyConstraint(['zonal_id'], ['zonales.id'], name='bodegueros_zonal_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='bodegueros_pkey')
    )
    op.drop_table('ecopicker')
    # ### end Alembic commands ###
