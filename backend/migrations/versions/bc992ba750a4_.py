"""empty message

Revision ID: bc992ba750a4
Revises: 6182e4a3e261
Create Date: 2021-06-29 13:43:53.667031

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc992ba750a4'
down_revision = '6182e4a3e261'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ecoAdmins', sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('ecoAmigos', sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('ecoTiendas', sa.Column('fecha_registro', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('ecoTiendas', 'fecha_registro')
    op.drop_column('ecoAmigos', 'fecha_registro')
    op.drop_column('ecoAdmins', 'fecha_registro')
    # ### end Alembic commands ###