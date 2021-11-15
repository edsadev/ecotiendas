"""empty message

Revision ID: e2a6a61cbe1a
Revises: 0804bf672aba
Create Date: 2021-11-15 17:47:55.927644

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2a6a61cbe1a'
down_revision = '0804bf672aba'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    op.add_column('codigos', sa.Column('descripcion', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('codigos', 'descripcion')
    # ### end Alembic commands ###