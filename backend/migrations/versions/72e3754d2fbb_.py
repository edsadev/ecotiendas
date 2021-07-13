"""empty message

Revision ID: 72e3754d2fbb
Revises: 08ec2094a0da
Create Date: 2021-07-12 15:27:08.372054

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '72e3754d2fbb'
down_revision = '08ec2094a0da'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('zonales',
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
    sa.Column('usuario_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.add_column('bodegueros', sa.Column('zonal_id', sa.Integer(), nullable=True))
    op.drop_constraint('bodegueros_regional_id_fkey', 'bodegueros', type_='foreignkey')
    op.create_foreign_key(None, 'bodegueros', 'zonales', ['zonal_id'], ['id'])
    op.drop_column('bodegueros', 'regional_id')
    op.alter_column('detalle_ticket', 'numero_semana',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.add_column('ecoAdmins', sa.Column('zonal_id', sa.Integer(), nullable=True))
    op.drop_constraint('ecoAdmins_regional_id_fkey', 'ecoAdmins', type_='foreignkey')
    op.create_foreign_key(None, 'ecoAdmins', 'zonales', ['zonal_id'], ['id'])
    op.drop_column('ecoAdmins', 'regional_id')
    op.add_column('ecoTiendas', sa.Column('zonal_id', sa.Integer(), nullable=True))
    op.drop_constraint('ecoTiendas_regional_id_fkey', 'ecoTiendas', type_='foreignkey')
    op.create_foreign_key(None, 'ecoTiendas', 'zonales', ['zonal_id'], ['id'])
    op.drop_column('ecoTiendas', 'regional_id')
    op.add_column('tickets', sa.Column('zonal_id', sa.Integer(), nullable=True))
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.create_foreign_key(None, 'tickets', 'zonales', ['zonal_id'], ['id'])
    op.drop_table('regionales')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tickets', type_='foreignkey')
    op.alter_column('tickets', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('tickets', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('tickets', 'zonal_id')
    op.add_column('ecoTiendas', sa.Column('regional_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'ecoTiendas', type_='foreignkey')
    op.create_foreign_key('ecoTiendas_regional_id_fkey', 'ecoTiendas', 'regionales', ['regional_id'], ['id'])
    op.drop_column('ecoTiendas', 'zonal_id')
    op.add_column('ecoAdmins', sa.Column('regional_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'ecoAdmins', type_='foreignkey')
    op.create_foreign_key('ecoAdmins_regional_id_fkey', 'ecoAdmins', 'regionales', ['regional_id'], ['id'])
    op.drop_column('ecoAdmins', 'zonal_id')
    op.alter_column('detalle_ticket', 'año',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'mes',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('detalle_ticket', 'numero_semana',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.add_column('bodegueros', sa.Column('regional_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'bodegueros', type_='foreignkey')
    op.create_foreign_key('bodegueros_regional_id_fkey', 'bodegueros', 'regionales', ['regional_id'], ['id'])
    op.drop_column('bodegueros', 'zonal_id')
    op.create_table('regionales',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('cedula', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('fecha_nacimiento', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('nombre', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('fecha_registro', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('apellido', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('direccion', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('genero', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('correo', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('telefono', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('usuario_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], name='regionales_usuario_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='regionales_pkey')
    )
    op.drop_table('zonales')
    # ### end Alembic commands ###
