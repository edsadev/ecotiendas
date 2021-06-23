"""empty message

Revision ID: 81ca4f3ff03d
Revises: 
Create Date: 2021-06-22 14:53:26.578227

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '81ca4f3ff03d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ecoAdmins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cedula', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('apellido', sa.String(), nullable=True),
    sa.Column('direccion', sa.String(), nullable=True),
    sa.Column('genero', sa.String(), nullable=False),
    sa.Column('correo', sa.String(), nullable=False),
    sa.Column('telefono', sa.Integer(), nullable=True),
    sa.Column('usuario', sa.String(), nullable=False),
    sa.Column('contraseña', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ecoAmigos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cedula', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('apellido', sa.String(), nullable=True),
    sa.Column('direccion', sa.String(), nullable=True),
    sa.Column('genero', sa.String(), nullable=False),
    sa.Column('correo', sa.String(), nullable=False),
    sa.Column('telefono', sa.Integer(), nullable=True),
    sa.Column('usuario', sa.String(), nullable=False),
    sa.Column('contraseña', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ecoTiendas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('latitud', sa.String(), nullable=False),
    sa.Column('longitud', sa.String(), nullable=False),
    sa.Column('capacidad_m3', sa.Integer(), nullable=True),
    sa.Column('capacidad_kg', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sectores',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('zipCode', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('sectores')
    op.drop_table('ecoTiendas')
    op.drop_table('ecoAmigos')
    op.drop_table('ecoAdmins')
    # ### end Alembic commands ###
