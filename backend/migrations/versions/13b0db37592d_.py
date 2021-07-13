"""empty message

Revision ID: 13b0db37592d
Revises: 2e26796dbaa8
Create Date: 2021-07-07 16:44:32.488857

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '13b0db37592d'
down_revision = '2e26796dbaa8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tipoProductos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=False),
    sa.Column('detalle', sa.String(), nullable=False),
    sa.Column('codigo', sa.String(), nullable=False),
    sa.Column('ecopuntos', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('productos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=False),
    sa.Column('detalle', sa.String(), nullable=False),
    sa.Column('codigo', sa.String(), nullable=False),
    sa.Column('ecopuntos', sa.Integer(), nullable=False),
    sa.Column('valor_max', sa.Integer(), nullable=False),
    sa.Column('valor_min', sa.Integer(), nullable=False),
    sa.Column('tipo_producto_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['tipo_producto_id'], ['tipoProductos.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bodegueros',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cedula', sa.String(), nullable=False),
    sa.Column('fecha_nacimiento', sa.String(), nullable=True),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('apellido', sa.String(), nullable=True),
    sa.Column('direccion', sa.String(), nullable=True),
    sa.Column('genero', sa.String(), nullable=False),
    sa.Column('correo', sa.String(), nullable=False),
    sa.Column('telefono', sa.String(), nullable=True),
    sa.Column('regional_id', sa.Integer(), nullable=True),
    sa.Column('sector_id', sa.Integer(), nullable=False),
    sa.Column('usuario_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['regional_id'], ['regionales.id'], ),
    sa.ForeignKeyConstraint(['sector_id'], ['sectores.id'], ),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('canjes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('numero_semana', sa.String(), nullable=False),
    sa.Column('mes', sa.String(), nullable=False),
    sa.Column('año', sa.String(), nullable=False),
    sa.Column('cliente', sa.String(), nullable=True),
    sa.Column('entrada', sa.Boolean(), nullable=False),
    sa.Column('total_ecopuntos', sa.Integer(), nullable=True),
    sa.Column('ecoamigo_id', sa.Integer(), nullable=True),
    sa.Column('bodeguero_id', sa.Integer(), nullable=False),
    sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['bodeguero_id'], ['bodegueros.id'], ),
    sa.ForeignKeyConstraint(['ecoamigo_id'], ['ecoAmigos.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('detalle_canje',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('canje_id', sa.Integer(), nullable=True),
    sa.Column('producto_id', sa.Integer(), nullable=True),
    sa.Column('numero_semana', sa.String(), nullable=False),
    sa.Column('mes', sa.String(), nullable=False),
    sa.Column('año', sa.String(), nullable=False),
    sa.Column('ecopuntos', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['canje_id'], ['canjes.id'], ),
    sa.ForeignKeyConstraint(['producto_id'], ['productos.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('detalle_ticket', sa.Column('numero_semana', sa.String()))
    op.add_column('detalle_ticket', sa.Column('mes', sa.String()))
    op.add_column('detalle_ticket', sa.Column('año', sa.String()))
    op.add_column('tickets', sa.Column('mes', sa.String()))
    op.add_column('tickets', sa.Column('año', sa.String()))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tickets', 'año')
    op.drop_column('tickets', 'mes')
    op.drop_column('detalle_ticket', 'año')
    op.drop_column('detalle_ticket', 'mes')
    op.drop_column('detalle_ticket', 'numero_semana')
    op.drop_table('detalle_canje')
    op.drop_table('canjes')
    op.drop_table('bodegueros')
    op.drop_table('productos')
    op.drop_table('tipoProductos')
    # ### end Alembic commands ###